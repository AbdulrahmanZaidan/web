import test from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
import { readFile } from "node:fs/promises";
import app from "../src/app.js";

test("Sprint 7 REST API sözleşmesi", async (t) => {
  const server = app.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(() => new Promise((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
  }));
  const base = `http://127.0.0.1:${server.address().port}`;
  const collection = JSON.parse(await readFile(new URL("../requests/kampus-api.json", import.meta.url), "utf8"));
  assert.equal(collection.item.length, 6);
  const expected = [200, 200, 200, 404, 201, 400];
  let created;

  // Teslim edilecek collection'daki gerçek istek gövdelerini kullanır.
  for (const [index, item] of collection.item.entries()) {
    await t.test(item.name, async () => {
      const request = item.request;
      const path = new URL(request.url.raw).pathname;
      const response = await fetch(base + path, {
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
        assert.equal(new Date(data.time).toISOString(), data.time);
      } else if (index === 1) {
        assert.equal(data.length, 6);
        assert.deepEqual(data.map((event) => event.id), [1, 2, 3, 4, 5, 6].map((id) => `event-${id}`));
        assert.ok(data.every((event) => !Object.hasOwn(event, "image")));
      } else if (index === 2) {
        assert.equal(data.id, "event-2");
      } else if (index === 3) {
        assert.deepEqual(data, { error: { message: "Event not found" } });
      } else if (index === 4) {
        created = data;
        assert.match(data.id, /^event-/);
        const { id, ...fields } = data;
        assert.deepEqual(fields, JSON.parse(request.body.raw));
      } else {
        assert.deepEqual(data, { error: { message: "title, category and date are required" } });
      }
    });
  }

  await t.test("POST kaydı listede ve detayda görünür; hatalı POST kayıt eklemez", async () => {
    const list = await (await fetch(base + "/events")).json();
    assert.equal(list.length, 7);
    assert.deepEqual(list.find((event) => event.id === created.id), created);
    assert.deepEqual(await (await fetch(base + "/events/" + created.id)).json(), created);
  });

  await t.test("Kategori filtresi ve CORS", async () => {
    const response = await fetch(base + "/events?category=" + encodeURIComponent("Atölye"), {
      headers: { Origin: "http://localhost:5173" },
    });
    const data = await response.json();
    assert.equal(response.headers.get("access-control-allow-origin"), "*");
    assert.ok(data.length > 0);
    assert.ok(data.every((event) => event.category === "Atölye"));
    assert.deepEqual(await (await fetch(base + "/events?category=Yok")).json(), []);
  });

  await t.test("Eksik, boş, yanlış tipli gövde ve bozuk JSON: 400", async () => {
    const invalidBodies = [undefined, "{}", "null", "[]", '{"title":', JSON.stringify({ title: " ", category: "Atölye", date: "2026-12-01" }), JSON.stringify({ title: 15, category: "Atölye", date: "2026-12-01" })];
    for (const body of invalidBodies) {
      const response = await fetch(base + "/events", { method: "POST", headers: { "Content-Type": "application/json" }, body });
      assert.equal(response.status, 400);
      assert.equal(typeof (await response.json()).error.message, "string");
    }
    assert.equal((await (await fetch(base + "/events")).json()).length, 7);
  });

  await t.test("Bilinmeyen route: JSON 404", async () => {
    const response = await fetch(base + "/yok");
    assert.equal(response.status, 404);
    assert.deepEqual(await response.json(), { error: { message: "Route not found" } });
  });

  await t.test("Sadece zorunlu alanlar kabul edilir ve kimlikler benzersizdir", async () => {
    const body = JSON.stringify({ title: "Deneme", category: "Seminer", date: "2026-12-01", id: "event-2" });
    const responses = await Promise.all(Array.from({ length: 5 }, () => fetch(base + "/events", {
      method: "POST", headers: { "Content-Type": "application/json" }, body,
    })));
    assert.ok(responses.every((response) => response.status === 201));
    const data = await Promise.all(responses.map((response) => response.json()));
    assert.equal(new Set(data.map((event) => event.id)).size, 5);
    assert.ok(data.every((event) => event.id !== "event-2" && event.capacity === 0 && event.time === "" && event.location === "" && event.description === ""));
  });
});
