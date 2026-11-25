# Kampüs API — Sprint 9: Tam CRUD ve sorgular

**Öğrenci:** Abdelrahman Zidan · **Numara:** 2321032807

Sprint 8'deki MongoDB API'sine güncelleme (PATCH), silme (DELETE), arama/filtre ve
yaklaşan etkinlikler eklendi. Tarihler API'de `"GG-AA-YYYY"`, veritabanında gerçek `Date`'tir.
Frontend bu sprintte değişmez. JWT Sprint 10, frontend bağlantısı Sprint 11 kapsamındadır.

## Dosya yapısı

| Dosya | Görev |
|---|---|
| `src/config/database.js` | `connectDatabase()`: `process.env.MONGODB_URI` ile bağlanır, URI'yi yazdırmaz |
| `src/models/event-model.js` | `Event` modeli ve schema kuralları |
| `src/utils/date.js` | `parseDate`, `formatDate`, `todayStart`: "GG-AA-YYYY" ↔ `Date` |
| `src/routes/event-routes.js` | Route'lar; `/upcoming`, `/:id`'den önce |
| `src/data/seed-events.js` | Altı örnek etkinlik, ikisi geçmiş tarihli (id alanı yok, `_id` MongoDB'den gelir) |
| `src/seed.js` | `npm run seed`: önce `deleteMany`, sonra `insertMany` |
| `src/controllers/event-controller.js` | Listeleme, arama, yaklaşan, tek kayıt, ekleme, güncelleme, silme |
| `src/app.js` | Route'lar, 404 ve hata yakalayıcı middleware |
| `src/server.js` | Önce veritabanı, sonra `app.listen` |
| `requests/kampus-api.json` | 18 Postman isteği, 45 test (kaynak: https://webdersi.vercel.app/test.json) |
| `requests/run-results.json` | Collection çalıştırma sonucu: 18 istek, 45 test, 0 hata |
| `tests/api.test.js` | Geçici MongoDB ile otomatik testler |

## Kurulum

Node.js 22 veya üzeri. Repository kökünden:

```bash
cd kampus-etkinlik/backend
npm install
cp .env.example .env        # Windows PowerShell: Copy-Item .env.example .env
```

`.env` içinde `MONGODB_URI` satırına **kendi** MongoDB Atlas adresinizi yazın
(Atlas › cluster › Connect › Drivers; `<db_password>` yerine şifre; `.net/` sonrasına `kampus`):

```dotenv
PORT=3000
MONGODB_URI=<Atlas bağlantı adresiniz>/kampus
```

`.env` Git'e gönderilmez (`.gitignore`). `.env.example` yalnızca yer tutucu içerir.
Gerçek adres ve şifre hiçbir commit'e, README'ye veya Postman dosyasına yazılmaz.

```bash
npm run seed   # "6 etkinlik eklendi" — önceki kayıtları siler; kaç kez çalışırsa çalışsın 6 kayıt
npm run dev    # "MongoDB bağlandı (Atlas): ...mongodb.net/kampus" ve "API: http://localhost:3000"
```

## Schema kuralları

| Alan | Kural |
|---|---|
| `title` | zorunlu, `trim`, 3–100 karakter |
| `category` | zorunlu, `Seminer`, `Atölye`, `Söyleşi`, `Yarışma` değerlerinden biri |
| `date` | zorunlu, `Date`; API'de `"GG-AA-YYYY"` (`2026-12-20`, `31-02-2026` → 400) |
| `capacity` | sayı, en az 0, varsayılan 0 |
| `time`, `location` | metin, varsayılan `""` |
| `description` | metin, en fazla 500 karakter, varsayılan `""` |
| — | `timestamps: true` → `createdAt`, `updatedAt` |

İstemci `_id`, `createdAt` gibi alanları belirleyemez; yalnızca yukarıdaki alanlar kaydedilir.

## REST sözleşmesi

| Method | Endpoint | Başarılı | Hata | Durum |
|---|---|---|---|---|
| GET | `/health` | 200 | — | çalışıyor |
| GET | `/events` `?search=` & `?category=` | 200 | — | çalışıyor |
| GET | `/events/upcoming` | 200 · tarihe göre sıralı | — | çalışıyor |
| GET | `/events/:id` | 200 | 404 | çalışıyor |
| POST | `/events` | 201 | 400 | çalışıyor |
| PATCH | `/events/:id` | 200 · güncel kayıt | 400, 404 | çalışıyor |
| DELETE | `/events/:id` | 204 · gövde yok | 404 | çalışıyor |

Hata biçimi her yerde `{ "error": { "message": "…" } }`.

- **PATCH:** sadece gönderilen alanlar değişir. Boş gövde, `_id` / `createdAt` / `updatedAt` / `__v`,
  yalnızca bilinmeyen alanlar, geçersiz kategori ya da tarih → 400. Alanlardan biri geçersizse hiçbiri kaydedilmez.
- **DELETE:** ilk istek 204 (gövde yok), aynı istek tekrar 404.
- **`?search=`:** başlıkta büyük/küçük harf ayırmadan arar; `(`, `*`, `?` gibi işaretler düz metindir.
  `?category=` ile birlikte kullanılabilir. Terminalde: `curl -G localhost:3000/events --data-urlencode "search=atölye"`.
- **`/events/upcoming`:** bugün (UTC) ve sonrası, tarih ve saate göre en yakın önce.
- Geçersiz biçimli id (`/events/yok`, `/events/111111`): `isValidObjectId` → **404**, 500 değil.
- Eksik veri: `ValidationError` → **400**, örn.
  `{"error":{"message":"Event validation failed: date: Path `date` is required., ..."}}`
- Beklenmeyen hata: terminale yazılır, kullanıcıya `{"error":{"message":"Server error"}}` (500).
  Sunucu çökmez; ardından `/health` yine 200 döner.

## Postman ve newman

1. `npm run seed`, sonra `npm run dev`.
2. Postman › **Import** › `requests/kampus-api.json` (ya da `https://webdersi.vercel.app/test.json`).
3. Collection'a sağ tık › **Run collection** › **Run**. Beklenen: **18 istek, 45 test, 0 hata**.

Aynı testler terminalde:

```bash
npm i -g newman
newman run https://webdersi.vercel.app/test.json
```

`02` listedeki ilk `_id`'yi, `05` yeni kaydın `_id`'sini değişkene kaydeder; PATCH ve DELETE
o yeni kayıtla çalışır. Seed verisi bozulmadığı için istenildiği kadar tekrar çalıştırılabilir.

`requests/run-results.json`, hocanın collection'ının newman JSON reporter çıktısıdır:

```bash
newman run https://webdersi.vercel.app/test.json -r cli,json --reporter-json-export requests/run-results.json
```

### Kalıcılık testi

1. `npm run seed`, `npm run dev`
2. POST `/events` → 201, `_id`'yi not alın
3. Terminalde `Ctrl+C`, tekrar `npm run dev`
4. GET `/events` → 7 kayıt, yeni kayıt listede; Atlas › Browse Collections › `events`'te de görünür

## Otomatik test

```bash
npm test
```

Testler Atlas'a dokunmaz: geçici, boş bir MongoDB açar (ilk çalıştırmada MongoDB
ikili dosyası bir kez indirilir). Seed'i iki kez çalıştırır, gerçek sunucuyu başlatır,
collection'daki 18 isteği gönderir; ayrıca tarih dönüşümünü, PATCH doğrulamasını ve korunan
alanları, aramadaki özel işaretleri, `/upcoming` sınırını (bugün dahil, dün hariç) ve
yeniden başlatmadan sonra kaydın durduğunu kontrol eder.

## Teslim kontrolü

```bash
git status
git ls-files -- '*node_modules*' '*.env'   # çıktı boş olmalı
git log -p | grep -nE "mongodb\+srv://[^\"]+@"  # gerçek adres: çıktı boş olmalı
```
