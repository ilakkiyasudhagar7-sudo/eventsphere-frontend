// src/api/currentUser.js
const STORAGE_KEY = 'eventsphere_user'

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}