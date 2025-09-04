export const camelToSnakeCase = <T extends object, U extends object>(obj: T): U => {
  const newObj = {} as Record<string, unknown>
  for (const key in obj) {
    const newKey = key.replace(/([A-Z])/g, '_$1').toLowerCase()
    newObj[newKey] = (obj as Record<string, unknown>)[key]
  }
  return newObj as U
}

export const snakeToCamelCase = <T extends object, U extends object>(obj: T): U => {
  const newObj = {} as Record<string, unknown>
  for (const key in obj) {
    const newKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
    newObj[newKey] = (obj as Record<string, unknown>)[key]
  }
  return newObj as U
}

export const getBaseFetchHeaders = () => {
  return {
    headers: {
      apikey: import.meta.env.REMOVED,
      Authorization: `Bearer ${import.meta.env.REMOVED}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
  }
}
