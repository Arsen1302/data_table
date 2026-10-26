const priceFormatters = new Map<string, Intl.NumberFormat>();

const createPriceFormatter = (currency: string): Intl.NumberFormat => {
  try {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    });
  } catch {
    return new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 });
  }
};

export const formatPrice = (priceMinor: number, minorUnits: number, currency: string): string => {
  const formatter = priceFormatters.get(currency) ?? createPriceFormatter(currency);
  priceFormatters.set(currency, formatter);
  return formatter.format(priceMinor / minorUnits);
};

export const formatRooms = (rooms: number): string => (rooms === 0 ? 'Студия' : String(rooms));

export const formatDate = (iso: string): string => new Date(iso).toLocaleDateString('ru-RU');
