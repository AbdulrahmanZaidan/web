Canlı site: https://sprint2-ashy.vercel.app/

# Kampüs Etkinlikleri — Sprint 4

**Öğrenci:** Abdelrahman Zidan  
**Öğrenci numarası:** 2321032807  
**Güncel aşama:** Vite, TypeScript ve React

Kampüsteki etkinlikleri listeleyen, başlık ve açıklamaya göre arama yapan,
kategoriyle filtreleyen ve seçilen etkinliğin ayrıntılarını gösteren ders projesidir.
Etkinlikler örnek verilerden oluşur.

## Sprintler ve klasör yapısı

| Klasör | Aşama | İçerik |
|---|---|---|
| `sprint1/` | Sprint 1 | Semantik HTML, tablolar, detay ve formlar |
| `sprint2/` | Sprint 2 | Öğrenci numarasına göre CSS ve responsive tasarım |
| `sprint3/` | Sprint 3 | JavaScript modülleri, DOM, arama, filtreleme ve form doğrulaması |
| `frontend/` | **Sprint 4** | **Vite + React + TypeScript** |

Sprint 4'ün klasör adı, yönergede istendiği gibi **frontend** olarak belirlenmiştir.
Önceki sprintlerin dosyaları korunmuştur.

## Sprint 4 özellikleri

- Beş görünüm tek `App.tsx` içinde yer alır: Ana Sayfa, Etkinlikler, Detay, Ekle ve Güncelle.
- `useState` ile sayfa ve seçilen etkinlik yönetilir; React Router kullanılmaz.
- Menü bağlantıları sayfayı yenilemez, adres çubuğu değişmez.
- Ana sayfa, etkinlik dizisinin kopyasını tarih ve saate göre sıralayarak ilk iki kaydı gösterir.
- Etkinlikler sayfası altı kaydı ortak kart yapısıyla listeler.
- Arama başlık ve açıklamada çalışır; baştaki/sondaki boşluklar temizlenir ve Türkçe büyük/küçük harf dönüşümü uygulanır.
- Kategori seçenekleri veriden `Set` ile üretilir; arama ve kategori birlikte uygulanır.
- Sonuç bulunamazsa açıklayıcı mesaj gösterilir.
- Detaylar ID ile bulunur; geçersiz ID için hata ve listeye dönüş bloğu bulunur.
- Afiş isteğe bağlıdır; afişsiz etkinlikte boş sütun bırakılmaz.
- `useEffect`, görünüm değiştiğinde tarayıcı sekmesinin başlığını günceller.
- Veri modeli `CampusEvent` arayüzüyle, kategoriler `Category` union tipiyle tanımlanır.
- Arama, kategori filtreleme ve ID bulma fonksiyonları saf ve tiplidir.

### Formların bu sprintteki kapsamı

Ekle ve Güncelle aynı formu farklı başlıklarla gösterir. İki form da boş açılır.
**Bu sprintte form state'i, otomatik doldurma, doğrulama veya kayıt işlemi yoktur.**
`Kaydet` yalnızca `preventDefault()` ile sayfanın yenilenmesini engeller.
Backend, veritabanı ve kalıcı tarayıcı depolaması kullanılmaz.
Sprint 3'ün form mantığı kendi klasöründe korunur.

## Yerelde çalıştırma

Node.js 22.12+ veya Node.js 24 LTS ve npm 10+ kullanın.
Repository kökünde terminal açın:

```bash
cd frontend
npm install
npm run dev
```

Terminalde gösterilen adresi açın; varsayılan adres `http://localhost:5173` olur.
Sunucuyu durdurmak için `Ctrl+C` kullanın.
Sprint 4 için Live Server kullanılmaz ve `index.html` doğrudan açılmaz.

### Üretim derlemesi ve önizleme

`frontend/` klasöründe:

```bash
npm run build
npm run preview
```

Build komutu TypeScript kontrolünü ve Vite derlemesini çalıştırır; çıktı `dist/`
klasöründe oluşur. Önizleme adresi genellikle `http://localhost:4173` olur.
Ek statik kod kontrolü için `npm run lint` kullanılabilir.

## Dosyaların görevleri

Aşağıdaki yollar `frontend/` klasörüne göredir.

| Dosya / klasör | Görevi |
|---|---|
| `package.json` | Proje bilgilerini, komutları ve bağımlılıkları tanımlar. |
| `package-lock.json` | Kurulan paketlerin tam sürümlerini sabitler. |
| `node_modules/` | İndirilen paketleri içerir; GitHub'a yüklenmez. |
| `tsconfig*.json` | TypeScript, JSX ve tip kontrolü ayarlarını belirler. |
| `vite.config.ts` | Vite'ı React eklentisiyle yapılandırır. |
| `index.html` | React uygulamasının yerleştiği `div#root` öğesini içeren HTML girişidir. |
| `src/main.tsx` | React'i başlatır ve `App` bileşenini `root` içine çizer. |
| `src/App.tsx` | Beş görünümü, menüyü, kartları ve uygulama state'ini içerir. |
| `src/App.css` | Sprint 3'ten taşınan tasarımı ve Sprint 4 görünüm kurallarını içerir. |
| `src/index.css` | Sprint yönergesine uygun olarak boş bırakılmıştır. |
| `public/` | `afis.svg` gibi doğrudan sunulan statik dosyaları içerir. |
| `src/types/campus-event.ts` | `CampusEvent` arayüzünü ve dört değerli `Category` tipini tanımlar. |
| `src/data/events.ts` | Altı örnek etkinliği `CampusEvent[]` tipinde saklar. |
| `src/utils/filter-events.ts` | `searchEvents`, `filterByCategory` ve `findEventById` saf fonksiyonlarını içerir. |
| `.gitignore` | `node_modules`, `dist` ve yerel dosyaların Git'e eklenmesini önler. |

## Tasarım ve tarihler

Öğrenci numarasına göre renk tonu `2321032807 % 360 = 127` olarak belirlenmiştir.
Ana renk `hsl(127 65% 38%)`, zemin `hsl(127 30% 97%)` değerindedir.
Yazı tipi `Palatino Linotype`, alternatifleri `Book Antiqua`, `Palatino` ve `serif`tir.
Mobilde kartlar tek sütun; geniş ekranda liste üç, ana sayfa iki sütun gösterir.

Sprint 3'teki etkinlik tarihleri korunmuştur; doğru sıralama için veri biçimi
`GG-AA-YYYY` yerine `YYYY-MM-DD` olarak tutulur. Ekranda tarihler Türkçe gösterilir.

## Vercel yapılandırması

Proje bağlantısı: [Kampüs Etkinlikleri](https://sprint2-ashy.vercel.app/)

Sprint 4 için kullanılacak ayarlar:

| Ayar | Değer |
|---|---|
| Root Directory | `frontend` |
| Framework Preset | `Vite` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | Varsayılan npm kurulumu |

Önceki `sprint2` veya `sprint3` kök dizini ayarı `frontend` olarak değiştirilir.
`Other` preset'i ve boş build override'ı yerine yukarıdaki Vite ayarları kullanılır.
Ayarlar kaydedildikten sonra son commit yeniden deploy edilir.
Alan adında `sprint2` yazması klasör seçimini belirlemez; yayınlanan sürümü
Vercel projesinin Root Directory ayarı ve deployment'ı belirler.

## Git teslimi

Sprint 4 için commit mesajı `Complete sprint 4`, etiket `sprint-04` olarak hazırlanmıştır.
Mevcut GitHub deposuna dosyalar kopyalanıyorsa o deponun `.git` klasörü korunmalıdır.

Kendi deponuzda bu commit ve etiket henüz yoksa repository kökünde:

```bash
git add frontend README.md BASLA_AR.md docs
git commit -m "Complete sprint 4"
git tag sprint-04
git push
git push --tags
```

Hazır proje deposundaki commit ve etiket zaten varsa tekrar oluşturulmaz.
`node_modules/` ve `dist/` GitHub'a yüklenmez.

## Yapılan yerel kontroller

- TypeScript kontrolü, `npm run build` ve `npm run lint` başarılıdır.
- Üretim önizlemesinde arama, kategori filtreleme ve altı etkinliğin detayları kontrol edilmiştir.
- Ekle/Güncelle formlarının boş açıldığı ve gönderimin sayfayı yenilemediği doğrulanmıştır.
- Beş görünüm 320, 390 ve 1440 piksel genişliklerde yatay taşma olmadan kontrol edilmiştir.
- Tarayıcı konsol hatası veya başarısız kaynak isteği görülmemiştir.

Bu sonuçlar yerel Sprint 4 sürümüne aittir; canlı deployment ayrıca kontrol edilmelidir.
Ayrıntılı kontrol kaydı: `docs/SPRINT4_KONTROL.md`.
