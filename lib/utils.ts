export function isExpiringSoon(date: string | null) {
  if (!date) return false;
  const days = (new Date(date).getTime() - Date.now()) / 86400000;
  return days >= 0 && days <= 3;
}
