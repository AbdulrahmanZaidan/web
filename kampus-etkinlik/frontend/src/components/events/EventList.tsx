import type { CampusEvent } from '../../types/campus-event'
import EventCard from './EventCard'

interface EventListProps {
  events: CampusEvent[]
  emptyText?: string
  className?: string
}

function EventList({ events, emptyText = 'Etkinlik bulunamadı.', className = '' }: EventListProps) {
  return (
    <div className={`event-grid${className ? ` ${className}` : ''}`}>
      {events.length === 0 ? <p className="empty-state">{emptyText}</p> :
        events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
    </div>
  )
}

export default EventList
