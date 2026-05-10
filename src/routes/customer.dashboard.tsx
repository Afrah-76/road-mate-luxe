import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { Star, MapPin, Phone } from "lucide-react";

export const Route = createFileRoute("/customer/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Road Mate Tours" }] }),
  component: CustomerDashboard,
});

interface Driver {
  id: string; full_name: string; age: number; contact: string;
  profile_picture_url: string | null; places_driven: string[];
  availability: boolean; rating: number;
}

function CustomerDashboard() {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [profile, setProfile] = useState<{ full_name: string } | null>(null);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [search] = useState<URLSearchParams>(typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams());
  const prefilledDriver = search.get("driver");
  const prefilledDriverName = search.get("driverName");

  const [form, setForm] = useState({
    full_name: "", people_count: "1", car_type: "Sedan",
    pickup_location: "", pickup_time: "",
    drop_location: "", drop_date: "", drop_time: "",
    start_date: "", start_time: "", days_count: "1",
  });

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate({ to: "/login" }); return; }
    if (role === "driver") { navigate({ to: "/driver/dashboard" }); return; }

    (async () => {
      const { data: c } = await supabase.from("customers").select("id, full_name").eq("user_id", user.id).maybeSingle();
      if (c) {
        setCustomerId(c.id);
        setProfile({ full_name: c.full_name });
        setForm((f) => ({ ...f, full_name: c.full_name }));
      }
      const { data: d } = await supabase.from("drivers").select("id, full_name, age, contact, profile_picture_url, places_driven, availability, rating").order("rating", { ascending: false });
      setDrivers((d ?? []) as Driver[]);
    })();
  }, [loading, user, role, navigate]);

  const submitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId) return;
    const { error } = await supabase.from("bookings").insert({
      customer_id: customerId,
      full_name: form.full_name,
      people_count: parseInt(form.people_count),
      car_type: form.car_type,
      pickup_location: form.pickup_location,
      pickup_time: form.pickup_time,
      drop_location: form.drop_location,
      drop_date: form.drop_date,
      drop_time: form.drop_time,
      start_date: form.start_date,
      start_time: form.start_time,
      days_count: parseInt(form.days_count),
      driver_id: prefilledDriver || null,
    });
    if (error) toast.error(error.message);
    else toast.success("Booking confirmed! We'll be in touch shortly.");
  };

  if (loading || !user) return <div className="min-h-screen"><SiteHeader /><div className="text-center py-32 text-foreground/60">Loading…</div></div>;

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-6 py-12 fade-up">
        <p className="text-gold/80 tracking-[0.3em] text-xs uppercase mb-2">Welcome back</p>
        <h1 className="font-display text-4xl md:text-5xl mb-8">Hello, {profile?.full_name?.split(" ")[0] ?? "traveller"}</h1>

        <Tabs defaultValue={prefilledDriver ? "book" : "drivers"} className="w-full">
          <TabsList className="bg-secondary mb-6">
            <TabsTrigger value="book">Book a Trip</TabsTrigger>
            <TabsTrigger value="drivers">Available Drivers</TabsTrigger>
          </TabsList>

          <TabsContent value="book">
            <form onSubmit={submitBooking} className="glass-card rounded-2xl p-8 space-y-5">
              {prefilledDriverName && (
                <div className="text-sm text-gold border border-gold/30 rounded-lg px-4 py-3 bg-gold/5">
                  Booking with driver: <strong>{prefilledDriverName}</strong>
                </div>
              )}
              <div className="grid md:grid-cols-2 gap-4">
                <div><Label>Full name</Label><Input required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} /></div>
                <div><Label>People travelling</Label><Input type="number" min="1" required value={form.people_count} onChange={(e) => setForm({ ...form, people_count: e.target.value })} /></div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Car type</Label>
                  <Select value={form.car_type} onValueChange={(v) => setForm({ ...form, car_type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sedan">Sedan</SelectItem>
                      <SelectItem value="SUV">SUV</SelectItem>
                      <SelectItem value="Tempo Traveller">Tempo Traveller</SelectItem>
                      <SelectItem value="Luxury Van">Luxury Van</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Number of days</Label><Input type="number" min="1" required value={form.days_count} onChange={(e) => setForm({ ...form, days_count: e.target.value })} /></div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div><Label>Pickup location</Label><Input required value={form.pickup_location} onChange={(e) => setForm({ ...form, pickup_location: e.target.value })} /></div>
                <div><Label>Pickup time</Label><Input type="time" required value={form.pickup_time} onChange={(e) => setForm({ ...form, pickup_time: e.target.value })} /></div>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div><Label>Drop location</Label><Input required value={form.drop_location} onChange={(e) => setForm({ ...form, drop_location: e.target.value })} /></div>
                <div><Label>Drop date</Label><Input type="date" required value={form.drop_date} onChange={(e) => setForm({ ...form, drop_date: e.target.value })} /></div>
                <div><Label>Drop time</Label><Input type="time" required value={form.drop_time} onChange={(e) => setForm({ ...form, drop_time: e.target.value })} /></div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div><Label>Journey start date</Label><Input type="date" required value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} /></div>
                <div><Label>Journey start time</Label><Input type="time" required value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })} /></div>
              </div>
              <Button type="submit" className="w-full bg-gold text-primary-foreground hover:bg-gold-soft gold-glow">Confirm Booking</Button>
            </form>
          </TabsContent>

          <TabsContent value="drivers">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {drivers.length === 0 && <p className="text-foreground/60 col-span-full text-center py-12">No drivers registered yet.</p>}
              {drivers.map((d) => (
                <Link key={d.id} to="/drivers/$id" params={{ id: d.id }} className="group glass-card rounded-xl p-6 hover:gold-glow transition-all">
                  <div className="flex items-center gap-4 mb-4">
                    {d.profile_picture_url ? (
                      <img src={d.profile_picture_url} alt={d.full_name} className="h-16 w-16 rounded-full object-cover border-2 border-gold/30" />
                    ) : (
                      <div className="h-16 w-16 rounded-full bg-gold/10 border-2 border-gold/30 flex items-center justify-center text-gold font-display text-xl">
                        {d.full_name.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="font-display text-lg">{d.full_name}</div>
                      <div className="text-xs text-foreground/60">Age {d.age}</div>
                      <div className="flex items-center gap-1 text-gold text-sm mt-1">
                        <Star className="h-3 w-3 fill-gold" /> {Number(d.rating).toFixed(1)}
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${d.availability ? "bg-green-500/15 text-green-400 border border-green-500/30" : "bg-red-500/15 text-red-400 border border-red-500/30"}`}>
                      {d.availability ? "Available" : "Busy"}
                    </span>
                  </div>
                  <div className="text-xs text-foreground/60 flex items-center gap-1 mb-2"><Phone className="h-3 w-3" /> {d.contact}</div>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {d.places_driven.slice(0, 4).map((p) => (
                      <span key={p} className="text-xs px-2 py-0.5 rounded-full bg-gold/10 text-gold/90 border border-gold/20"><MapPin className="inline h-3 w-3 mr-1" />{p}</span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
