import type { CampusEvent, Category } from '../types/campus-event'

export function searchEvents(list: CampusEvent[], text: string): CampusEvent[] {
  const query = text.trim().toLocaleLowerCase('tr-TR')
  return list.filter((event) =>
    event.title.toLocaleLowerCase('tr-TR').includes(query) ||
    event.description.toLocaleLowerCase('tr-TR').includes(query),
  )
}

export function filterByCategory(list: CampusEvent[], category: Category | ''): CampusEvent[] {
  return category === '' ? list : list.filter((event) => event.category === category)
}

export function findEventById(list: CampusEvent[], id: string): CampusEvent | undefined {
  return list.find((event) => event.id === id)
}
