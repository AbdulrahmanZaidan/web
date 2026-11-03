# Sprint 6 ve Vize — Kontrol kaydı

3 Kasım 2026 tarihinde üretim derlemesi üzerinde yerel tarayıcı kontrolleri yapıldı.
Bu kayıt canlı Vercel yayınının doğrulandığı anlamına gelmez.

## Öğretmenin 13 maddesi

| No | Gereksinim | Kanıt / durum |
|---|---|---|
| 1 | Tüm linkler çalışıyor | Menü, kart, detay, düzenle, vazgeç, auth bağlantıları ve tarayıcı geri/ileri denendi. |
| 2 | Tüm sayfalar hazır | 10 route ve bulunamayan etkinlik sayfaları açıldı. |
| 3 | Klasör yapısı | components/layout, events, forms; pages; context; types; utils. |
| 4 | 10 route | App.tsx: 9 açık adres + yıldız rotası. Her biri doğrudan açıldı ve yenilendi. |
| 5 | Context | Listeyi kullanan sayfalar tek EventsProvider'a bağlı. |
| 6 | Ekle/güncelle/sil/onay | Değişim ana sayfa, liste ve detayda görüldü. Silmede iptal kaydı korudu. |
| 7 | GitHub | BEKLİYOR: Kod yerelde hazır. GitHub bağlantısı yazma isteğini 403 ile reddetti; uzak main güncellenmedi. Teslim etiketi frontend yerelde hazırlanmıştır. |
| 8 | İstenen Vercel alan adı | BEKLİYOR: abdelrahmanzidan-frontend.vercel.app atanması ve canlı kontrol. |
| 9 | README ve canlı link | README; mevcut canlı adres, kurulum, 10 route ve yayın notu içerir. Son alan adı atanınca link güncellenmeli. |
| 10 | Mobil görünüm | 360 ve 390 px: 10 sayfada yatay taşma yok; yönetim satırları kart. |
| 11 | CSS | 1440 px masaüstü ve mobil görseller incelendi; mevcut bej tema korundu. |
| 12 | Arama/filtre | Türkçe büyük harf, boşluk kırpma, açıklama, kategoriyle birlikte ve boş sonuç denendi. |
| 13 | Form doğrulama | Boş etkinlik formunda 7 hata; login/register/forgot-password hata ve demo başarı akışları geçti. |

## Otomatik kontroller

- `npm test`: 4 test geçti; boş form, kontenjan sınırları, kırpılmış alanlar, Türkçe arama/filtre/ID.
- `npm run lint`: uygulama kaynaklarında hata yok.
- `npm run build`: TypeScript ve Vite üretim derlemesi başarılı.
- Chromium + Playwright: 10 route üzerinde doğrudan yükleme/yenileme; iki geçersiz ID.
- CRUD: yeni kayıt, dolu düzenleme formu, sayfalar arasında ortak state, afişin korunması.
- Sil: iptal/onay; tüm kayıtlar silindikten sonra boş durum; yenilemeyle başlangıç verisi.
- Auth: boş alanlar, şifre uyuşmazlığı, başarılı demo mesajı, değişiklikte eski başarı mesajının gizlenmesi.
- 360/390/1440 px: taşma yok; masaüstü tablo/mobil kart.
- Tarayıcı konsol hatası: 0. Başarısız HTTP kaynak isteği: 0.

## Canlı yayında son kontrol

1. Vercel deployment Ready olmalı; root `kampus-etkinlik/frontend` olmalı.
2. Adres `isimsoyisim-frontend.vercel.app` biçiminde olmalı.
3. `/events/event-2` adresini yeni sekmede aç; yenile; Robotik Atölyesi görünmeli.
4. `/admin` → Yeni etkinlik → boş Kaydet → 7 hata.
5. Geçerli kayıt oluştur; Ana Sayfa/Etkinlikler'de kontrol et; düzenle; silmeyi iptal et ve onayla.
6. Giriş/kayıt/şifremi unuttum sayfalarını dene; `/xyz` bulunamadı göstermeli.
7. GitHub'da frontend etiketi ve Actions kontrolü görünmeli.
8. Dersin teslim alanına https://github.com/AbdulrahmanZaidan/web yaz.

Sayfayı yenileyince yeni kayıtların kaybolması beklenen davranıştır; backend ve kalıcı kayıt bu sprintin kapsamı dışındadır.
