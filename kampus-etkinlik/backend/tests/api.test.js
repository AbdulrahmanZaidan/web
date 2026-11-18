// Sprint 8 otomatik testleri. Gerçek Atlas veritabanına dokunmaz:
// geçici, boş bir MongoDB (mongodb-memory-server) açılır ve test bitince silinir.
import test from "node:test";
import assert from "node:assert/strict";
import { spawn, execFile } from "node:child_process";
import { promisify } from "node:util";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { MongoMemoryServer } from "mongodb-memory-server-core";

const run = promisify(execFile);
const backendDir = fileURLToPath(new URL("..", import.meta.url));
const TEST_PORT = "3099";
const base = `http://127.0.0.1:${TEST_PORT}`;

// Gerçek sunucuyu (src/server.js) ayrı bir süreç olarak başlatır.
async function startServer(env) {
  const child = spawn(process.execPath, ["src/server.js"], { cwd: backendDir, env });
  let output = "";
  child.stdout.on("data", (chunk) => { output += chunk; });
  child.stderr.on("data", (chunk) => { output += chunk; });
  const deadline = Date.now() + 20000;
  while (!output.includes("API: http://localhost:")) {
    if (child.exitCode !== null) throw new Error(`Sunucu kapandı:\n${output}`);
    if (Date.now() > deadline) throw new Error(`Sunucu açılmadı:\n${output}`);
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  return { child, output: () => output };
}

async function stopServer(server) {
  if (server.child.exitCode !== null) return;
  server.child.kill();
  await new Promise((resolve) => server.child.once("exit", resolve));
}

const json = async (path, options) => {
  const response = await fetch(base + path, options);
  return { status: response.status, type: response.headers.get("content-type"), data: await response.json() };
};
const post = (body) => json("/events", {
  method: "POST", headers: { "Content-Type": "application/json" }, body,
});

test("Sprint 8: MongoDB ile kalıcı REST API", async (t) => {
  const mongo = await MongoMemoryServer.create();
  t.after(() => mongo.stop());
  // Atlas adresi yerine boş test veritabanı verilir (değerlendirme de böyle yapılır).
  const env = { ...process.env, PORT: TEST_PORT, MONGODB_URI: mongo.getUri("kampus") };

  await t.test("npm run seed: 6 kayıt; iki kez çalışınca da 6", async () => {
    for (let i = 0; i < 2; i++) {
      const { stdout } = await run(process.execPath, ["src/seed.js"], { cwd: backendDir, env });
      assert.match(stdout, /6 etkinlik eklendi/);
      assert.match(stdout, /MongoDB bağlandı \(yerel\)/);
      assert.doesNotMatch(stdout, /mongodb:\/\//, "URI terminale yazdırılmamalı");
    }
  });

  let server = await startServer(env);
  t.after(() => stopServer(server));

  const collection = JSON.parse(await readFile(new URL("../requests/kampus-api.json", import.meta.url), "utf8"));
  assert.equal(collection.item.length, 6);
  const expected = [200, 200, 200, 404, 201, 400];
  const variables = {};
  let created;

  // Teslim edilecek Postman collection'ındaki gerçek istekler sırayla gönderilir.
  for (const [index, item] of collection.item.entries()) {
    await t.test(item.name, async () => {
      const request = item.request;
      const raw = request.url.raw.replace(/\{\{(\w+)\}\}/g, (_, key) => variables[key]);
      const response = await fetch(base + new URL(raw).pathname, {
        method: request.method,
        headers: Object.fromEntries(request.header.map(({ key, value }) => [key, value])),
        body: request.body?.raw,
      });
      assert.equal(response.status, expected[index]);
      assert.match(response.headers.get("content-type"), /application\/json/);
      const data = await response.json();
      if (index === 0) {
        assert.equal(data.status, "ok");
        assert.equal(data.student, "2321032807");
      } else if (index === 1) {
        assert.equal(data.length, 6);
        assert.ok(data.every((event) => event._id && event.createdAt && event.updatedAt));
        variables.eventId = data[0]._id;
      } else if (index === 2) {
        assert.equal(data._id, variables.eventId);
      } else if (index === 3) {
        assert.deepEqual(data, { error: { message: "Event not found" } });
      } else if (index === 4) {
        created = data;
        assert.match(data._id, /^[0-9a-f]{24}$/);
        assert.ok(data.createdAt);
        const sent = JSON.parse(request.body.raw);
        for (const key of Object.keys(sent)) assert.equal(data[key], sent[key]);
      } else {
        assert.match(data.error.message, /required/);
      }
    });
  }

  await t.test("Geçerli biçimde ama olmayan id ve '111111': 404 (500 değil)", async () => {
    for (const id of ["507f1f77bcf86cd799439011", "111111", "yok"]) {
      const { status, data } = await json("/events/" + id);
      assert.equal(status, 404);
      assert.deepEqual(data, { error: { message: "Event not found" } });
    }
  });

  await t.test("Schema kuralları: enum, minlength, trim, yanlış tip, bozuk JSON → 400", async () => {
    const valid = { title: "Deneme Etkinliği", category: "Seminer", date: "2026-12-01" };
    const invalidBodies = [
      JSON.stringify({ ...valid, category: "Parti" }),
      JSON.stringify({ ...valid, title: "X" }),
      JSON.stringify({ ...valid, title: "   " }),
      JSON.stringify({ ...valid, capacity: -5 }),
      JSON.stringify({ ...valid, capacity: "abc" }),
      "{}", "null", "[]", '{"title":', undefined,
    ];
    for (const body of invalidBodies) {
      const { status, data } = await post(body);
      assert.equal(status, 400, `beklenen 400: ${body}`);
      assert.equal(typeof data.error.message, "string");
    }
    const { status, data } = await post(JSON.stringify({ ...valid, title: "  Boşluklu Başlık  " }));
    assert.equal(status, 201);
    assert.equal(data.title, "Boşluklu Başlık");
    assert.equal(data.capacity, 0);
  });

  await t.test("İstemci _id veya createdAt belirleyemez", async () => {
    const { status, data } = await post(JSON.stringify({
      title: "Kimlik Denemesi", category: "Atölye", date: "2026-12-02",
      _id: "507f1f77bcf86cd799439011", createdAt: "2000-01-01T00:00:00.000Z",
    }));
    assert.equal(status, 201);
    assert.notEqual(data._id, "507f1f77bcf86cd799439011");
    assert.notEqual(data.createdAt, "2000-01-01T00:00:00.000Z");
  });

  await t.test("Hatalı POST'tan sonra sunucu çökmez: /health 200", async () => {
    await post('{"title":');
    const { status, data } = await json("/health");
    assert.equal(status, 200);
    assert.equal(data.status, "ok");
  });

  await t.test("Kategori filtresi ve bilinmeyen route", async () => {
    const { data } = await json("/events?category=" + encodeURIComponent("Atölye"));
    assert.ok(data.length > 0 && data.every((event) => event.category === "Atölye"));
    assert.deepEqual((await json("/events?category=Yok")).data, []);
    const notFound = await json("/yok");
    assert.equal(notFound.status, 404);
    assert.deepEqual(notFound.data, { error: { message: "Route not found" } });
  });

  await t.test("Sunucu yeniden başlayınca POST ile eklenen kayıt duruyor", async () => {
    await stopServer(server);
    server = await startServer(env);
    const { status, data } = await json("/events/" + created._id);
    assert.equal(status, 200);
    assert.equal(data.title, created.title);
    const list = (await json("/events")).data;
    assert.ok(list.some((event) => event._id === created._id));
  });

  await t.test("MONGODB_URI yoksa sunucu açık hata verip kapanır", async () => {
    const { MONGODB_URI, ...rest } = env;
    // dotenv gerçek .env dosyasını okumasın diye var olmayan bir yol verilir.
    const child = spawn(process.execPath, ["src/server.js"], {
      cwd: backendDir, env: { ...rest, DOTENV_CONFIG_PATH: "/nonexistent/.env" },
    });
    let output = "";
    child.stderr.on("data", (chunk) => { output += chunk; });
    const [code] = await new Promise((resolve) => child.once("exit", (...args) => resolve(args)));
    assert.equal(code, 1);
    assert.match(output, /MONGODB_URI tanımlı değil/);
  });
});
