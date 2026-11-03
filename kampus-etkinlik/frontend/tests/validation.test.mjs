import { test } from 'node:test'
import assert from 'node:assert/strict'
import { validateEvent } from '../src/utils/validate-event.ts'
import { searchEvents, filterByCategory, findEventById } from '../src/utils/filter-events.ts'
const valid = { title: 'Deneme', category: 'Seminer', date: '2026-11-04', time: '14:00', location: 'Salon', capacity: '20', description: 'Etkinlik açıklaması.' }
test('Boş form: yedi alan için hata', () => {
  const empty = Object.fromEntries(Object.keys(valid).map((key) => [key, '']))
  assert.equal(Object.keys(validateEvent(empty)).length, 7)
})
test('Geçerli form ve kontenjan sınırları', () => {
  for (const capacity of ['1', '1000']) assert.deepEqual(validateEvent({ ...valid, capacity }), {})
  for (const capacity of ['', '0', '-1', '1.5', '1001', 'abc', 'Infinity']) assert.ok(validateEvent({ ...valid, capacity }).capacity)
})
test('Kırpılmış başlık, açıklama ve zorunlu alanlar', () => {
  assert.ok(validateEvent({ ...valid, title: ' a ' }).title)
  assert.ok(validateEvent({ ...valid, description: '  kısa  ' }).description)
  assert.ok(validateEvent({ ...valid, location: '   ' }).location)
  assert.deepEqual(validateEvent({ ...valid, title: ' abc ', description: ' 0123456789 ' }), {})
})
test('Türkçe arama, kategori birleşimi ve kimlik; kaynak dizi korunur', () => {
  const list = Object.freeze([
    Object.freeze({ ...valid, id: '1', title: 'Girişimcilik Söyleşisi', category: 'Söyleşi', description: 'Soru cevap' }),
    Object.freeze({ ...valid, id: '2', title: 'Robotik Atölyesi', category: 'Atölye', description: 'Arduino ile robot yapımı' }),
  ])
  assert.equal(searchEvents(list, ' GİRİŞİMCİLİK ')[0].id, '1')
  assert.equal(searchEvents(list, 'ARDUİNO')[0].id, '2')
  assert.equal(filterByCategory(searchEvents(list, 'robot'), 'Seminer').length, 0)
  assert.equal(findEventById(list, 'yok'), undefined)
  assert.equal(findEventById(list, '2').title, 'Robotik Atölyesi')
  assert.equal(list.length, 2)
})
