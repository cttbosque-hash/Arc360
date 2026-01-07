"use client"

import { getSupabaseBrowserClient } from "./supabase-client"
import type { Task, Habit, Project, Reminder, Transaction, Subscription, JournalEntry, BrainDump } from "./supabase"

const supabase = getSupabaseBrowserClient()

// TASKS
export async function getTasks(userId: string) {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function createTask(userId: string, task: Partial<Task>) {
  const { data, error } = await supabase
    .from("tasks")
    .insert([{ ...task, user_id: userId }])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateTask(id: string, updates: Partial<Task>) {
  const { data, error } = await supabase.from("tasks").update(updates).eq("id", id).select().single()

  if (error) throw error
  return data
}

export async function deleteTask(id: string) {
  const { error } = await supabase.from("tasks").delete().eq("id", id)

  if (error) throw error
}

// HABITS
export async function getHabits(userId: string) {
  const { data, error } = await supabase
    .from("habits")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function createHabit(userId: string, habit: Partial<Habit>) {
  const { data, error } = await supabase
    .from("habits")
    .insert([{ ...habit, user_id: userId }])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateHabit(id: string, updates: Partial<Habit>) {
  const { data, error } = await supabase.from("habits").update(updates).eq("id", id).select().single()

  if (error) throw error
  return data
}

export async function deleteHabit(id: string) {
  const { error } = await supabase.from("habits").delete().eq("id", id)

  if (error) throw error
}

// PROJECTS
export async function getProjects(userId: string) {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function createProject(userId: string, project: Partial<Project>) {
  const { data, error } = await supabase
    .from("projects")
    .insert([{ ...project, user_id: userId }])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateProject(id: string, updates: Partial<Project>) {
  const { data, error } = await supabase.from("projects").update(updates).eq("id", id).select().single()

  if (error) throw error
  return data
}

export async function deleteProject(id: string) {
  const { error } = await supabase.from("projects").delete().eq("id", id)

  if (error) throw error
}

// REMINDERS
export async function getReminders(userId: string) {
  const { data, error } = await supabase
    .from("reminders")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: true })

  if (error) throw error
  return data || []
}

export async function createReminder(userId: string, reminder: Partial<Reminder>) {
  const { data, error } = await supabase
    .from("reminders")
    .insert([{ ...reminder, user_id: userId }])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateReminder(id: string, updates: Partial<Reminder>) {
  const { data, error } = await supabase.from("reminders").update(updates).eq("id", id).select().single()

  if (error) throw error
  return data
}

export async function deleteReminder(id: string) {
  const { error } = await supabase.from("reminders").delete().eq("id", id)

  if (error) throw error
}

// TRANSACTIONS
export async function getTransactions(userId: string) {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false })

  if (error) throw error
  return data || []
}

export async function createTransaction(userId: string, transaction: Partial<Transaction>) {
  const { data, error } = await supabase
    .from("transactions")
    .insert([{ ...transaction, user_id: userId }])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateTransaction(id: string, updates: Partial<Transaction>) {
  const { data, error } = await supabase.from("transactions").update(updates).eq("id", id).select().single()

  if (error) throw error
  return data
}

export async function deleteTransaction(id: string) {
  const { error } = await supabase.from("transactions").delete().eq("id", id)

  if (error) throw error
}

// SUBSCRIPTIONS
export async function getSubscriptions(userId: string) {
  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .order("next_payment", { ascending: true })

  if (error) throw error
  return data || []
}

export async function createSubscription(userId: string, subscription: Partial<Subscription>) {
  const { data, error } = await supabase
    .from("subscriptions")
    .insert([{ ...subscription, user_id: userId }])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateSubscription(id: string, updates: Partial<Subscription>) {
  const { data, error } = await supabase.from("subscriptions").update(updates).eq("id", id).select().single()

  if (error) throw error
  return data
}

export async function deleteSubscription(id: string) {
  const { error } = await supabase.from("subscriptions").delete().eq("id", id)

  if (error) throw error
}

// JOURNAL ENTRIES
export async function getJournalEntries(userId: string) {
  const { data, error } = await supabase
    .from("journal_entries")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false })

  if (error) throw error
  return data || []
}

export async function createJournalEntry(userId: string, entry: Partial<JournalEntry>) {
  const { data, error } = await supabase
    .from("journal_entries")
    .insert([{ ...entry, user_id: userId }])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateJournalEntry(id: string, updates: Partial<JournalEntry>) {
  const { data, error } = await supabase.from("journal_entries").update(updates).eq("id", id).select().single()

  if (error) throw error
  return data
}

export async function deleteJournalEntry(id: string) {
  const { error } = await supabase.from("journal_entries").delete().eq("id", id)

  if (error) throw error
}

// BRAIN DUMP
export async function getBrainDumps(userId: string) {
  const { data, error } = await supabase
    .from("brain_dump")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function createBrainDump(userId: string, dump: Partial<BrainDump>) {
  const { data, error } = await supabase
    .from("brain_dump")
    .insert([{ ...dump, user_id: userId }])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateBrainDump(id: string, updates: Partial<BrainDump>) {
  const { data, error } = await supabase.from("brain_dump").update(updates).eq("id", id).select().single()

  if (error) throw error
  return data
}

export async function deleteBrainDump(id: string) {
  const { error } = await supabase.from("brain_dump").delete().eq("id", id)

  if (error) throw error
}
