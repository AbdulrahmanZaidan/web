import { Link } from 'react-router-dom'
import { useEvents } from '../context/EventsContext'
import { formatDate } from '../utils/format-date'
function AdminPage() {
  const { events, deleteEvent } = useEvents()
  function handleDelete(id: string, title: string) {
    if (window.confirm(`"${title}" silinsin mi?`)) deleteEvent(id)
  }
  return <>
    <title>Etkinlik Yönetimi — Kampüs Etkinlikleri</title>
    <h2>Etkinlik Yönetimi</h2>
    <p><Link className="button-link" to="/admin/new">+ Yeni etkinlik</Link></p>
    {events.length === 0 ? <p className="empty-state" role="status">Henüz etkinlik yok.</p> :
      <table className="tablo">
        <caption className="sr-only">Etkinlik yönetimi listesi</caption>
        <thead><tr><th scope="col">Etkinlik</th><th scope="col">Tarih</th><th scope="col">Kategori</th><th scope="col">İşlemler</th></tr></thead>
        <tbody>{events.map((event) => <tr key={event.id}>
          <td data-baslik="Etkinlik">{event.title}</td>
          <td data-baslik="Tarih"><time dateTime={event.date}>{formatDate(event.date)}</time></td>
          <td data-baslik="Kategori">{event.category}</td>
          <td className="islem-hucre"><div className="islemler">
            <Link className="button-link" to={`/admin/${event.id}/edit`} aria-label={`${event.title}: Düzenle`}>Düzenle</Link>
            <button className="buton-sil" type="button" aria-label={`${event.title}: Sil`} onClick={() => handleDelete(event.id, event.title)}>Sil</button>
          </div></td>
        </tr>)}</tbody>
      </table>}
  </>
}
export default AdminPage
