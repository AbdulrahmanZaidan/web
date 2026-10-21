Canlı site: https://sprint2-ashy.vercel.app/

# Kampüs Etkinlikleri — Sprint 5

**Öğrenci:** Abdelrahman Zidan

**Öğrenci numarası:** 2321032807

**Konu:** React Bileşenleri — props, interface, callback ve lifting state

Sprint 4'te tek dosyada bulunan arayüz, bu sprintte yeniden kullanılabilir
bileşenlere ayrılmıştır. Aynı `frontend/` klasöründe devam edilir; görünüm,
etkinlik verileri ve sayfa akışı korunur.

## Sprintler

| Klasör / etiket | İçerik |
|---|---|
| `sprint1/` — `sprint-01` | Semantik HTML, tablo ve formlar |
| `sprint2/` — `sprint-02` | Öğrenci numarasına göre CSS ve responsive tasarım |
| `sprint3/` — `sprint-03` | JavaScript modülleri, DOM ve form doğrulaması |
| `frontend/` — `sprint-04` | Vite, TypeScript ve React başlangıcı |
| `frontend/` — `sprint-05` | React bileşenlerine ayırma; güncel sürüm |

Ayrı `sprint5/` klasörü oluşturulmaz. Sprint 4, `sprint-04` Git etiketinde bulunur.
Sprint 1–3 dosyaları değiştirilmemiştir.

## Çalıştırma

Node.js 22.12+ veya 24 LTS ve npm 10+ ile repository kökünden:

```bash
cd frontend
npm install
npm run dev
```

Terminaldeki adresi açın; genellikle `http://localhost:5173` olur.
Live Server kullanmayın; HTML dosyasını doğrudan açmayın.

Üretim sürümünü kontrol etmek için aynı klasörde:

```bash
npm run build
npm run preview
```

Önizleme genellikle `http://localhost:4173` adresindedir. `Ctrl+C` sunucuyu durdurur.
Ek statik kontrol: `npm run lint`.

## Bileşenler ve props

Tüm bileşen dosyaları `frontend/src/components/` altındadır. Props alan bileşenler
kendi `interface` tanımını kullanır; her bileşenin `export default` satırı vardır.

| Dosya | Props | Sorumluluk |
|---|---|---|
| `layout/Header.tsx` | `title`, isteğe bağlı `text` | Sayfa başlığını ve varsa alt metni gösterir. |
| `layout/Navigation.tsx` | `current`, `onNavigate` | Menüyü çizer, seçimi callback ile App'e bildirir. |
| `layout/Footer.tsx` | Yok | Öğrenci adı, numarası ve yılı gösterir. |
| `events/EventCard.tsx` | `event`, `onShowDetail` | Tek kartı çizer ve detay isteğinde etkinlik ID'sini bildirir. |
| `events/EventList.tsx` | `events`, `onShowDetail`, isteğe bağlı `emptyText`, `className` | Kartları `key={event.id}` ile üretir veya boş sonuç mesajını gösterir. |
| `events/EventFilter.tsx` | `searchText`, `category`, `categories`, `onSearchChange`, `onCategoryChange` | Kontrollü arama ve kategori alanlarını gösterir. |
| `events/EventDetail.tsx` | `event`, `onBack`, `onEdit` | Etkinliği gösterir; dönüş ve güncelleme olaylarını bildirir. |
| `forms/EventForm.tsx` | `onSubmit` | Ortak formu gösterir; submit'i engelleyip callback'i çağırır. |

Klasör şemasında istenen **8 ayrı bileşen dosyası** vardır; ana `App` ile birlikte
9 React bileşeni bulunur. Ek, kullanılmayan bir bileşen oluşturulmamıştır.
`Header` ve `Navigation`, App'teki mevcut ortak header/container içinde kullanılır;
böylece Sprint 4'ün HTML yerleşimi ve görünümü korunur.

## State ve veri akışı

- `page`, `selectedId`, `searchText` ve `category` state'leri **App'te** kalır.
- Alt bileşenler veriyi props ile alır; kendi sayfa/arama state'lerini oluşturmaz.
- Tıklama ve giriş olayları callback fonksiyonlarıyla App'e bildirilir.
- Örnek: `EventCard` → `onShowDetail(id)` → App `go('detail', id)` → `EventDetail`.
- Arama: `EventFilter` → `onSearchChange(text)` → App state → filtrelenmiş `EventList`.
- Ana sayfa ve liste aynı `EventList`/`EventCard` bileşenlerini kullanır.
- `filtered` ve `upcoming` hesaplanan değerlerdir; ayrıca state'te tutulmaz.
- Detayda etkinliğin adı hem üst başlıkta hem tarayıcı sekmesinde görünür.
- `useEffect`, `document.title` değerini `Kampüs Etkinlikleri — ${title}` olarak günceller.
- Router kullanılmaz; geçişlerde URL değişmez ve sayfa yenilenmez.

`App.tsx` 89 satırdır; kart, detay, filtre, form ve footer JSX'i kendi dosyalarına
alınmıştır. App'te `<article>`, `<footer>`, `renderCard` veya form alanı yoktur.

## Ortak tipler ve yardımcılar

| Dosya | Görevi |
|---|---|
| `src/types/page.ts` | Beş görünümü tanımlayan ortak `PageName` tipini dışa aktarır. |
| `src/types/campus-event.ts` | `CampusEvent` arayüzünü ve dört değerli `Category` tipini tanımlar. |
| `src/utils/format-date.ts` | Kart ve detayda kullanılan ortak Türkçe tarih biçimleyicisidir. |
| `src/utils/filter-events.ts` | Saf arama, kategori filtreleme ve ID bulma fonksiyonlarını içerir. |
| `src/data/events.ts` | Altı örnek etkinliği `CampusEvent[]` olarak saklar. |

Arama başlık/açıklamada, `trim` ve Türkçe harf dönüşümüyle çalışır. Kategoriyle
birlikte uygulanır. Tarihler ISO biçiminde sıralanır, ekranda Türkçe görünür.
Kaynak dizi değiştirilmez. Afiş isteğe bağlıdır; afişsiz detayda boş sütun oluşmaz.

## Form kapsamı

Ekle ve Güncelle aynı `EventForm` bileşenini kullanır; farklı başlıkla ve boş açılır.
Form gönderiminde önce `preventDefault()`, sonra `onSubmit()` çalışır.
App geçici olarak `window.scrollTo(0, 0)` verir; Kaydet sayfayı yenilemeden üste taşır.
**Otomatik doldurma, doğrulama, kayıt veya backend yoktur.** Kayıt mantığı sonraki
sprintin konusudur. Form bileşeni ne yapılacağına kendisi karar vermez.

## Vite dosyaları

Aşağıdaki yollar `frontend/` içindedir.

| Dosya / klasör | Görevi |
|---|---|
| `package.json` | Proje bilgilerini, komutları ve bağımlılıkları tanımlar. |
| `package-lock.json` | Kurulan paketlerin tam sürümlerini sabitler. |
| `node_modules/` | İndirilen paketleri içerir; GitHub'a yüklenmez. |
| `tsconfig*.json` | TypeScript, JSX ve strict tip kontrolü ayarlarını belirler. |
| `vite.config.ts` | Vite'ı React eklentisiyle yapılandırır. |
| `index.html` | React'in bağlandığı `div#root` öğesini içerir. |
| `src/main.tsx` | React'i başlatır ve App'i root içine çizer. |
| `src/App.tsx` | State'i yönetir ve bileşenleri bir araya getirir. |
| `src/App.css` | Sprint 4'teki tasarımı değiştirmeden korur. |
| `src/index.css` | Yönergeye uygun olarak boştur. |
| `public/` | `afis.svg` gibi doğrudan sunulan dosyaları içerir. |
| `.gitignore` | `node_modules`, `dist` ve yerel dosyaları Git dışında tutar. |

## GitHub ve Vercel teslimi

Kendi mevcut deponuza güncel `frontend/`, `README.md`, `BASLA_AR.md` ve `docs/`
dosyalarını kopyalayın. **Mevcut .git klasörünüzü değiştirmeyin.**
Kendi deponuzda bu commit/etiket henüz yoksa repository kökünde:

```bash
git add frontend README.md BASLA_AR.md docs
git commit -m "Complete sprint 5 React components"
git tag sprint-05
git push
git push --tags
```

Hazır ZIP deposunda commit ve etiket varsa tekrar oluşturmayın; kendi remote
bağlantınızı kontrol ederek push yapın. `node_modules` ve `dist` yüklenmez.

Vercel ayarları Sprint 4 ile aynıdır:

| Ayar | Değer |
|---|---|
| Root Directory | `frontend` |
| Framework Preset | `Vite` |
| Build Command | `npm run build` |
| Output Directory | `dist` |

GitHub bağlantısı etkinse push sonrası Vercel yeni sürümü yayınlar. Deployment'ın
Ready durumunu ve canlı sayfayı kontrol edin. URL'de `sprint2` bulunması sorun değildir;
yayınlanan sürüm Root Directory ve deployment tarafından belirlenir.

## Kontrol ve son fotoğraftaki teslim maddeleri

Yerel build, lint, beş görünüm, bağlantılar, filtreler ve etkinlik başlığı kontrolleri
`docs/SPRINT5_KONTROL.md` içinde kayıtlıdır. Kod açıklaması ve sunum provası
`docs/SPRINT5_ANLATIM.md` dosyasındadır.

GitHub push ve canlı Vercel yayını bu ortamdan yapılmadı. Bu iki madde dosyalar
kullanıcının deposuna gönderilip canlı deployment kontrol edildiğinde tamamlanır.
İlk satır, kullanıcının paylaştığı proje adresidir; tek başına Sprint 5'in yayında
olduğunu kanıtlamaz.
