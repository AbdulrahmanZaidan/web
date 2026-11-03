Canlı proje adresi: https://sprint2-ashy.vercel.app/

# Kampüs Etkinlikleri — Sprint 6 ve Vize

**Öğrenci:** Abdelrahman Zidan · **Numara:** 2321032807

**GitHub:** https://github.com/AbdulrahmanZaidan/web

React, TypeScript ve React Router ile kampüs etkinlikleri uygulaması. Sprint 5 üzerine
Router, Context, yönetim ve kontrollü form doğrulaması eklendi. Mevcut bej tasarım korundu.

> Yayın notu: Yukarıdaki adres mevcut proje adresidir. Bu sürümün canlı yayını ve
> öğretmenin istediği `isimsoyisim-frontend.vercel.app` alan adı ayrıca doğrulanmalıdır.
> Planlanan teslim alan adı: `abdelrahmanzidan-frontend.vercel.app` (henüz atanmış değildir).

## Kurulum ve çalıştırma

Node.js **24** ve npm kullanın. GitHub repository kökünden:

```bash
cd kampus-etkinlik/frontend
npm install
npm run dev
```

Terminalde yazan yerel adresi açın (genellikle http://localhost:5173).
ZIP içindeyseniz önce `web-main` klasörünü açın. `frontend` klasörünün içindeyseniz
`cd` komutunu tekrar çalıştırmayın. HTML dosyasını çift tıklamayın; Vite sunucusunu kullanın.

```bash
npm test
npm run lint
npm run build
npm run preview
```

`npm test`, Node test runner ile doğrulama sınırlarını ve Türkçe filtrelemeyi kontrol eder.
`npm run build`, strict TypeScript kontrolünü ve üretim derlemesini çalıştırır.
Önizleme adresi genellikle http://localhost:4173; durdurmak için Ctrl+C.

## Route listesi — 10 route

| Adres | Sayfa | Görevi |
|---|---|---|
| `/` | HomePage | Tarihe göre sıralanmış ilk iki etkinlik |
| `/events` | EventsPage | Arama ve kategori filtresi |
| `/events/:id` | EventDetailPage | ID ile etkinlik detayı |
| `/admin` | AdminPage | Liste, düzenleme, onaylı silme |
| `/admin/new` | AddEventPage | Yeni etkinlik |
| `/admin/:id/edit` | EditEventPage | Dolu form ile güncelleme |
| `/login` | LoginPage | Giriş formu demosu |
| `/register` | RegisterPage | Kayıt formu demosu |
| `/forgot-password` | ForgotPasswordPage | Şifre yenileme demosu |
| `*` | NotFoundPage | Bilinmeyen sayfa |

Olmayan etkinlik ID'si de NotFoundPage gösterir. Menü NavLink; sayfa bağlantıları Link;
kayıttan sonra yönlendirme useNavigate kullanır. Geri/ileri düğmeleri çalışır.

## Klasör yapısı

Tüm güncel uygulama `kampus-etkinlik/frontend` altındadır.

| Klasör/dosya | İçerik |
|---|---|
| `src/components/layout/` | Header, Navigation, Footer |
| `src/components/events/` | EventCard, EventList, EventFilter, EventDetail |
| `src/components/forms/EventForm.tsx` | Ekle/güncelle için ortak kontrollü form |
| `src/pages/` | Yukarıdaki 10 sayfa |
| `src/context/EventsContext.tsx` | EventsProvider ve useEvents |
| `src/types/campus-event.ts` | CampusEvent, Category, EventFormData, EventFormErrors |
| `src/data/events.ts` | Altı başlangıç etkinliği |
| `src/utils/` | filter-events, format-date, validate-event |
| `src/App.tsx` | Header, Navigation, Routes ve Footer kabuğu; sayfa state'i yok |
| `src/main.tsx` | BrowserRouter → EventsProvider → App |
| `tests/validation.test.mjs` | Saf fonksiyonların otomatik testleri |
| `vercel.json` | SPA deep-link ve yenileme ayarı |

`types/page.ts`, eski `page` state'i ve `go()` kaldırıldı. Sprint 1–3 dosyaları korundu.

## Veri akışı

- EventsProvider başlangıç listesini `useState` ile tutar.
- `addEvent`: yeni dizi; `updateEvent`: map; `deleteEvent`: filter. Kaynak dizi mutasyona uğramaz.
- Ana Sayfa, Etkinlikler, Detay ve yönetim sayfaları aynı Context verisini kullanır.
- Form kendi başına kayıt yapmaz; doğrulanmış veriyi `onSubmit(data)` ile sayfaya verir.
- Ekle/güncelle tamamlanınca `/admin` açılır. Silme önce etkinlik adını içeren `window.confirm` sorar.
- Formda olmayan mevcut afiş, düzenleme sırasında korunur.
- Arama ve kategori state'i yalnızca EventsPage içindedir. Başlık/açıklama araması Türkçe harfleri destekler.

**Bu sprintte backend, gerçek oturum, e-posta gönderimi ve kalıcı kayıt yoktur.**
`/admin` herkese açıktır. Sayfa yenilenince altı örnek etkinlik geri gelir;
localStorage/sessionStorage kullanılmaz. Bu davranış dersin gereksinimidir.

## Form doğrulaması

| Form/alan | Kural |
|---|---|
| Etkinlik adı | trim sonrası en az 3 karakter |
| Kategori | Seçilmeli |
| Tarih, saat, yer | Boş olamaz |
| Kontenjan | 1–1000 arası tam sayı |
| Açıklama | trim sonrası en az 10 karakter |
| Giriş | E-posta @ içermeli, şifre en az 6 karakter |
| Kayıt | Giriş kuralları + ad soyad en az 3 karakter + şifreler aynı |
| Şifremi unuttum | E-posta @ içermeli |

Formlar `noValidate` kullanır; hatalar alan altında Türkçe gösterilir ve `aria-invalid`,
`aria-describedby` ile ilişkilendirilir. Başarılı auth formları yalnızca demo mesajı gösterir.

## Vercel ayarları

| Ayar | Değer |
|---|---|
| Git repository | `AbdulrahmanZaidan/web` |
| Production branch | `main` |
| Root Directory | `kampus-etkinlik/frontend` |
| Framework Preset | Vite |
| Node.js | 24.x |
| Install Command | `npm ci` |
| Build Command | `npm run build` |
| Output Directory | `dist` |

Root Directory sadece `frontend` değildir; repository içinde `kampus-etkinlik` vardır.
`vercel.json` bu frontend klasöründedir. `/events/event-2` gibi bağlantıların doğrudan
ve yenilendiğinde açılması için index.html rewrite tanımlıdır.
Öğretmenin istediği alan adı biçimi **isimsoyisim-frontend.vercel.app** olmalıdır.
Mevcut `sprint2-ashy.vercel.app` adı tek başına bu isim şartını karşılamaz.

## Git ve teslim

Çalışma tamamlandıktan ve kontroller geçtikten sonra repository kökünden:

```bash
git add .
git commit -m "Complete sprint 6 and midterm frontend"
git tag frontend
git push origin main
git push origin frontend
```

Commit ve `frontend` etiketi zaten oluşturulduysa yeniden oluşturmayın.
`node_modules`, `dist` ve yerel ayarlar Git'e eklenmez.
GitHub Actions, push ve pull request üzerinde test, lint ve build çalıştırır.

Dersin teslim kutusuna **public GitHub repository adresi** yazılır:
https://github.com/AbdulrahmanZaidan/web

Canlı yayını da açıp 13 maddelik listeyi kontrol edin. Kontrol rehberi:
[kampus-etkinlik/docs/SPRINT6_KONTROL.md](kampus-etkinlik/docs/SPRINT6_KONTROL.md).

## Teknik kaynaklar

- https://reactrouter.com/start/declarative/routing
- https://react.dev/reference/react/createContext
- https://vercel.com/docs/frameworks/frontend/vite
