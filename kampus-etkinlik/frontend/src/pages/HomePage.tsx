import { Link } from 'react-router-dom'
import { useEvents } from '../context/EventsContext'
import EventList from '../components/events/EventList'
function HomePage() {
  const { events } = useEvents()
  const upcoming = [...events].sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`)).slice(0, 2)
  return <>
    <title>Ana Sayfa — Kampüs Etkinlikleri</title>
    <h2>Ana Sayfa</h2>
    <p className="intro">Kampüsteki etkinlikleri keşfedin. İlginizi çeken etkinliğin ayrıntılarına göz atın.</p>
    <section aria-labelledby="upcoming-heading">
      <h2 id="upcoming-heading">Yaklaşan 2 Etkinlik</h2>
      <EventList events={upcoming} className="upcoming-grid" />
      <p className="all-events"><Link to="/events">Tüm etkinlikleri gör →</Link></p>
    </section>
  </>
}
export default HomePage
