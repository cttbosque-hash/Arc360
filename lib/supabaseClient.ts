import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://kljjxnkhgyzydomfgfnx.supabase.co"
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtsamp4bmtoZ3l6eWRvbWZnZm54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2MzQ0NzcsImV4cCI6MjA4MzIxMDQ3N30.hI5_4Y19XaeIK45hR9OvVjWRZF1Gw74QxYC8m41w7Zc"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function signUp(email: string, password: string, fullName: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })

  if (error) throw error
  return data
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

// Tasks
export async function getTasks(userId: string) {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function createTask(userId: string, task: any) {
  const { data, error } = await supabase
    .from("tasks")
    .insert([{ ...task, user_id: userId }])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateTask(taskId: string, updates: any) {
  const { data, error } = await supabase.from("tasks").update(updates).eq("id", taskId).select().single()

  if (error) throw error
  return data
}

export async function deleteTask(taskId: string) {
  const { error } = await supabase.from("tasks").delete().eq("id", taskId)

  if (error) throw error
}

// Projects
export async function getProjects(userId: string) {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function createProject(userId: string, project: any) {
  const { data, error } = await supabase
    .from("projects")
    .insert([{ ...project, user_id: userId }])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateProject(projectId: string, updates: any) {
  const { data, error } = await supabase.from("projects").update(updates).eq("id", projectId).select().single()

  if (error) throw error
  return data
}

export async function deleteProject(projectId: string) {
  const { error } = await supabase.from("projects").delete().eq("id", projectId)

  if (error) throw error
}

// Habits
export async function getHabits(userId: string) {
  const { data, error } = await supabase
    .from("habits")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function createHabit(userId: string, habit: any) {
  const { data, error } = await supabase
    .from("habits")
    .insert([{ ...habit, user_id: userId }])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateHabit(habitId: string, updates: any) {
  const { data, error } = await supabase.from("habits").update(updates).eq("id", habitId).select().single()

  if (error) throw error
  return data
}

export async function deleteHabit(habitId: string) {
  const { error } = await supabase.from("habits").delete().eq("id", habitId)

  if (error) throw error
}

// Finances (transactions + subscriptions)
export async function getTransactions(userId: string) {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false })

  if (error) throw error
  return data || []
}

export async function createTransaction(userId: string, transaction: any) {
  const { data, error } = await supabase
    .from("transactions")
    .insert([{ ...transaction, user_id: userId }])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getSubscriptions(userId: string) {
  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function createSubscription(userId: string, subscription: any) {
  const { data, error } = await supabase
    .from("subscriptions")
    .insert([{ ...subscription, user_id: userId }])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateSubscription(subscriptionId: string, updates: any) {
  const { data, error } = await supabase
    .from("subscriptions")
    .update(updates)
    .eq("id", subscriptionId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteSubscription(subscriptionId: string) {
  const { error } = await supabase.from("subscriptions").delete().eq("id", subscriptionId)

  if (error) throw error
}

// Journal
export async function getJournalEntries(userId: string) {
  const { data, error } = await supabase
    .from("journal_entries")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false })

  if (error) throw error
  return data || []
}

export async function createJournalEntry(userId: string, entry: any) {
  const { data, error } = await supabase
    .from("journal_entries")
    .insert([{ ...entry, user_id: userId }])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateJournalEntry(entryId: string, updates: any) {
  const { data, error } = await supabase.from("journal_entries").update(updates).eq("id", entryId).select().single()

  if (error) throw error
  return data
}

export async function deleteJournalEntry(entryId: string) {
  const { error } = await supabase.from("journal_entries").delete().eq("id", entryId)

  if (error) throw error
}

// Brain Dump (notes)
export async function getBrainDumps(userId: string) {
  const { data, error } = await supabase
    .from("brain_dump")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function createBrainDump(userId: string, note: any) {
  const { data, error } = await supabase
    .from("brain_dump")
    .insert([{ ...note, user_id: userId }])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteBrainDump(noteId: string) {
  const { error } = await supabase.from("brain_dump").delete().eq("id", noteId)

  if (error) throw error
}

// Reminders
export async function getReminders(userId: string) {
  const { data, error } = await supabase
    .from("reminders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function createReminder(userId: string, reminder: any) {
  const { data, error } = await supabase
    .from("reminders")
    .insert([{ ...reminder, user_id: userId }])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateReminder(reminderId: string, updates: any) {
  const { data, error } = await supabase.from("reminders").update(updates).eq("id", reminderId).select().single()

  if (error) throw error
  return data
}

export async function deleteReminder(reminderId: string) {
  const { error } = await supabase.from("reminders").delete().eq("id", reminderId)

  if (error) throw error
}
