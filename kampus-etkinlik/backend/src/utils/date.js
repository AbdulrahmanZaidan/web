// API'de "GG-AA-YYYY" metni, veritabanında gerçek Date.

// "15-10-2026" → Date. Biçim yanlışsa geçersiz Date döner; Mongoose bunu CastError yapar (400).
export function parseDate(value) {
  // null/undefined schema'nın required kuralına, Date ise (sorgular) olduğu gibi kalır.
  if (value == null || value instanceof Date) return value;
  const m = typeof value === "string" && /^(\d{2})-(\d{2})-(\d{4})$/.exec(value);
  if (!m) return new Date(NaN); // biçim yanlış (2026-12-20, sayı, nesne...)
  const [, gun, ay, yil] = m.map(Number);
  const tarih = new Date(Date.UTC(yil, ay - 1, gun));
  if (tarih.getUTCDate() !== gun || tarih.getUTCMonth() !== ay - 1) {
    return new Date(NaN); // 31-02-2026 gibi takvimde olmayan gün
  }
  return tarih;
}

// Date → "15-10-2026"
export function formatDate(tarih) {
  if (!(tarih instanceof Date)) return tarih;
  const gun = String(tarih.getUTCDate()).padStart(2, "0");
  const ay = String(tarih.getUTCMonth() + 1).padStart(2, "0");
  return `${gun}-${ay}-${tarih.getUTCFullYear()}`;
}

// Bugünün başı (UTC); /events/upcoming için.
export function todayStart() {
  const s = new Date();
  return new Date(Date.UTC(s.getUTCFullYear(), s.getUTCMonth(), s.getUTCDate()));
}
