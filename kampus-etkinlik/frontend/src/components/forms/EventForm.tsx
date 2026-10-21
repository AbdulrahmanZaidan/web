import type { Category } from '../../types/campus-event'

interface EventFormProps {
  onSubmit: () => void
}

const formCategories: Category[] = ['Seminer', 'Atölye', 'Söyleşi', 'Yarışma']

function EventForm({ onSubmit }: EventFormProps) {
  return (
    <form className="event-form" noValidate onSubmit={(e) => { e.preventDefault(); onSubmit() }}>
      <p className="form-hint">Bu sprintte form sadece görünüm; kayıt yapılmaz.</p>
      <div className="form-field">
        <label htmlFor="title">Etkinlik Adı</label>
        <input id="title" name="title" type="text" maxLength={80} />
      </div>
      <div className="form-field">
        <label htmlFor="category">Kategori</label>
        <select id="category" name="category">
          <option value="">Seçiniz</option>
          {formCategories.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </div>
      <div className="form-field">
        <label htmlFor="date">Tarih</label>
        <input id="date" name="date" type="date" />
      </div>
      <div className="form-field">
        <label htmlFor="time">Saat</label>
        <input id="time" name="time" type="time" />
      </div>
      <div className="form-field">
        <label htmlFor="location">Yer</label>
        <input id="location" name="location" type="text" maxLength={120} />
      </div>
      <div className="form-field">
        <label htmlFor="capacity">Kontenjan</label>
        <input id="capacity" name="capacity" type="number" min={1} max={1000} step={1} />
      </div>
      <div className="form-field">
        <label htmlFor="description">Açıklama</label>
        <textarea id="description" name="description" rows={5} maxLength={2000} />
      </div>
      <button type="submit">Kaydet</button>
    </form>
  )
}

export default EventForm
