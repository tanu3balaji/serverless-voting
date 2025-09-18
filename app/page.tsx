"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { AuthProvider, useAuth } from "@/components/auth-provider"
import { EventsProvider } from "@/components/events-provider"
import { Navbar } from "@/components/navbar"
import { EventsList } from "@/components/events-list"
import { ProfileCard } from "@/components/profile-card"
import { Button } from "@/components/ui/button"
import { CheckSquare, Activity, Users, Calendar } from "lucide-react"

export default function Page() {
  return (
    <AuthProvider>
      <AppGate />
    </AuthProvider>
  )
}

function AppGate() {
  const { user } = useAuth()

  return (
    <div className="min-h-dvh bg-background text-foreground font-sans">
      <Navbar />
      <main className="mx-auto w-full max-w-4xl p-4 md:p-6">
        {!user ? (
          <Landing />
        ) : (
          <EventsProvider>
            <AppTabs />
          </EventsProvider>
        )}
      </main>
    </div>
  )
}

function Landing() {
  const { signIn } = useAuth()

  return (
    <div className="space-y-10">
      {/* Hero */}
      <header className="text-center space-y-3">
        <h1 className="text-balance text-3xl md:text-4xl font-semibold">CampusCast Voting App</h1>
        <p className="text-pretty text-muted-foreground max-w-2xl mx-auto">
          Create and participate in campus voting events. Make your voice heard in important decisions.
        </p>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button onClick={signIn}>View Events</Button>
          <Button variant="outline" onClick={signIn}>
            Sign In
          </Button>
        </div>
      </header>

      {/* Features: 2x2 grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="rounded-2xl p-5 md:p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 text-primary">
              <CheckSquare className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-medium">Easy Voting</h3>
              <p className="text-sm text-muted-foreground">
                Simple and intuitive voting interface for all campus events.
              </p>
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl p-5 md:p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 text-primary">
              <Activity className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-medium">Real-time Results</h3>
              <p className="text-sm text-muted-foreground">See voting results update in real time as votes are cast.</p>
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl p-5 md:p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 text-primary">
              <Users className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-medium">Community Driven</h3>
              <p className="text-sm text-muted-foreground">Create events and let the campus community decide.</p>
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl p-5 md:p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 text-primary">
              <Calendar className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-medium">Event Management</h3>
              <p className="text-sm text-muted-foreground">Manage events with deadlines and participant information.</p>
            </div>
          </div>
        </Card>
      </section>

      {/* Bottom CTA */}
      <section className="rounded-2xl border bg-card p-6 md:p-8">
        <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
          <h2 className="text-center md:text-left text-xl font-semibold">Ready to get started?</h2>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={signIn}>
              Browse Events
            </Button>
            <Button onClick={signIn}>Create Account</Button>
          </div>
        </div>
      </section>
    </div>
  )
}

function AppTabs() {
  const [tab, setTab] = useState<"events" | "my-events" | "profile">("events")

  return (
    <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="w-full">
      <TabsList className="sticky top-16 z-10 mx-auto mb-4 grid w-full grid-cols-3 rounded-2xl">
        <TabsTrigger value="events">Events</TabsTrigger>
        <TabsTrigger value="my-events">My Events</TabsTrigger>
        <TabsTrigger value="profile">Profile</TabsTrigger>
      </TabsList>

      <TabsContent value="events" className="mt-0">
        <EventsList filter="all" />
      </TabsContent>
      <TabsContent value="my-events" className="mt-0">
        <EventsList filter="mine" />
      </TabsContent>
      <TabsContent value="profile" className="mt-0">
        <ProfileCard />
      </TabsContent>
    </Tabs>
  )
}
