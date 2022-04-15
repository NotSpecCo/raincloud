type Parts = {
  city?: string;
  country?: string;
};

export function formatLocation(parts: Parts): string {
  return [parts.city, parts.country].filter(Boolean).join(', ');
}
