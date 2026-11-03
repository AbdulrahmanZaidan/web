import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { categories, type EventFormData, type EventFormErrors } from '../../types/campus-event'
import { validateEvent } from '../../utils/validate-event'
interface EventFormProps {
  initialData: EventFormData
  submitText: string
  onSubmit: (data: EventFormData) => void
}
function EventForm({ initialData, submitText, onSubmit }: EventFormProps) {
  const [data, setData] = useState<EventFormData>(initialData)
  const [errors, setErrors] = useState<EventFormErrors>({})
  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setData({ ...data, [e.target.name]: e.target.value })
  }
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const found = validateEvent(data)
    setErrors(found)
    if (Object.keys(found).length === 0) onSubmit(data)
  }
  return <form className="event-form" noValidate onSubmit={handleSubmit}>
    <div className="form-field">
      <label htmlFor="title">Etkinlik Adı</label>
      <input type="text" id="title" name="title" value={data.title} onChange={handleChange} required aria-invalid={errors.title ? true : undefined} aria-describedby={errors.title ? "title-error" : undefined} />
      {errors.title && <span id="title-error" className="hata-metni" role="alert">{errors.title}</span>}
    </div>
    <div className="form-field">
      <label htmlFor="category">Kategori</label>
      <select id="category" name="category" value={data.category} onChange={handleChange} required aria-invalid={errors.category ? true : undefined} aria-describedby={errors.category ? "category-error" : undefined}><option value="">Seçiniz</option>{categories.map((item) => <option key={item} value={item}>{item}</option>)}</select>
      {errors.category && <span id="category-error" className="hata-metni" role="alert">{errors.category}</span>}
    </div>
    <div className="form-field">
      <label htmlFor="date">Tarih</label>
      <input type="date" id="date" name="date" value={data.date} onChange={handleChange} required aria-invalid={errors.date ? true : undefined} aria-describedby={errors.date ? "date-error" : undefined} />
      {errors.date && <span id="date-error" className="hata-metni" role="alert">{errors.date}</span>}
    </div>
    <div className="form-field">
      <label htmlFor="time">Saat</label>
      <input type="time" id="time" name="time" value={data.time} onChange={handleChange} required aria-invalid={errors.time ? true : undefined} aria-describedby={errors.time ? "time-error" : undefined} />
      {errors.time && <span id="time-error" className="hata-metni" role="alert">{errors.time}</span>}
    </div>
    <div className="form-field">
      <label htmlFor="location">Yer</label>
      <input type="text" id="location" name="location" value={data.location} onChange={handleChange} required aria-invalid={errors.location ? true : undefined} aria-describedby={errors.location ? "location-error" : undefined} />
      {errors.location && <span id="location-error" className="hata-metni" role="alert">{errors.location}</span>}
    </div>
    <div className="form-field">
      <label htmlFor="capacity">Kontenjan</label>
      <input type="number" id="capacity" name="capacity" value={data.capacity} onChange={handleChange} required aria-invalid={errors.capacity ? true : undefined} aria-describedby={errors.capacity ? "capacity-error" : undefined} min={1} max={1000} step={1} />
      {errors.capacity && <span id="capacity-error" className="hata-metni" role="alert">{errors.capacity}</span>}
    </div>
    <div className="form-field">
      <label htmlFor="description">Açıklama</label>
      <textarea id="description" name="description" value={data.description} onChange={handleChange} required aria-invalid={errors.description ? true : undefined} aria-describedby={errors.description ? "description-error" : undefined} rows={5} maxLength={2000} />
      {errors.description && <span id="description-error" className="hata-metni" role="alert">{errors.description}</span>}
    </div>
    <div className="detail-actions"><button type="submit">{submitText}</button><Link to="/admin">Vazgeç</Link></div>
  </form>
}
export default EventForm
