import type { CampusEvent } from '../../types/campus-event'
import { formatDate } from '../../utils/format-date'

interface EventCardProps {
  event: CampusEvent
  onShowDetail: (id: string) => void
}

function EventCard({ event, onShowDetail }: EventCardProps) {
  return (
    <article className="event-card">
      <p className="category-label">{event.category}</p>
      <h3>{event.title}</h3>
      <p><strong>Tarih:</strong> <time dateTime={`${event.date}T${event.time}`}>{formatDate(event.date)} · {event.time}</time></p>
      <p><strong>Yer:</strong> {event.location}</p>
      <p><strong>Kontenjan:</strong> {event.capacity} kişi</p>
      <p className="card-description">{event.description}</p>
      <a className="detail-link" href="#" aria-label={`${event.title} detayları`}
        onClick={(e) => { e.preventDefault(); onShowDetail(event.id) }}>
        Detayları gör →
      </a>
    </article>
  )
}

export default EventCard
