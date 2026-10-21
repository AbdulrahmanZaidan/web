import type { Category } from '../../types/campus-event'

interface EventFilterProps {
  searchText: string
  category: Category | ''
  categories: Category[]
  onSearchChange: (text: string) => void
  onCategoryChange: (category: Category | '') => void
}

function EventFilter({ searchText, category, categories, onSearchChange, onCategoryChange }: EventFilterProps) {
  return (
    <form className="filtre" role="search" onSubmit={(e) => e.preventDefault()}>
      <div>
        <label htmlFor="search">Etkinlik ara</label>
        <input id="search" type="search" placeholder="Başlık veya açıklama ara…" value={searchText}
          onChange={(e) => onSearchChange(e.target.value)} />
      </div>
      <div>
        <label htmlFor="category-filter">Kategori</label>
        <select id="category-filter" value={category} onChange={(e) => onCategoryChange(e.target.value as Category | '')}>
          <option value="">Tümü</option>
          {categories.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </div>
    </form>
  )
}

export default EventFilter
