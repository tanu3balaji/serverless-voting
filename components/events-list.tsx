"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "./auth-provider"
import { useEvents, type EventItem } from "./events-provider"
import { CreateEventDialog } from "./modals/create-event-dialog"
import { ResultsDialog } from "./modals/results-dialog"

type Props = {
  filter: "all" | "mine"
}

export function EventsList({ filter }: Props) {
  const { user } = useAuth()
  const { events } = useEvents()
  const filtered = events.filter((e) => (filter === "mine" ? e.createdBy.email === user?.email : true))

  return (
    <div className="relative">
      <div className="grid grid-cols-1 gap-4 md:gap-6">
        {filtered.map((event, idx) => (
          <EventCard key={event.id} event={event} index={idx} />
        ))}
        {filtered.length === 0 && (
          <Card className="rounded-2xl p-6 text-center text-sm text-muted-foreground">No events yet.</Card>
        )}
      </div>

      <div className="fixed bottom-5 right-5 md:bottom-8 md:right-8">
        <CreateEventDialog />
      </div>
    </div>
  )
}

function EventCard({ event, index }: { event: EventItem; index: number }) {
  const { user } = useAuth()
  const isOwner = user?.email === event.createdBy.email
  const { vote } = useEvents()
  const hasVoted = !!(user && event.votesBy[user.email])

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
    >
      <Card className="rounded-2xl shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle className="text-lg">{event.title}</CardTitle>
              <CardDescription className="mt-1">{event.description}</CardDescription>
            </div>
            <span className="rounded-full border bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
              by {event.createdBy.name}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 gap-2">
            {event.options.map((opt) => {
              const disabled = hasVoted || isOwner
              const buttonText = isOwner ? "Your Event" : hasVoted ? "Voted" : "Vote"

              return (
                <motion.div key={opt.id} whileTap={{ scale: disabled ? 1 : 0.98 }}>
                  <Button
                    variant="outline"
                    className="w-full justify-between rounded-xl bg-transparent"
                    disabled={disabled}
                    onClick={() => vote(event.id, opt.id)}
                  >
                    <span>{opt.label}</span>
                    <span className="text-muted-foreground text-xs">{buttonText}</span>
                  </Button>
                </motion.div>
              )
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <ResultsDialog event={event} />
            {isOwner && (
              <>
                <CreateEventDialog mode="edit" event={event} />
                <CreateEventDialog mode="delete" event={event} />
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
