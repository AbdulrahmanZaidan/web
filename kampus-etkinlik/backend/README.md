# Kampüs API — Sprint 8: MongoDB ve Mongoose

**Öğrenci:** Abdelrahman Zidan · **Numara:** 2321032807

Sprint 7'deki Express API artık verisini RAM'deki dizide değil **MongoDB**'de tutar.
Adresler ve durum kodları aynı kaldı; sunucu kapanıp açılınca POST ile eklenen kayıtlar durur.
Frontend bu sprintte değişmez. Güncelleme/silme Sprint 9, JWT Sprint 10,
frontend bağlantısı Sprint 11 kapsamındadır.

## Dosya yapısı

| Dosya | Görev |
|---|---|
| `src/config/database.js` | `connectDatabase()`: `process.env.MONGODB_URI` ile bağlanır, URI'yi yazdırmaz |
| `src/models/event-model.js` | `Event` modeli ve schema kuralları |
| `src/data/seed-events.js` | Altı örnek etkinlik (id alanı yok, `_id` MongoDB'den gelir) |
| `src/seed.js` | `npm run seed`: önce `deleteMany`, sonra `insertMany` |
| `src/controllers/event-controller.js` | `Event.find / findById / create` ile async controller'lar |
| `src/app.js` | Route'lar, 404 ve hata yakalayıcı middleware |
| `src/server.js` | Önce veritabanı, sonra `app.listen` |
| `requests/kampus-api.json` | Altı Postman isteği ve yanıt testleri |
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
npm run seed   # "6 etkinlik eklendi" — kaç kez çalışırsa çalışsın 6 kayıt
npm run dev    # "MongoDB bağlandı (Atlas): ...mongodb.net/kampus" ve "API: http://localhost:3000"
```

## Schema kuralları

| Alan | Kural |
|---|---|
| `title` | zorunlu, `trim`, 3–100 karakter |
| `category` | zorunlu, `Seminer`, `Atölye`, `Söyleşi`, `Yarışma` değerlerinden biri |
| `date` | zorunlu, `trim` |
| `capacity` | sayı, en az 0, varsayılan 0 |
| `time`, `location` | metin, varsayılan `""` |
| `description` | metin, en fazla 500 karakter, varsayılan `""` |
| — | `timestamps: true` → `createdAt`, `updatedAt` |

İstemci `_id`, `createdAt` gibi alanları belirleyemez; yalnızca yukarıdaki alanlar kaydedilir.

## REST sözleşmesi

| Method | Endpoint | Başarılı | Hata |
|---|---|---|---|
| GET | `/health` | 200 | — |
| GET | `/events` (`?category=Atölye`) | 200 | — |
| GET | `/events/:id` | 200 | 404 (olmayan veya geçersiz id) |
| POST | `/events` | 201 | 400 (schema doğrulaması, bozuk JSON) |

- Geçersiz biçimli id (`/events/yok`, `/events/111111`): `isValidObjectId` → **404**, 500 değil.
- Eksik veri: `ValidationError` → **400**, örn.
  `{"error":{"message":"Event validation failed: date: Path `date` is required., ..."}}`
- Beklenmeyen hata: terminale yazılır, kullanıcıya `{"error":{"message":"Server error"}}` (500).
  Sunucu çökmez; ardından `/health` yine 200 döner.

## Postman

1. `npm run seed`, sonra `npm run dev`.
2. Postman › **Import** › `requests/kampus-api.json`.
3. **Kampüs API — Abdelrahman Zidan — Sprint 8** collection'ını 1–6 sırasıyla çalıştırın.
   "2 Etkinlik listesi" ilk kaydın `_id` değerini `{{eventId}}` değişkenine kaydeder;
   "3 Tek etkinlik" bu değişkeni kullanır (elle kopyalamak gerekmez).

| Sıra | İstek | Beklenen |
|---|---|---|
| 1 | GET `/health` | 200, `student=2321032807` |
| 2 | GET `/events` | 200, seed sonrası 6 kayıt, `_id`, `createdAt` |
| 3 | GET `/events/{{eventId}}` | 200 |
| 4 | GET `/events/yok` | 404 |
| 5 | POST `/events`, tam gövde | 201, yeni `_id` ve `createdAt` |
| 6 | POST `/events`, sadece title | 400 |

Collection'ı tekrar çalıştırmadan önce `npm run seed` ile 6 kayda dönün
(POST kalıcı olduğu için liste 7, 8… olur).

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
collection'daki altı isteği gönderir, 404/400 durumlarını, sunucunun çökmediğini ve
yeniden başlatmadan sonra kaydın durduğunu kontrol eder.

## Teslim kontrolü

```bash
git status
git ls-files -- '*node_modules*' '*.env'   # çıktı boş olmalı
git log -p | grep -n "mongodb+srv"          # çıktı boş olmalı
```
