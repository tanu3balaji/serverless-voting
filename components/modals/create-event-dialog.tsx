"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useEvents, type EventItem } from "../events-provider"
import { motion } from "framer-motion"
import { Trash2, PencilLine, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "../auth-provider"

type Mode = "create" | "edit" | "delete"

export function CreateEventDialog(props: { mode?: Mode; event?: EventItem }) {
  const mode = props.mode ?? "create"
  if (mode === "delete") return <DeleteEvent event={props.event!} />
  if (mode === "edit") return <EditEvent event={props.event!} />
  return <CreateEventFab />
}

function CreateEventFab() {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [options, setOptions] = useState<string[]>(["", ""])
  const [errors, setErrors] = useState<{ title?: string; options?: string } | null>(null)

  const canSubmit = useMemo(
    () => title.trim().length > 0 && options.map((o) => o.trim()).filter(Boolean).length >= 2,
    [title, options],
  )

  const { createEvent } = useEvents()
  const { user, signInWithGoogle } = useAuth()
  const { toast } = useToast()

  function addOption() {
    setOptions((prev) => [...prev, ""])
  }
  function updateOption(idx: number, val: string) {
    setOptions((prev) => prev.map((o, i) => (i === idx ? val : o)))
  }
  function removeOption(idx: number) {
    setOptions((prev) => prev.filter((_, i) => i !== idx))
  }

  function validate() {
    const next: { title?: string; options?: string } = {}
    if (!title.trim()) next.title = "Title is required"
    const filled = options.map((o) => o.trim()).filter(Boolean)
    if (filled.length < 2) next.options = "Enter at least 2 options"
    setErrors(Object.keys(next).length ? next : null)
    return Object.keys(next).length === 0
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Button className="rounded-full shadow-lg" size="lg">
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="rounded-2xl p-0 overflow-hidden">
        <motion.div
          key={open ? "open" : "closed"}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.18 }}
          className="p-6"
        >
          <DialogHeader>
            <DialogTitle>Create a new event</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                className="rounded-xl"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                aria-invalid={!!errors?.title}
              />
              {errors?.title ? <p className="text-xs text-destructive">{errors.title}</p> : null}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="desc">Description</Label>
              <Textarea
                id="desc"
                className="rounded-xl"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Brief context for the event..."
              />
            </div>
            <div className="grid gap-2">
              <Label>Options</Label>
              <div className="grid gap-2">
                {options.map((opt, idx) => (
                  <motion.div
                    key={idx}
                    layout
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="flex items-center gap-2"
                  >
                    <Input
                      className="rounded-xl"
                      value={opt}
                      onChange={(e) => updateOption(idx, e.target.value)}
                      placeholder={`Option ${idx + 1}`}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-xl bg-transparent"
                      onClick={() => removeOption(idx)}
                      disabled={options.length <= 2}
                      aria-label={`Remove option ${idx + 1}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ))}
              </div>
              {errors?.options ? <p className="text-xs text-destructive">{errors.options}</p> : null}
              <div>
                <Button type="button" variant="ghost" className="rounded-xl" onClick={addOption}>
                  Add option
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button
              className="rounded-xl"
              disabled={!canSubmit}
              onClick={() => {
                if (!user) {
                  toast({ title: "Please sign in to create events" })
                  signInWithGoogle()
                  return
                }
                if (!validate()) return
                const opts = options.map((o) => o.trim()).filter(Boolean)
                createEvent({ title: title.trim(), description: description.trim(), options: opts })
                toast({ title: "Event created successfully" })
                setOpen(false)
                setTitle("")
                setDescription("")
                setOptions(["", ""])
                setErrors(null)
              }}
            >
              Create
            </Button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}

function EditEvent({ event }: { event: EventItem }) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState(event.title)
  const [description, setDescription] = useState(event.description)
  const [options, setOptions] = useState<string[]>(event.options.map((o) => o.label))
  const { updateEvent } = useEvents()

  const canSubmit = useMemo(
    () => title.trim().length > 2 && options.filter((o) => o.trim()).length >= 2,
    [title, options],
  )

  function addOption() {
    setOptions((prev) => [...prev, `Option ${prev.length + 1}`])
  }
  function updateOption(idx: number, val: string) {
    setOptions((prev) => prev.map((o, i) => (i === idx ? val : o)))
  }
  function removeOption(idx: number) {
    setOptions((prev) => prev.filter((_, i) => i !== idx))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="rounded-xl">
          <PencilLine className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle>Edit event</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" className="rounded-xl" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="desc">Description</Label>
            <Textarea
              id="desc"
              className="min-h-24 rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Brief context for the event..."
            />
          </div>
          <div className="grid gap-2">
            <Label>Options</Label>
            <div className="grid gap-2">
              {options.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Input
                    className="rounded-xl"
                    value={opt}
                    onChange={(e) => updateOption(idx, e.target.value)}
                    placeholder={`Option ${idx + 1}`}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-xl bg-transparent"
                    onClick={() => removeOption(idx)}
                    disabled={options.length <= 2}
                    aria-label={`Remove option ${idx + 1}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <div>
              <Button variant="ghost" className="rounded-xl" onClick={addOption}>
                Add option
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            className="rounded-xl"
            disabled={!canSubmit}
            onClick={() => {
              const opts = options.map((o) => o.trim()).filter(Boolean)
              updateEvent(event.id, { title, description, options: opts })
              setOpen(false)
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function DeleteEvent({ event }: { event: EventItem }) {
  const [open, setOpen] = useState(false)
  const { deleteEvent } = useEvents()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="rounded-xl">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle>Delete event</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Are you sure you want to delete “{event.title}”? This action cannot be undone.
        </p>
        <DialogFooter>
          <Button variant="outline" className="rounded-xl bg-transparent" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="rounded-xl"
            onClick={() => {
              deleteEvent(event.id)
              setOpen(false)
            }}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
