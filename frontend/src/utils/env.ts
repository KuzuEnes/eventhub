export const getEnv = (key: string, defaultValue?: string): string => {
  const value = import.meta.env[key] || defaultValue

  if (!value) {
    console.warn(`Environment variable ${key} is not defined`)
  }

  return value || ''
}

export const API_URL = import.meta.env.VITE_API_URL

