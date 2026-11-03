import { useParams } from 'react-router-dom'
import { useEvents } from '../context/EventsContext'
import { findEventById } from '../utils/filter-events'
import EventDetail from '../components/events/EventDetail'
import NotFoundPage from './NotFoundPage'
function EventDetailPage() {
  const { id } = useParams()
  const { events } = useEvents()
  const event = findEventById(events, id ?? '')
  if (!event) return <NotFoundPage />
  return <><title>{`${event.title} — Kampüs Etkinlikleri`}</title><h2>{event.title}</h2><EventDetail event={event} /></>
}
export default EventDetailPage
