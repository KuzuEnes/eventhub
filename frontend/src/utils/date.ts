/**
 * Tarih yardımcı fonksiyonları
 * datetime-local input elemanları için ISO string dönüşümleri
 */

/**
 * ISO tarih string'ini datetime-local input formatına çevirir
 * @param iso - ISO 8601 tarih string'i (örn: "2024-03-15T14:30:00.000Z")
 * @returns datetime-local formatı (örn: "2024-03-15T14:30")
 * 
 * @example
 * toDatetimeLocal("2024-03-15T14:30:00.000Z") // "2024-03-15T14:30"
 * toDatetimeLocal("2024-12-25T09:00:00Z") // "2024-12-25T09:00"
 */
export function toDatetimeLocal(iso: string): string {
  if (!iso) return ''
  
  // ISO string'i Date objesine çevir ve lokal timezone'a göre formatla
  const date = new Date(iso)
  
  // YYYY-MM-DDTHH:mm formatında al (datetime-local input için)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

/**
 * datetime-local input formatını ISO string'e çevirir
 * @param value - datetime-local formatı (örn: "2024-03-15T14:30")
 * @returns ISO 8601 string (örn: "2024-03-15T14:30:00.000Z")
 * 
 * @example
 * fromDatetimeLocal("2024-03-15T14:30") // "2024-03-15T14:30:00.000Z"
 * fromDatetimeLocal("2024-12-25T09:00") // "2024-12-25T09:00:00.000Z"
 */
export function fromDatetimeLocal(value: string): string {
  if (!value) return ''
  
  // datetime-local formatını Date objesine çevir
  const date = new Date(value)
  
  // ISO string olarak döndür
  return date.toISOString()
}
