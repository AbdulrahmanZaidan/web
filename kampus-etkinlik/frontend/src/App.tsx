import './App.css'
import { useEffect, useState } from 'react'
import { events } from './data/events'
import type { CampusEvent, Category } from './types/campus-event'
import { filterByCategory, findEventById, searchEvents } from './utils/filter-events'

type PageName = 'home' | 'events' | 'detail' | 'add' | 'update'

const navigation: { page: PageName; label: string }[] = [
  { page: 'home', label: 'Ana Sayfa' },
  { page: 'events', label: 'Etkinlikler' },
  { page: 'add', label: 'Ekle' },
]
const categories = [...new Set(events.map((event) => event.category))]
const formCategories: Category[] = ['Seminer', 'Atölye', 'Söyleşi', 'Yarışma']

function formatDate(date: string): string {
  const [year, month, day] = date.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('tr-TR', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

function App() {
  const [page, setPage] = useState<PageName>('home')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [searchText, setSearchText] = useState('')
  const [category, setCategory] = useState<Category | ''>('')

  function go(next: PageName, id: string | null = null): void {
    setPage(next)
    setSelectedId(id)
  }

  const selected = selectedId ? findEventById(events, selectedId) : undefined
  const titles: Record<PageName, string> = {
    home: 'Kampüs Etkinlikleri', events: 'Etkinlikler',
    detail: selected?.title ?? 'Etkinlik Bulunamadı',
    add: 'Etkinlik Ekle', update: 'Etkinlik Güncelle',
  }
  const title = titles[page]
  const upcoming = [...events]
    .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`))
    .slice(0, 2)
  const filtered = filterByCategory(searchEvents(events, searchText), category)

  useEffect(() => {
    document.title = `Kampüs Etkinlikleri — ${title}`
  }, [title])

  function renderCard(event: CampusEvent) {
    return (
      <article className="event-card" key={event.id}>
        <p className="category-label">{event.category}</p>
        <h3>{event.title}</h3>
        <p><strong>Tarih:</strong> <time dateTime={`${event.date}T${event.time}`}>{formatDate(event.date)} · {event.time}</time></p>
        <p><strong>Yer:</strong> {event.location}</p>
        <p><strong>Kontenjan:</strong> {event.capacity} kişi</p>
        <p className="card-description">{event.description}</p>
        <a className="detail-link" href="#" aria-label={`${event.title} detayları`}
          onClick={(e) => { e.preventDefault(); go('detail', event.id) }}>
          Detayları gör →
        </a>
      </article>
    )
  }

  return (
    <>
      <header className="site-header">
        <div className="container">
          <h1>{title}</h1>
          <nav aria-label="Ana menü">
            {navigation.map((item) => (
              <a key={item.page} href="#" aria-current={page === item.page ? 'page' : undefined}
                onClick={(e) => { e.preventDefault(); go(item.page) }}>
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>
      <main className="container">
        {page === 'home' && (
          <>
            <p className="intro">Kampüsteki seminer, atölye ve söyleşileri keşfedin. İlginizi çeken etkinliğin ayrıntılarına göz atın.</p>
            <section aria-labelledby="upcoming-heading">
              <h2 id="upcoming-heading">Yaklaşan Etkinlikler</h2>
              <div className="event-grid upcoming-grid">{upcoming.map(renderCard)}</div>
              <p className="all-events"><a href="#" onClick={(e) => { e.preventDefault(); go('events') }}>Tüm etkinlikleri gör →</a></p>
            </section>
          </>
        )}
        {page === 'events' && (
          <section aria-label="Etkinlik listesi">
            <form className="filtre" role="search" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label htmlFor="search">Etkinlik ara</label>
                <input id="search" type="search" placeholder="Başlık veya açıklama ara…" value={searchText}
                  onChange={(e) => setSearchText(e.target.value)} />
              </div>
              <div>
                <label htmlFor="category-filter">Kategori</label>
                <select id="category-filter" value={category} onChange={(e) => setCategory(e.target.value as Category | '')}>
                  <option value="">Tümü</option>
                  {categories.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>
            </form>
            <p id="sonuc" role="status">{filtered.length} etkinlik bulundu.</p>
            <div className="event-grid">
              {filtered.length > 0 ? filtered.map(renderCard) : <p className="empty-state">Aramanıza uygun etkinlik bulunamadı.</p>}
            </div>
          </section>
        )}
        {page === 'detail' && (
          selected ? (
            <article className={`detail-grid${selected.image ? '' : ' without-image'}`}>
              {selected.image && (
                <figure>
                  <img src={selected.image} alt={`${selected.title} afişi`} />
                  <figcaption>{selected.title} — etkinlik afişi</figcaption>
                </figure>
              )}
              <div>
                <h2>Etkinlik Bilgileri</h2>
                <dl>
                  <dt>Tarih</dt><dd><time dateTime={`${selected.date}T${selected.time}`}>{formatDate(selected.date)} · {selected.time}</time></dd>
                  <dt>Yer</dt><dd>{selected.location}</dd>
                  <dt>Kategori</dt><dd>{selected.category}</dd>
                  <dt>Kontenjan</dt><dd>{selected.capacity} kişi</dd>
                </dl>
                <p>{selected.description}</p>
                <div className="detail-actions">
                  <a className="button-link" href="#" onClick={(e) => { e.preventDefault(); go('update', selected.id) }}>Bu etkinliği güncelle</a>
                  <a href="#" onClick={(e) => { e.preventDefault(); go('events') }}>Listeye dön</a>
                </div>
              </div>
            </article>
          ) : (
            <div className="notice notice-error" role="alert">
              <p>Etkinlik bulunamadı. Lütfen listeden bir etkinlik seçin.</p>
              <a href="#" onClick={(e) => { e.preventDefault(); go('events') }}>Listeye dön</a>
            </div>
          )
        )}
        {(page === 'add' || page === 'update') && (
          <form key={page} className="event-form" noValidate onSubmit={(e) => e.preventDefault()}>
            <p className="form-hint">Bu sprintte form sadece görünüm; kayıt yapılmaz.</p>
            <div className="form-field">
              <label htmlFor="title">Etkinlik Adı</label>
              <input id="title" name="title" type="text" maxLength={80} />
            </div>
            <div className="form-field">
              <label htmlFor="category">Kategori</label>
              <select id="category" name="category">
                <option value="">Seçiniz</option>
                {formCategories.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="date">Tarih</label>
              <input id="date" name="date" type="date" />
            </div>
            <div className="form-field">
              <label htmlFor="time">Saat</label>
              <input id="time" name="time" type="time" />
            </div>
            <div className="form-field">
              <label htmlFor="location">Yer</label>
              <input id="location" name="location" type="text" maxLength={120} />
            </div>
            <div className="form-field">
              <label htmlFor="capacity">Kontenjan</label>
              <input id="capacity" name="capacity" type="number" min={1} max={1000} step={1} />
            </div>
            <div className="form-field">
              <label htmlFor="description">Açıklama</label>
              <textarea id="description" name="description" rows={5} maxLength={2000} />
            </div>
            <button type="submit">Kaydet</button>
          </form>
        )}
      </main>
      <footer className="site-footer container">
        <p>Abdelrahman Zidan · 2321032807 · 2026</p>
      </footer>
    </>
  )
}

export default App
