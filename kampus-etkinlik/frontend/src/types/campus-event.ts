export type Category = 'Seminer' | 'Atölye' | 'Söyleşi' | 'Yarışma'

export interface CampusEvent {
  id: string
  title: string
  category: Category
  capacity: number
  date: string
  time: string
  location: string
  description: string
  image?: string
}

// Form alanları metin döndürür; kayıtta kontenjan sayıya çevrilir.
export interface EventFormData {
  title: string
  category: Category | ''
  date: string
  time: string
  location: string
  capacity: string
  description: string
}
export type EventFormErrors = Partial<Record<keyof EventFormData, string>>
export const categories: Category[] = ['Seminer', 'Atölye', 'Söyleşi', 'Yarışma']
