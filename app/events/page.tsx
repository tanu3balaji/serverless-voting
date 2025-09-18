"use client"

import { Navbar } from "@/components/navbar"
import { EventsList } from "@/components/events-list"

export default function EventsPage() {
  return (
    <div className="min-h-dvh">
      <Navbar />
      <main className="mx-auto w-full max-w-4xl px-4 py-8 md:py-10">
        <section className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-pretty">Events</h1>
          <p className="text-sm text-muted-foreground">
            Create and participate in campus voting events. Make your voice heard.
          </p>
        </section>

        <EventsList filter="all" />
      </main>
    </div>
  )
}
