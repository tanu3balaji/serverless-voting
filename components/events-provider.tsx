"use client"

import type React from "react"
import { createContext, useCallback, useContext, useMemo, useState, useEffect } from "react"
import { useAuth } from "./auth-provider"
import { nanoid } from "nanoid"

export type EventOption = {
  id: string
  label: string
  votes: number
}

export type EventItem = {
  id: string
  title: string
  description: string
  options: EventOption[]
  createdAt: string
  createdBy: {
    name: string
    email: string
    image: string
  }
  // userEmail -> optionId
  votesBy: Record<string, string>
}

type EventsContextType = {
  events: EventItem[]
  createEvent: (payload: { title: string; description: string; options: string[] }) => void
  updateEvent: (id: string, payload: { title: string; description: string; options: string[] }) => void
  deleteEvent: (id: string) => void
  vote: (eventId: string, optionId: string) => void
}

const EventsContext = createContext<EventsContextType | undefined>(undefined)

const STORAGE_KEY = "campuscast_shared_events"

function loadEventsFromStorage(): EventItem[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveEventsToStorage(events: EventItem[]) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
  } catch (error) {
    console.error("Failed to save events to storage:", error)
  }
}

function makeSeed(userEmail: string | undefined): EventItem[] {
  return []
}

export function EventsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [events, setEvents] = useState<EventItem[]>(() => loadEventsFromStorage())

  useEffect(() => {
    const storedEvents = loadEventsFromStorage()
    setEvents(storedEvents)
  }, [])

  useEffect(() => {
    saveEventsToStorage(events)
  }, [events])

  const createEvent: EventsContextType["createEvent"] = useCallback(
    ({ title, description, options }) => {
      if (!user) return
      const ev: EventItem = {
        id: nanoid(),
        title: title.trim(),
        description: description.trim(),
        options: options.map((o) => ({ id: nanoid(), label: o.trim(), votes: 0 })),
        createdAt: new Date().toISOString(),
        createdBy: { name: user.name, email: user.email, image: user.image },
        votesBy: {},
      }
      setEvents((prev) => [ev, ...prev])
    },
    [user],
  )

  const updateEvent: EventsContextType["updateEvent"] = useCallback((id, { title, description, options }) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              title: title.trim(),
              description: description.trim(),
              options: options.map((label, idx) => {
                const existing = e.options[idx]
                return {
                  id: existing ? existing.id : nanoid(),
                  label: label.trim(),
                  votes: existing ? existing.votes : 0,
                }
              }),
            }
          : e,
      ),
    )
  }, [])

  const deleteEvent: EventsContextType["deleteEvent"] = useCallback((id) => {
    setEvents((prev) => prev.filter((e) => e.id !== id))
  }, [])

  const vote: EventsContextType["vote"] = useCallback(
    (eventId, optionId) => {
      if (!user) return
      setEvents((prev) =>
        prev.map((e) => {
          if (e.id !== eventId) return e
          if (e.createdBy.email === user.email) return e
          const previous = e.votesBy[user.email]
          if (previous) return e
          return {
            ...e,
            votesBy: { ...e.votesBy, [user.email]: optionId },
            options: e.options.map((opt) => (opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt)),
          }
        }),
      )
    },
    [user],
  )

  const value = useMemo(
    () => ({
      events,
      createEvent,
      updateEvent,
      deleteEvent,
      vote,
    }),
    [events, createEvent, updateEvent, deleteEvent, vote],
  )

  return <EventsContext.Provider value={value}>{children}</EventsContext.Provider>
}

export function useEvents() {
  const ctx = useContext(EventsContext)
  if (!ctx) throw new Error("useEvents must be used within EventsProvider")
  return ctx
}
