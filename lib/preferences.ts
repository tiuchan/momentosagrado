export interface UserPreferences {
  theme: "light" | "dark" | "system"
  fontSize: "small" | "medium" | "large"
  autoSave: boolean
}

export const defaultPreferences: UserPreferences = {
  theme: "system",
  fontSize: "medium",
  autoSave: true,
}

export const loadPreferences = (): UserPreferences => {
  if (typeof window === "undefined") return defaultPreferences

  try {
    const stored = localStorage.getItem("momento-sagrado-preferences")
    if (stored) {
      return { ...defaultPreferences, ...JSON.parse(stored) }
    }
  } catch (error) {
    console.error("[v0] Error loading preferences:", error)
  }

  return defaultPreferences
}

export const savePreferences = (preferences: UserPreferences): void => {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem("momento-sagrado-preferences", JSON.stringify(preferences))
  } catch (error) {
    console.error("[v0] Error saving preferences:", error)
  }
}

export const loadConversationHistory = (): any[] => {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem("momento-sagrado-history")
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error("[v0] Error loading history:", error)
  }

  return []
}

export const saveConversationHistory = (messages: any[]): void => {
  if (typeof window === "undefined") return

  try {
    const history = loadConversationHistory()
    const newEntry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      messages: messages.slice(1), // Skip initial greeting
    }

    const updated = [newEntry, ...history].slice(0, 20) // Keep last 20 conversations
    localStorage.setItem("momento-sagrado-history", JSON.stringify(updated))
  } catch (error) {
    console.error("[v0] Error saving history:", error)
  }
}

export const loadFavorites = (): string[] => {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem("momento-sagrado-favorites")
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error("[v0] Error loading favorites:", error)
  }

  return []
}

export const saveFavorite = (content: string): void => {
  if (typeof window === "undefined") return

  try {
    const favorites = loadFavorites()
    if (!favorites.includes(content)) {
      const updated = [content, ...favorites].slice(0, 50) // Keep last 50 favorites
      localStorage.setItem("momento-sagrado-favorites", JSON.stringify(updated))
    }
  } catch (error) {
    console.error("[v0] Error saving favorite:", error)
  }
}

export const removeFavorite = (content: string): void => {
  if (typeof window === "undefined") return

  try {
    const favorites = loadFavorites()
    const updated = favorites.filter((f) => f !== content)
    localStorage.setItem("momento-sagrado-favorites", JSON.stringify(updated))
  } catch (error) {
    console.error("[v0] Error removing favorite:", error)
  }
}
