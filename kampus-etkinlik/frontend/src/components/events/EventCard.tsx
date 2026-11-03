import { Link } from 'react-router-dom'
import type { CampusEvent } from '../../types/campus-event'
import { formatDate } from '../../utils/format-date'

interface EventCardProps {
  event: CampusEvent
}

function EventCard({ event }: EventCardProps) {
  return (
    <article className="event-card">
      <p className="category-label">{event.category}</p>
      <h3>{event.title}</h3>
      <p><strong>Tarih:</strong> <time dateTime={`${event.date}T${event.time}`}>{formatDate(event.date)} · {event.time}</time></p>
      <p><strong>Yer:</strong> {event.location}</p>
      <p><strong>Kontenjan:</strong> {event.capacity} kişi</p>
      <p className="card-description">{event.description}</p>
      <Link className="detail-link" to={`/events/${event.id}`} aria-label={`${event.title} detayları`}>
        Detayları gör →
      </Link>
    </article>
  )
}

export default EventCard
