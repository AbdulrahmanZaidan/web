import { useState } from 'react'
import { useEvents } from '../context/EventsContext'
import type { Category } from '../types/campus-event'
import { filterByCategory, searchEvents } from '../utils/filter-events'
import EventFilter from '../components/events/EventFilter'
import EventList from '../components/events/EventList'
function EventsPage() {
  const { events } = useEvents()
  const [searchText, setSearchText] = useState('')
  const [category, setCategory] = useState<Category | ''>('')
  const categories = [...new Set(events.map((event) => event.category))]
  const filtered = filterByCategory(searchEvents(events, searchText), category)
  return <>
    <title>Etkinlikler — Kampüs Etkinlikleri</title>
    <h2>Etkinlikler</h2>
    <EventFilter searchText={searchText} category={category} categories={categories}
      onSearchChange={setSearchText} onCategoryChange={setCategory} />
    <p id="sonuc" role="status">{filtered.length} etkinlik bulundu.</p>
    <EventList events={filtered} emptyText="Aramanıza uygun etkinlik bulunamadı." />
  </>
}
export default EventsPage
