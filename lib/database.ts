import { supabase } from "./supabase"

// Helper function to get current user
export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

// Tasks
export async function getTasks() {
  const user = await getCurrentUser()
  if (!user) return []

  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching tasks:", error)
    return []
  }
  return data
}

export async function createTask(task: Omit<any, "id" | "user_id" | "created_at" | "updated_at">) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Not authenticated")

  const { data, error } = await supabase
    .from("tasks")
    .insert({ ...task, user_id: user.id })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateTask(id: string, updates: Partial<any>) {
  const { data, error } = await supabase.from("tasks").update(updates).eq("id", id).select().single()

  if (error) throw error
  return data
}

export async function deleteTask(id: string) {
  const { error } = await supabase.from("tasks").delete().eq("id", id)

  if (error) throw error
}

// Habits
export async function getHabits() {
  const user = await getCurrentUser()
  if (!user) return []

  const { data, error } = await supabase
    .from("habits")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching habits:", error)
    return []
  }
  return data
}

export async function createHabit(habit: Omit<any, "id" | "user_id" | "created_at" | "updated_at">) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Not authenticated")

  const { data, error } = await supabase
    .from("habits")
    .insert({ ...habit, user_id: user.id })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateHabit(id: string, updates: Partial<any>) {
  const { data, error } = await supabase.from("habits").update(updates).eq("id", id).select().single()

  if (error) throw error
  return data
}

export async function deleteHabit(id: string) {
  const { error } = await supabase.from("habits").delete().eq("id", id)

  if (error) throw error
}

// Projects
export async function getProjects() {
  const user = await getCurrentUser()
  if (!user) return []

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching projects:", error)
    return []
  }
  return data
}

export async function createProject(project: Omit<any, "id" | "user_id" | "created_at" | "updated_at">) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Not authenticated")

  const { data, error } = await supabase
    .from("projects")
    .insert({ ...project, user_id: user.id })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateProject(id: string, updates: Partial<any>) {
  const { data, error } = await supabase.from("projects").update(updates).eq("id", id).select().single()

  if (error) throw error
  return data
}

export async function deleteProject(id: string) {
  const { error } = await supabase.from("projects").delete().eq("id", id)

  if (error) throw error
}

// Similar functions for Reminders, Transactions, Subscriptions, Journal Entries, and Brain Dumps
// (Following the same pattern as above)
