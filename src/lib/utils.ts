export const monthsOptions: { value: string; label: string }[] = Array.from(
  { length: 12 },
  (_, i) => ({
    value: String(i),
    label: new Date(2025, i).toLocaleString('default', { month: 'long' }),
  })
)
