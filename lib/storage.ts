export const STORAGE_KEYS = {
  USER: "arc360_user",
  TASKS: "arc360_tasks",
  HABITS: "arc360_habits",
  PROJECTS: "arc360_projects",
  TRANSACTIONS: "arc360_transactions",
  REMINDERS: "arc360_reminders",
  NOTES: "arc360_notes",
  JOURNAL: "arc360_journal",
  GOALS: "arc360_goals",
  INSIGHTS: "arc360_insights",
  READINGS: "arc360_readings",
  NOTIFICATIONS: "arc360_notifications",
} as const

// Cache em memória para evitar múltiplas leituras do localStorage
const cache: Record<string, any> = {}

export const storage = {
  get<T>(key: string, defaultValue: T): T {
    // Retorna do cache se disponível
    if (cache[key] !== undefined) {
      return cache[key]
    }

    // Lê do localStorage
    try {
      const item = localStorage.getItem(key)
      if (item === null) {
        cache[key] = defaultValue
        return defaultValue
      }

      const parsed = JSON.parse(item)
      cache[key] = parsed
      return parsed
    } catch (error) {
      console.error(`[Storage] Error reading ${key}:`, error)
      cache[key] = defaultValue
      return defaultValue
    }
  },

  set<T>(key: string, value: T): void {
    try {
      // Atualiza cache
      cache[key] = value

      // Salva no localStorage
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`[Storage] Error writing ${key}:`, error)
    }
  },

  remove(key: string): void {
    delete cache[key]
    localStorage.removeItem(key)
  },

  clear(): void {
    Object.keys(cache).forEach((key) => delete cache[key])
    localStorage.clear()
  },

  // Invalida cache para forçar nova leitura
  invalidate(key: string): void {
    delete cache[key]
  },
}
