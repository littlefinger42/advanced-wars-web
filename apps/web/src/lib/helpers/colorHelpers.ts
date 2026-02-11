/**
 * Color manipulation helpers for sprite palettes.
 */

export function darken(hex: string, pct: number): string {
  const n = parseInt(hex.slice(1), 16)
  const r = Math.max(0, ((n >> 16) & 0xff) * (1 - pct))
  const g = Math.max(0, ((n >> 8) & 0xff) * (1 - pct))
  const b = Math.max(0, (n & 0xff) * (1 - pct))
  return (
    '#' +
    [r, g, b]
      .map((c) => Math.round(c).toString(16).padStart(2, '0'))
      .join('')
  )
}

export function lighten(hex: string, pct: number): string {
  const n = parseInt(hex.slice(1), 16)
  const r = Math.min(255, ((n >> 16) & 0xff) + 255 * pct)
  const g = Math.min(255, ((n >> 8) & 0xff) + 255 * pct)
  const b = Math.min(255, (n & 0xff) + 255 * pct)
  return (
    '#' +
    [r, g, b]
      .map((c) => Math.round(c).toString(16).padStart(2, '0'))
      .join('')
  )
}
