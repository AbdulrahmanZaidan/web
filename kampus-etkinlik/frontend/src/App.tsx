import './App.css'
import { useEffect, useState } from 'react'
import { events } from './data/events'
import type { Category } from './types/campus-event'
import type { PageName } from './types/page'
import { filterByCategory, findEventById, searchEvents } from './utils/filter-events'
import Header from './components/layout/Header'
import Navigation from './components/layout/Navigation'
import Footer from './components/layout/Footer'
import EventList from './components/events/EventList'
import EventFilter from './components/events/EventFilter'
import EventDetail from './components/events/EventDetail'
import EventForm from './components/forms/EventForm'

const categories = [...new Set(events.map((event) => event.category))]

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

  return (
    <>
      <header className="site-header">
        <div className="container">
          <Header title={title} />
          <Navigation current={page} onNavigate={go} />
        </div>
      </header>
      <main className="container">
        {page === 'home' && (
          <>
            <p className="intro">Kampüsteki seminer, atölye ve söyleşileri keşfedin. İlginizi çeken etkinliğin ayrıntılarına göz atın.</p>
            <section aria-labelledby="upcoming-heading">
              <h2 id="upcoming-heading">Yaklaşan Etkinlikler</h2>
              <EventList events={upcoming} onShowDetail={(id) => go('detail', id)} className="upcoming-grid" />
              <p className="all-events"><a href="#" onClick={(e) => { e.preventDefault(); go('events') }}>Tüm etkinlikleri gör →</a></p>
            </section>
          </>
        )}
        {page === 'events' && (
          <section aria-label="Etkinlik listesi">
            <EventFilter searchText={searchText} category={category} categories={categories}
              onSearchChange={setSearchText} onCategoryChange={setCategory} />
            <p id="sonuc" role="status">{filtered.length} etkinlik bulundu.</p>
            <EventList events={filtered} onShowDetail={(id) => go('detail', id)}
              emptyText="Aramanıza uygun etkinlik bulunamadı." />
          </section>
        )}
        {page === 'detail' && (selected ? (
          <EventDetail event={selected} onBack={() => go('events')} onEdit={(id) => go('update', id)} />
        ) : (
          <div className="notice notice-error" role="alert">
            <p>Etkinlik bulunamadı. Lütfen listeden bir etkinlik seçin.</p>
            <a href="#" onClick={(e) => { e.preventDefault(); go('events') }}>Listeye dön</a>
          </div>
        ))}
        {(page === 'add' || page === 'update') && (
          <EventForm key={page} onSubmit={() => window.scrollTo(0, 0)} />
        )}
      </main>
      <Footer />
    </>
  )
}

export default App
