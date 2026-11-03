import { Link } from 'react-router-dom'
import type { CampusEvent } from '../../types/campus-event'
import { formatDate } from '../../utils/format-date'

interface EventDetailProps {
  event: CampusEvent
}

function EventDetail({ event }: EventDetailProps) {
  return (
    <article className={`detail-grid${event.image ? '' : ' without-image'}`}>
      {event.image && (
        <figure>
          <img src={event.image} alt={`${event.title} afişi`} />
          <figcaption>{event.title} — etkinlik afişi</figcaption>
        </figure>
      )}
      <div>
        <h2>Etkinlik Bilgileri</h2>
        <dl>
          <dt>Tarih</dt><dd><time dateTime={`${event.date}T${event.time}`}>{formatDate(event.date)} · {event.time}</time></dd>
          <dt>Yer</dt><dd>{event.location}</dd>
          <dt>Kategori</dt><dd>{event.category}</dd>
          <dt>Kontenjan</dt><dd>{event.capacity} kişi</dd>
        </dl>
        <p>{event.description}</p>
        <div className="detail-actions">
          <Link className="button-link" to={`/admin/${event.id}/edit`}>Bu etkinliği güncelle</Link>
          <Link to="/events">Listeye dön</Link>
        </div>
      </div>
    </article>
  )
}

export default EventDetail
