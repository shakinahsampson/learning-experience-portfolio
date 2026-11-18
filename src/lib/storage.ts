import { useEffect, useState } from 'react'

const PREFIX = 'ss-portfolio:'

export function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function saveJSON(key: string, value: unknown) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    /* storage unavailable (private mode); progress simply won't persist */
  }
}

export function clearAllProgress() {
  try {
    Object.keys(localStorage).filter((k) => k.startsWith(PREFIX)).forEach((k) => localStorage.removeItem(k))
  } catch {
    /* ignore */
  }
}

export function usePersisted<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => loadJSON(key, initial))
  useEffect(() => saveJSON(key, value), [key, value])
  return [value, setValue] as const
}

export const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
