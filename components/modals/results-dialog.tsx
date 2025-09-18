"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import type { EventItem } from "../events-provider"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { useMemo, useState } from "react"

export function ResultsDialog({ event }: { event: EventItem }) {
  const [open, setOpen] = useState(false)
  const data = useMemo(() => event.options.map((o) => ({ name: o.label, votes: o.votes })), [event.options])
  const total = event.options.reduce((a, b) => a + b.votes, 0)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl" variant="secondary">
          View Results
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle>Results — {event.title}</DialogTitle>
        </DialogHeader>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar
                dataKey="votes"
                fill="hsl(var(--primary))"
                radius={[8, 8, 0, 0]}
                isAnimationActive
                animationDuration={500}
              />
            </BarChart>
          </ResponsiveContainer>
          <p className="mt-3 text-center text-xs text-muted-foreground">Total votes: {total}</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
