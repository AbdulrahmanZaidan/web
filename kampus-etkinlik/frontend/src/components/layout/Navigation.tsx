import type { PageName } from '../../types/page'

interface NavigationProps {
  current: PageName
  onNavigate: (page: PageName) => void
}

const navigation: { page: PageName; label: string }[] = [
  { page: 'home', label: 'Ana Sayfa' },
  { page: 'events', label: 'Etkinlikler' },
  { page: 'add', label: 'Ekle' },
]

function Navigation({ current, onNavigate }: NavigationProps) {
  return (
    <nav aria-label="Ana menü">
      {navigation.map((item) => (
        <a key={item.page} href="#" aria-current={current === item.page ? 'page' : undefined}
          onClick={(e) => { e.preventDefault(); onNavigate(item.page) }}>
          {item.label}
        </a>
      ))}
    </nav>
  )
}

export default Navigation
