import { cansacoVerses } from "./cansaco"
import { alegriaVerses } from "./alegria"
import { ansiedadeVerses } from "./ansiedade"
import { feVerses } from "./fe"
import { esperancaVerses } from "./esperanca"
import { medoVerses } from "./medo"
import { amorVerses } from "./amor"
import { solidaoVerses } from "./solidao"
import { gratidaoVerses } from "./gratidao"

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
  fe: feVerses,
  esperanca: esperancaVerses,
  medo: medoVerses,
  amor: amorVerses,
  solidao: solidaoVerses,
  gratidao: gratidaoVerses,
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

// Função para buscar versículos aleatórios de todos os temas combinados
export function getAllVerses(): Verse[] {
  const allVerses: Verse[] = []
  Object.values(versesDatabase).forEach((themeVerses) => {
    allVerses.push(...themeVerses)
  })
  return allVerses
}

// Função para buscar versículos aleatórios de toda a base de dados
export function getRandomVersesFromAll(count = 3): Verse[] {
  const allVerses = getAllVerses()
  const shuffled = [...allVerses].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(count, shuffled.length))
}
