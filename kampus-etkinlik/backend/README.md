# Kampüs API — Sprint 7

**Öğrenci:** Abdelrahman Zidan · **Numara:** 2321032807

Express ile bellekte çalışan REST API. Frontend bu sprintte değişmez ve API'ye
henüz bağlanmaz. MongoDB Sprint 8, güncelleme/silme ve ayrıntılı doğrulama Sprint 9,
JWT Sprint 10, frontend bağlantısı Sprint 11 kapsamındadır.

## Kurulum

Node.js 22 veya üzeri gerekir; proje Node.js 24 ile test edilmiştir.
GitHub repository kökünden:

```bash
cd kampus-etkinlik/backend
npm install
```

`.env.example` dosyasını aynı klasöre `.env` adıyla kopyalayın:

```powershell
# Windows PowerShell
Copy-Item .env.example .env
```

```bash
# Git Bash, macOS veya Linux
cp .env.example .env
```

Dosyanın içeriği:

```dotenv
PORT=3000
```

```bash
npm run dev
```

Terminalde `API: http://localhost:3000` görünür. Tarayıcıda
<http://localhost:3000/health> açın. Durdurmak için **Ctrl+C**.
`npm start` izleme olmadan çalıştırır; `npm test` ayrı bir geçici portta API testlerini çalıştırır.
`npm run dev` dosya değişikliklerinde sunucuyu yeniden başlatır.

## Ortam ve dosya yapısı

| Dosya | Görev |
|---|---|
| `src/server.js` | dotenv ile `.env` okur ve `process.env.PORT` üzerinde dinler |
| `src/app.js` | Express, CORS, JSON middleware, health, route bağlantısı ve hata yanıtları |
| `src/routes/event-routes.js` | HTTP adreslerini controller fonksiyonlarına bağlar |
| `src/controllers/event-controller.js` | Listeleme, detay ve oluşturma işlemleri |
| `src/data/events.js` | `event-1`–`event-6` kimlikli altı özel örnek etkinlik |
| `requests/kampus-api.json` | Postman Collection v2.1; altı istek ve yanıt kontrolleri |
| `tests/api.test.js` | HTTP üzerinden otomatik sözleşme ve hata testleri |
| `.env.example` | Paylaşılan PORT örneği |
| `.gitignore` | Yerel `.env` ve `node_modules` dosyalarını Git dışında tutar |

Komutları **backend klasöründe** çalıştırın; dotenv bu klasördeki `.env` dosyasını okur.
PORT verilmezse 3000 kullanılır; doluysa `.env` içinde boş bir port seçip sunucuyu
yeniden başlatın. Dersin altı isteği 3000 portunu kullandığından teslim kontrolünde
`PORT=3000` olmalıdır. `.env` ve `node_modules` GitHub'a gönderilmez.

## REST sözleşmesi

Temel adres: `http://localhost:3000`. Liste yanıtı doğrudan JSON dizisidir;
tek etkinlik ve oluşturma yanıtları doğrudan etkinlik nesnesidir.

| Method | Endpoint | Amaç | Başarılı | Hata | Durum |
|---|---|---|---|---|---|
| GET | `/health` | Sunucu durumu, zaman ve öğrenci numarası | 200 | — | Sprint 7 |
| GET | `/events` | Etkinlik listesi | 200 | — | Sprint 7 |
| GET | `/events/:id` | Tek etkinlik | 200 | 404 | Sprint 7 |
| POST | `/events` | Yeni etkinlik | 201 | 400 | Sprint 7 |
| PATCH | `/events/:id` | Güncelleme | 200 | 400, 404 | Sprint 9; henüz uygulanmadı |
| DELETE | `/events/:id` | Silme | 204 | 404 | Sprint 9; henüz uygulanmadı |

`GET /events?category=Atölye` tam kategori eşleşmesiyle filtreler. Eşleşme yoksa
200 ve `[]` döner. Bilinmeyen adres veya henüz uygulanmamış metot 404 döner.

### GET /health — 200

```json
{
  "status": "ok",
  "time": "2026-11-11T09:00:00.000Z",
  "student": "2321032807"
}
```

`time` örnektir; her istekte güncel ISO zamanıdır.

### POST /events — 201

`Content-Type: application/json` ile gönderin:

```json
{
  "title": "Kampüs İçin Git İşbirliği Atölyesi",
  "category": "Atölye",
  "capacity": 30,
  "date": "2026-12-18",
  "time": "14:00",
  "location": "Yazılım Kulübü Çalışma Odası",
  "description": "Küçük ekiplerle branch açma, kod inceleme ve birleştirme alıştırmaları yapılır."
}
```

Yanıt, bu alanlar ve sunucunun ürettiği benzersiz `event-...` kimliğinden oluşur.
İstemcinin `id` değeri kabul edilmez. Ardından GET listesinde kayıt sayısı 7 olur
ve yeni kimlikle detay isteği yapılabilir.

- `title`, `category`, `date`: zorunlu ve boş olmayan metin.
- `capacity`: verilmezse 0; sayı veya sayıya çevrilebilen metin kabul edilir.
- `time`, `location`, `description`: isteğe bağlı metin; verilmezse `""`.
- `image` alanı yoktur; afiş frontend'dedir.
- Bu sprintte tarih/kategori değerleri ve kontenjan aralığı için ayrıntılı iş kuralları yoktur.

### Hatalar

Olmayan ID (`GET /events/yok`) — **404**:

```json
{ "error": { "message": "Event not found" } }
```

Sadece `{"title":"Eksik etkinlik"}` gönderimi — **400**:

```json
{ "error": { "message": "title, category and date are required" } }
```

Bozuk JSON da 400 ve `error.message` döndürür. Bilinmeyen adres 404 ve
`{"error":{"message":"Route not found"}}` döndürür.

## Postman: altı teslim isteği

1. Sunucuyu `npm run dev` ile başlatın.
2. Postman masaüstü uygulamasında **Import** ile `requests/kampus-api.json` dosyasını seçin.
3. **Kampüs API — Abdelrahman Zidan — Sprint 7** collection'ını açın.
4. İstekleri aşağıdaki sırayla gönderin veya collection runner ile **1 iteration** çalıştırın.
5. Yanıt durumunu ve **Test Results** bölümünü kontrol edin.

| Sıra | İstek | Beklenen |
|---|---|---|
| 1 | GET `/health` | 200, `status=ok`, `student=2321032807` |
| 2 | GET `/events` | 200, başlangıçta 6 kayıt |
| 3 | GET `/events/event-2` | 200, `id=event-2` |
| 4 | GET `/events/yok` | 404, `error.message` |
| 5 | POST `/events`, tam gövde | 201, yeni kimlik |
| 6 | POST `/events`, sadece title | 400, `error.message` |

Her yeni collection koşusundan **önce sunucuyu durdurup yeniden başlatın**.
POST bellekteki diziye ekler; ikinci koşuda başlangıç sayısı artık 6 olmayabilir.
Sunucu yeniden başlayınca eklenen kayıtlar kaybolur ve altı başlangıç kaydı geri gelir.
Bu, Sprint 7'nin istenen bellek içi davranışıdır.

## Doğrulama ve teslim

```bash
npm test
```

Otomatik testler collection'daki altı gerçek isteği, eklenen kaydın listede/detayda
görünmesini, kategori filtresini, CORS'u, hatalı JSON/gövdeyi, bilinmeyen adresi
ve benzersiz kimlik üretimini kontrol eder. Testler gerçek sunucunun belleğini değiştirmez.

Teslim için Git geçmişinde en az beş aşamalı commit bulunmalı; tek dosya yüklemesi
bu şartın yerine geçmez. Repository kökünden kontrol edin:

```bash
git status
git log --oneline -5
git ls-files -- '*node_modules*' '*.env'
```

Son komutun çıktısı boş olmalıdır. Tüm kontrollerden sonra:

```bash
git tag sprint-07
git push origin main
git push origin sprint-07
```

`sprint-07` zaten varsa tekrar oluşturmayın; mevcut etiketi kontrol edin.
Ders sitesine public repository adresini girin:
<https://github.com/AbdulrahmanZaidan/web>.
**Backend bu sprintte canlıya alınmaz; Vercel ayarları değiştirilmez.**
