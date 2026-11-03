# Sprint 6 — Kısa sunum provası

1. `main.tsx`: BrowserRouter adresi okur; EventsProvider ortak listeyi sağlar.
2. `App.tsx`: 10 route tanımlar. Header/Navigation/Footer sabittir; eski page state'i yoktur.
3. EventsPage: useEvents ile listeyi alır; arama ve kategori kendi state'idir.
4. EventDetailPage: useParams ile ID'yi alır, findEventById ile bulur; yoksa NotFoundPage döner.
   EventDetail sadece event prop'unu gösterir; veri kaynağını bilmez.
5. EventForm: yedi kontrollü alan tek data nesnesindedir. name/value/onChange birbirine bağlıdır.
6. validateEvent: DOM'a dokunmayan saf fonksiyon; hata nesnesi boşsa form geçerlidir.
7. Add/Edit sayfaları aynı formu farklı initialData ve submitText ile kullanır.
8. Context: eklemede spread, güncellemede map, silmede filter ile yeni dizi üretilir.
   Güncelleme tüm sayfalarda görünür; yenilemede başlangıç verisi gelir.
9. Admin: silmeden önce confirm; iptal edilirse değişiklik olmaz. Mobilde satırlar kart olur.
10. Auth sayfaları demo: yalnızca doğrulama ve mesaj vardır; gerçek hesap oluşturulmaz.

## Gösterilecek akış

- `/events`: ATÖLYE araması, kategori değişimi, sonuç yok durumu.
- `/events/event-2`: detay; tarayıcı geri/ileri ve yenileme.
- `/admin/new`: boş gönderim → yedi hata; geçerli form → listede yeni kayıt.
- Kayıt adına Düzenle → dolu form → güncelle; ana sayfa/listedeki değişimi göster.
- Sil → önce iptal; sonra onay.
- `/login`, `/register`, `/forgot-password`: hata ve başarı mesajları.
- `/xyz` ve `/events/yok`: bulunamadı.
- Pencereyi 390 px yap: yönetim satırlarının kartlara dönüşmesi.

Kodun her bölümünü kendi cümlelerinle açıklayarak prova yap.
