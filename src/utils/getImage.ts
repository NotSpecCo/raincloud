export function getImage(imageUrl?: string, size: 60 | 120 | 240 | 500 = 120) {
  if (!imageUrl) return '';
  return imageUrl.replace(/(.*)(large)(.jpg)/, `$1t${size}x${size}$3`);
}
