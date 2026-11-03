import { Link } from 'react-router-dom'
function NotFoundPage() {
  return <><title>Sayfa bulunamadı — Kampüs Etkinlikleri</title>
    <h2>Sayfa bulunamadı</h2><p>Aradığınız sayfa ya da etkinlik yok.</p>
    <Link className="button-link" to="/">Ana sayfaya dön</Link>
  </>
}
export default NotFoundPage
