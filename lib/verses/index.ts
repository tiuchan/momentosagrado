import { cansacoVerses } from "./cansaco"
import { alegriaVerses } from "./alegria"
import { ansiedadeVerses } from "./ansiedade"

export interface Verse {
  ref: string
  text: string
}

export interface VerseDatabase {
  [key: string]: Verse[]
}

// Banco de dados completo de versículos organizados por tema
export const versesDatabase: VerseDatabase = {
  cansaco: cansacoVerses,
  alegria: alegriaVerses,
  ansiedade: ansiedadeVerses,
  // Mais temas serão adicionados aqui
}

// Função para buscar versículos aleatórios de um tema
export function getRandomVerses(theme: string, count = 3): Verse[] {
  const themeVerses = versesDatabase[theme] || []
  if (themeVerses.length === 0) return []

  const shuffled = [...themeVerses].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(count, shuffled.length))
}

// Função para buscar um versículo aleatório de um tema
export function getRandomVerse(theme: string): Verse | null {
  const verses = getRandomVerses(theme, 1)
  return verses.length > 0 ? verses[0] : null
}

// Função para buscar todos os temas disponíveis
export function getAvailableThemes(): string[] {
  return Object.keys(versesDatabase)
}

// Função para contar versículos por tema
export function getVerseCount(theme: string): number {
  return versesDatabase[theme]?.length || 0
}
