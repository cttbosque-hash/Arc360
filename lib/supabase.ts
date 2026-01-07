import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export type Task = {
  id: string
  user_id: string
  title: string
  description?: string
  status: "todo" | "doing" | "done"
  priority: "high" | "medium" | "low"
  category?: string
  due_date?: string
  is_favorite: boolean
  subtasks?: { id: string; title: string; completed: boolean }[]
  created_at: string
  updated_at: string
}

export type Habit = {
  id: string
  user_id: string
  name: string
  icon: string
  category: string
  frequency: string
  goal: number
  completed_dates: string[]
  streak: number
  created_at: string
  updated_at: string
}

export type Project = {
  id: string
  user_id: string
  name: string
  description?: string
  status: string
  priority: string
  budget?: number
  category?: string
  tasks?: any[]
  notes?: string
  created_at: string
  updated_at: string
}

export type Reminder = {
  id: string
  user_id: string
  title: string
  description?: string
  category: string
  date: string
  time?: string
  priority: string
  location_enabled: boolean
  created_at: string
  updated_at: string
}

export type Transaction = {
  id: string
  user_id: string
  type: "income" | "expense"
  description: string
  amount: number
  category: string
  date: string
  created_at: string
  updated_at: string
}

export type Subscription = {
  id: string
  user_id: string
  name: string
  amount: number
  category: string
  icon: string
  frequency: string
  next_payment: string
  created_at: string
  updated_at: string
}

export type JournalEntry = {
  id: string
  user_id: string
  date: string
  mood: string
  title?: string
  content: string
  images?: string[]
  created_at: string
  updated_at: string
}

export type BrainDump = {
  id: string
  user_id: string
  content: string
  category?: string
  created_at: string
  updated_at: string
}

export type User = {
  id: string
  email: string
  full_name: string
  nickname?: string
  plan: "free" | "monthly" | "annual"
  created_at: string
  updated_at: string
}
