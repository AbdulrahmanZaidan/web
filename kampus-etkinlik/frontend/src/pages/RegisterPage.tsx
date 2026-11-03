import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
interface RegisterErrors { name?: string; email?: string; password?: string; password2?: string }
function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [errors, setErrors] = useState<RegisterErrors>({})
  const [sent, setSent] = useState(false)
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const found: RegisterErrors = {}
    if (!email.includes('@')) found.email = 'Geçerli bir e-posta girin.'
    if (password.length < 6) found.password = 'Şifre en az 6 karakter olmalı.'
    if (name.trim().length < 3) found.name = 'Ad soyad en az 3 karakter olmalı.'
    if (password2 !== password || !password2) found.password2 = 'Şifreler aynı değil.'
    setErrors(found)
    setSent(Object.keys(found).length === 0)
  }
  return <><title>Kayıt Ol — Kampüs Etkinlikleri</title><h2>Kayıt Ol</h2>
    <form className="event-form auth-form" noValidate onSubmit={handleSubmit}>
      {sent && <p className="notice notice-success" role="status">Form geçerli. Gerçek kayıt Sprint 10’da.</p>}
      <div className="form-field">
        <label htmlFor="name">Ad Soyad</label>
        <input id="name" name="name" type="text" autoComplete="name" required value={name}
          onChange={(e) => { setName(e.target.value); setSent(false) }}
          aria-invalid={errors.name ? true : undefined} aria-describedby={errors.name ? 'name-error' : undefined} />
        {errors.name && <span className="hata-metni" id="name-error" role="alert">{errors.name}</span>}
      </div>
      <div className="form-field">
        <label htmlFor="email">E-posta</label>
        <input id="email" name="email" type="email" autoComplete="email" required value={email}
          onChange={(e) => { setEmail(e.target.value); setSent(false) }}
          aria-invalid={errors.email ? true : undefined} aria-describedby={errors.email ? 'email-error' : undefined} />
        {errors.email && <span className="hata-metni" id="email-error" role="alert">{errors.email}</span>}
      </div>
      <div className="form-field">
        <label htmlFor="password">Şifre</label>
        <input id="password" name="password" type="password" autoComplete="new-password" required value={password}
          onChange={(e) => { setPassword(e.target.value); setSent(false) }}
          aria-invalid={errors.password ? true : undefined} aria-describedby={errors.password ? 'password-error' : undefined} />
        {errors.password && <span className="hata-metni" id="password-error" role="alert">{errors.password}</span>}
      </div>
      <div className="form-field">
        <label htmlFor="password2">Şifre (tekrar)</label>
        <input id="password2" name="password2" type="password" autoComplete="new-password" required value={password2}
          onChange={(e) => { setPassword2(e.target.value); setSent(false) }}
          aria-invalid={errors.password2 ? true : undefined} aria-describedby={errors.password2 ? 'password2-error' : undefined} />
        {errors.password2 && <span className="hata-metni" id="password2-error" role="alert">{errors.password2}</span>}
      </div>
      <button type="submit">Kayıt ol</button>
    </form>
    <p className="auth-links"><Link to="/login">Zaten hesabın var mı? Giriş yap</Link></p>
  </>
}
export default RegisterPage
