import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const found = email.includes('@') ? '' : 'Geçerli bir e-posta girin.'
    setError(found)
    setSent(found === '')
  }
  return <><title>Şifremi Unuttum — Kampüs Etkinlikleri</title><h2>Şifremi Unuttum</h2>
    <p>E-posta adresinizi yazın. Bu sayfa şifre yenileme bağlantısı için bir demodur.</p>
    <form className="event-form auth-form" noValidate onSubmit={handleSubmit}>
      {sent && <p className="notice notice-success" role="status">Bağlantı {email} adresine gönderildi (demo).</p>}
      <div className="form-field">
        <label htmlFor="email">E-posta</label>
        <input id="email" name="email" type="email" autoComplete="email" required value={email}
          onChange={(e) => { setEmail(e.target.value); setSent(false) }}
          aria-invalid={error ? true : undefined} aria-describedby={error ? 'email-error' : undefined} />
        {error && <span className="hata-metni" id="email-error" role="alert">{error}</span>}
      </div>
      <button type="submit">Bağlantı gönder</button>
    </form>
    <p className="auth-links"><Link to="/login">← Girişe dön</Link></p>
  </>
}
export default ForgotPasswordPage
