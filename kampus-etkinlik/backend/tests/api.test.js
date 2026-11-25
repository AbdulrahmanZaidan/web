// Sprint 9 otomatik testleri. Gerçek Atlas veritabanına dokunmaz:
// geçici, boş bir MongoDB (mongodb-memory-server) açılır ve test bitince silinir.
import test from "node:test";
import assert from "node:assert/strict";
import { spawn, execFile } from "node:child_process";
import { promisify } from "node:util";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { MongoMemoryServer } from "mongodb-memory-server-core";
import { formatDate, parseDate, todayStart } from "../src/utils/date.js";

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
  const text = await response.text(); // 204'ün gövdesi yoktur
  return {
    status: response.status,
    type: response.headers.get("content-type"),
    text,
    data: text ? JSON.parse(text) : undefined,
  };
};
const send = (method, path, body) => json(path, {
  method, headers: { "Content-Type": "application/json" }, body,
});
const post = (body) => send("POST", "/events", body);
const patch = (id, value) => send("PATCH", "/events/" + id, JSON.stringify(value));
const search = (params) => json("/events?" + new URLSearchParams(params));
const dayOffset = (days) => formatDate(new Date(todayStart().getTime() + days * 86400000));

test("utils/date.js: GG-AA-YYYY ↔ Date", () => {
  assert.equal(parseDate("15-10-2026").toISOString(), "2026-10-15T00:00:00.000Z");
  assert.equal(formatDate(parseDate("05-11-2026")), "05-11-2026");
  assert.equal(formatDate(parseDate("29-02-2028")), "29-02-2028", "artık yıl");
  for (const value of ["2026-12-20", "31-02-2026", "29-02-2026", "00-01-2026", "01-13-2026", "1-1-2026", "", "abc", 5]) {
    assert.ok(Number.isNaN(parseDate(value).getTime()), `geçersiz olmalı: ${value}`);
  }
  assert.equal(parseDate(null), null);
  assert.equal(todayStart().getUTCHours(), 0);
});

test("Sprint 9: tam CRUD, arama ve yaklaşan etkinlikler", async (t) => {
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
  assert.equal(collection.item.length, 18);
  const expected = [200, 200, 200, 404, 201, 400, 400, 200, 200, 400, 400, 400, 404, 200, 200, 200, 204, 404];
  const variables = { baseUrl: base };
  const fill = (text) => text.replace(/\{\{(\w+)\}\}/g, (_, key) => variables[key]);

  // Teslim edilen Postman collection'ındaki 18 gerçek istek sırayla gönderilir.
  for (const [index, item] of collection.item.entries()) {
    await t.test(item.name, async () => {
      const { method, header, url, body } = item.request;
      const response = await fetch(fill(url.raw), {
        method,
        headers: Object.fromEntries(header.map(({ key, value }) => [key, value])),
        body: body?.raw,
      });
      assert.equal(response.status, expected[index]);
      const text = await response.text();
      if (response.status === 204) {
        assert.equal(text, "");
        return;
      }
      assert.match(response.headers.get("content-type"), /application\/json/);
      const data = JSON.parse(text);
      if (response.status >= 400) {
        assert.deepEqual(Object.keys(data), ["error"]);
        assert.equal(typeof data.error.message, "string");
      }
      const no = index + 1;
      if (no === 1) {
        assert.equal(data.status, "ok");
        assert.equal(data.student, "2321032807");
      } else if (no === 2) {
        assert.equal(data.length, 6);
        assert.ok(data.every((event) => event._id && event.createdAt && event.updatedAt));
        assert.ok(data.every((event) => /^\d{2}-\d{2}-\d{4}$/.test(event.date) && !("id" in event)));
        variables.eventId = data[0]._id;
      } else if (no === 3) {
        assert.equal(data._id, variables.eventId);
      } else if (no === 5) {
        assert.equal(data.date, "20-12-2026");
        variables.newId = data._id;
      } else if (no === 8) {
        assert.equal(data.capacity, 55);
        assert.equal(data.title, "Runner Test Etkinliği");
      } else if (no === 9) {
        assert.equal(data.date, "25-12-2026");
      } else if (no === 10) {
        assert.equal(data.error.message, "Body is empty");
      } else if (no === 12) {
        assert.equal(data.error.message, "_id cannot be changed");
      } else if (no === 14 || no === 15) {
        assert.ok(data.length >= 1);
        assert.ok(data.every((event) => event.title.toLocaleLowerCase("tr").includes("atölye")));
      } else if (no === 16) {
        assert.ok(data.every((event) => parseDate(event.date) >= todayStart()));
      }
    });
  }

  await t.test("DELETE: liste 7'den 6'ya döner, silinen kayıt GET/PATCH ile de 404", async () => {
    assert.equal((await json("/events")).data.length, 6);
    assert.equal((await json("/events/" + variables.newId)).status, 404);
    assert.equal((await patch(variables.newId, { capacity: 1 })).status, 404);
    for (const id of ["yok", "111111", "507f1f77bcf86cd799439011"]) {
      const { status, data } = await send("DELETE", "/events/" + id);
      assert.equal(status, 404);
      assert.deepEqual(data, { error: { message: "Event not found" } });
    }
  });

  await t.test("Geçerli biçimde ama olmayan id ve '111111': 404 (500 değil)", async () => {
    for (const id of ["507f1f77bcf86cd799439011", "111111", "yok"]) {
      const { status, data } = await json("/events/" + id);
      assert.equal(status, 404);
      assert.deepEqual(data, { error: { message: "Event not found" } });
    }
  });

  await t.test("Schema kuralları: enum, minlength, trim, yanlış tip, bozuk JSON → 400", async () => {
    const valid = { title: "Deneme Etkinliği", category: "Seminer", date: "01-12-2026" };
    const invalidBodies = [
      JSON.stringify({ ...valid, category: "Parti" }),
      JSON.stringify({ ...valid, title: "X" }),
      JSON.stringify({ ...valid, title: "   " }),
      JSON.stringify({ ...valid, capacity: -5 }),
      JSON.stringify({ ...valid, capacity: "abc" }),
      JSON.stringify({ ...valid, date: "2026-12-20" }),
      JSON.stringify({ ...valid, date: "31-02-2026" }),
      JSON.stringify({ ...valid, date: 20122026 }),
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
      title: "Kimlik Denemesi", category: "Atölye", date: "02-12-2026",
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

  await t.test("PATCH: trim, kısmi güncelleme, doğrulama ve korunan alanlar", async () => {
    const { data: original } = await post(JSON.stringify({
      title: "Güncelleme Denemesi", category: "Seminer", date: "10-12-2026", capacity: 10, location: "A101",
    }));
    const id = original._id;
    const ok = await patch(id, { title: "  Yeni Başlık  " });
    assert.equal(ok.status, 200);
    assert.equal(ok.data.title, "Yeni Başlık");
    assert.deepEqual(
      [ok.data.category, ok.data.date, ok.data.capacity, ok.data.location, ok.data.createdAt],
      ["Seminer", "10-12-2026", 10, "A101", original.createdAt],
    );
    assert.notEqual(ok.data.updatedAt, original.updatedAt);
    assert.deepEqual((await json("/events/" + id)).data, ok.data, "yanıt veritabanındaki kayıtla aynı");

    const bad = [
      {}, [], [1], null, { title: "X" }, { title: "   " }, { title: null }, { category: "Parti" },
      { capacity: -1 }, { capacity: "abc" }, { capacity: {} }, { date: "2026-12-20" }, { date: "31-02-2026" },
      { date: null }, { date: "" }, { date: 5 }, { description: "a".repeat(501) },
      { _id: "abc" }, { createdAt: "2000-01-01" }, { updatedAt: "2000-01-01" }, { __v: 9 },
      { capacity: 20, _id: "abc" },
      { $set: { createdAt: "2000-01-01", category: "Parti" } }, { $unset: { title: 1 } }, { bilinmeyen: 1 },
    ];
    for (const body of bad) {
      const { status, data } = await patch(id, body);
      assert.equal(status, 400, `beklenen 400: ${JSON.stringify(body)}`);
      assert.equal(typeof data.error.message, "string");
    }
    assert.equal((await send("PATCH", "/events/" + id, '{"title":')).status, 400);
    assert.equal((await send("PATCH", "/events/" + id)).data.error.message, "Body is empty");
    assert.deepEqual((await json("/events/" + id)).data, ok.data, "reddedilen istekler kaydı değiştirmez");
  });

  await t.test("Arama: büyük/küçük harf, kategori ile birlikte, özel işaretler", async () => {
    assert.equal((await search({ search: "SENSÖR" })).data.length, 1);
    assert.equal((await search({ search: "saksı", category: "Atölye" })).data.length, 1);
    assert.deepEqual((await search({ search: "saksı", category: "Seminer" })).data, []);
    for (const value of ["(", "[", "*", "\\", "$", ".*", "a+b{"]) {
      const { status, data } = await search({ search: value });
      assert.equal(status, 200, value);
      assert.deepEqual(data, [], value);
    }
    assert.equal((await search({ search: "?" })).data.length, 1, "başlığında ? olan tek seed kaydı");
    for (const query of ["search=a&search=b", "search[$ne]=x", "category[$ne]=x", "category=a&category=b", "search=&category="]) {
      assert.equal((await json("/events?" + query)).status, 200, query);
    }
  });

  await t.test("/events/upcoming: bugün dahil, dün hariç, tarih+saat sıralı", async () => {
    const add = async (title, date, time) =>
      (await post(JSON.stringify({ title, category: "Seminer", date, time }))).data._id;
    const yesterday = await add("Dünkü Etkinlik", dayOffset(-1), "10:00");
    const late = await add("Bugün Akşam", dayOffset(0), "18:00");
    const early = await add("Bugün Sabah", dayOffset(0), "09:00");
    const { status, data } = await json("/events/upcoming");
    assert.equal(status, 200);
    assert.deepEqual(data.slice(0, 2).map((event) => event._id), [early, late]);
    const ids = data.map((event) => event._id);
    assert.ok(!ids.includes(yesterday));
    const titles = data.map((event) => event.title);
    assert.ok(!titles.includes("Kampüste Açık Kaynak Buluşması") && !titles.includes("Sensörlerle Akıllı Saksı Atölyesi"));
    const keys = data.map((event) => parseDate(event.date).toISOString() + event.time);
    assert.deepEqual(keys, [...keys].sort());
    // Metin sıralamasında 05-11, 15-10'dan önce gelirdi; Date ile Ekim önce gelir.
    const all = (await json("/events")).data.map((event) => event.date);
    assert.ok(all.indexOf("15-10-2026") < all.indexOf("05-11-2026"));
  });

  await t.test("Sunucu yeniden başlayınca POST ile eklenen kayıt duruyor", async () => {
    const created = (await post(JSON.stringify({ title: "Kalıcı Kayıt", category: "Yarışma", date: "18-12-2026" }))).data;
    await stopServer(server);
    server = await startServer(env);
    const { status, data } = await json("/events/" + created._id);
    assert.equal(status, 200);
    assert.deepEqual(data, created);
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
