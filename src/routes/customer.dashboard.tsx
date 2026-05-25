import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { Star, MapPin, Phone, Car, CheckCircle2, Copy } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { sendBookingConfirmation } from "@/lib/notifications.functions";
import { StarRating } from "@/components/StarRating";

export const Route = createFileRoute("/customer/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Road Mate Tours" }] }),
  component: CustomerDashboard,
});

interface Driver {
  id: string; full_name: string; age: number; contact: string;
  profile_picture_url: string | null; places_driven: string[];
  availability: boolean; rating: number;
}

const CAR_OPTIONS = [
  { id: "Hatchback", label: "Hatchback", desc: "Compact city car" },
  { id: "Sedan", label: "Sedan", desc: "Comfortable saloon" },
  { id: "SUV", label: "SUV", desc: "Spacious & rugged" },
  { id: "Minivan", label: "Minivan", desc: "Group travel" },
];

const TAGS = ["On time", "Friendly driver", "Clean car", "Safe ride", "Good music", "Comfortable journey"];

function genCode() {
  return "RD-" + Math.random().toString(36).slice(2, 7).toUpperCase();
}

function CustomerDashboard() {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();
  const sendNotif = useServerFn(sendBookingConfirmation);

  const [customerId, setCustomerId] = useState<string | null>(null);
  const [profile, setProfile] = useState<{ full_name: string; email: string; mobile: string } | null>(null);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [confirmedBooking, setConfirmedBooking] = useState<any | null>(null);

  const search = useMemo<URLSearchParams>(() => typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams(), []);
  const prefilledDriver = search.get("driver");
  const prefilledDriverName = search.get("driverName");

  // Form state
  const [tripType, setTripType] = useState<"one_way" | "round_trip">("one_way");
  const [carMode, setCarMode] = useState<"rental" | "own">("rental");
  const [form, setForm] = useState({
    full_name: "", email: "", mobile: "",
    pickup_location: "", pickup_datetime: "",
    drop_location: "", drop_datetime: "",
    from_city: "", to_city: "", start_datetime: "",
    days_count: "1", people_count: "1",
    car_type: "Sedan",
    own_brand: "", own_reg: "", own_year: "", own_fuel: "Petrol", own_notes: "",
  });

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate({ to: "/login" }); return; }
    if (role === "driver") { navigate({ to: "/driver/dashboard" }); return; }

    (async () => {
      const { data: c } = await supabase.from("customers").select("id, full_name, email, mobile").eq("user_id", user.id).maybeSingle();
      if (c) {
        setCustomerId(c.id);
        setProfile({ full_name: c.full_name, email: c.email, mobile: c.mobile });
        setForm((f) => ({ ...f, full_name: c.full_name, email: c.email, mobile: c.mobile }));
      }
      const { data: d } = await supabase.from("drivers").select("id, full_name, age, contact, profile_picture_url, places_driven, availability, rating").order("rating", { ascending: false });
      setDrivers((d ?? []) as Driver[]);
    })();
  }, [loading, user, role, navigate]);

  // Poll for booking updates (realtime disabled for security)
  useEffect(() => {
    if (!customerId) return;
    loadBookings();
    const iv = setInterval(loadBookings, 15000);
    return () => clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId]);

  const loadBookings = async () => {
    if (!customerId) return;
    const { data } = await supabase.from("bookings")
      .select("*, drivers(full_name, contact, profile_picture_url, id)")
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false });
    setBookings(data ?? []);
  };

  const submitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId) return;

    const code = genCode();
    const payload: any = {
      customer_id: customerId,
      booking_code: code,
      status: "pending",
      full_name: form.full_name,
      email: form.email,
      mobile: form.mobile,
      people_count: parseInt(form.people_count) || 1,
      trip_type: tripType,
      car_type: carMode === "rental" ? form.car_type : "Own car",
      driver_id: prefilledDriver || null,
      // legacy required NOT NULLs in old schema (start_date kept NOT NULL)
      pickup_location: tripType === "one_way" ? form.pickup_location : form.from_city,
      pickup_time: tripType === "one_way" ? (form.pickup_datetime?.split("T")[1] ?? "") : (form.start_datetime?.split("T")[1] ?? ""),
      drop_time: tripType === "one_way" ? (form.drop_datetime?.split("T")[1] ?? "") : "",
      drop_date: tripType === "one_way" ? (form.drop_datetime?.split("T")[0] ?? null) : null,
      start_date: tripType === "round_trip" ? (form.start_datetime?.split("T")[0] ?? new Date().toISOString().split("T")[0]) : (form.pickup_datetime?.split("T")[0] ?? new Date().toISOString().split("T")[0]),
      days_count: tripType === "round_trip" ? parseInt(form.days_count) || 1 : 1,
    };

    if (tripType === "one_way") {
      payload.pickup_datetime = form.pickup_datetime || null;
      payload.drop_datetime = form.drop_datetime || null;
      payload.drop_location = form.drop_location;
    } else {
      payload.from_city = form.from_city;
      payload.to_city = form.to_city;
      payload.pickup_datetime = form.start_datetime || null;
      payload.drop_location = form.to_city;
    }

    if (carMode === "own") {
      payload.own_car_details = {
        brand_model: form.own_brand,
        registration: form.own_reg,
        year: parseInt(form.own_year) || null,
        fuel: form.own_fuel,
        notes: form.own_notes,
      };
      payload.special_instructions = form.own_notes;
    }

    const { data: inserted, error } = await supabase.from("bookings").insert(payload).select().single();
    if (error) { toast.error(error.message); return; }
    setConfirmedBooking(inserted);

    const summary = tripType === "one_way"
      ? `${payload.pickup_location} → ${payload.drop_location} · ${form.pickup_datetime}`
      : `${payload.from_city} → ${payload.to_city} · ${form.start_datetime} · ${payload.days_count} day(s)`;

    sendNotif({ data: {
      bookingCode: code,
      customerName: form.full_name,
      customerEmail: form.email,
      customerMobile: form.mobile,
      tripSummary: summary,
    }}).catch((e) => console.warn("notification dispatch failed", e));

    toast.success(`Booking ${code} confirmed!`);
    loadBookings();
  };

  if (loading || !user) return <div className="min-h-screen bg-background"><SiteHeader /><div className="text-center py-32 text-muted-foreground">Loading…</div></div>;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-6 py-12 fade-up">
        <p className="text-orange tracking-[0.3em] text-xs uppercase mb-2">Welcome back</p>
        <h1 className="font-display text-4xl md:text-5xl mb-8">Hello, {profile?.full_name?.split(" ")[0] ?? "traveller"}</h1>

        {confirmedBooking && (
          <BookingConfirmedCard b={confirmedBooking} onClose={() => setConfirmedBooking(null)} />
        )}

        <Tabs defaultValue={prefilledDriver ? "book" : "book"} className="w-full">
          <TabsList className="bg-secondary mb-6">
            <TabsTrigger value="book">Book a Trip</TabsTrigger>
            <TabsTrigger value="trips">My Trips</TabsTrigger>
            <TabsTrigger value="drivers">Drivers</TabsTrigger>
          </TabsList>

          <TabsContent value="book">
            <form onSubmit={submitBooking} className="brand-card p-6 md:p-8 space-y-8">
              {prefilledDriverName && (
                <div className="text-sm text-orange border border-orange rounded-lg px-4 py-3 bg-[#FFF4F0]">
                  Booking with driver: <strong>{prefilledDriverName}</strong>
                </div>
              )}

              {/* STEP 1 — Personal */}
              <div>
                <SectionTitle step={1} title="Personal Details" />
                <div className="grid md:grid-cols-3 gap-4">
                  <div><Label>Full name</Label><Input required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} /></div>
                  <div><Label>Email address</Label><Input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
                  <div><Label>Mobile number</Label><Input type="tel" required placeholder="+91 9876543210" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} /></div>
                </div>
              </div>

              {/* STEP 2 — Trip */}
              <div>
                <SectionTitle step={2} title="Trip Type" />
                <Toggle2
                  value={tripType}
                  onChange={(v) => setTripType(v as any)}
                  options={[{ id: "one_way", label: "One way" }, { id: "round_trip", label: "Round trip" }]}
                />
                <div className="grid md:grid-cols-2 gap-4 mt-5">
                  {tripType === "one_way" ? (
                    <>
                      <div><Label>Pickup location</Label><Input required value={form.pickup_location} onChange={(e) => setForm({ ...form, pickup_location: e.target.value })} /></div>
                      <div><Label>Pickup date & time</Label><Input type="datetime-local" required value={form.pickup_datetime} onChange={(e) => setForm({ ...form, pickup_datetime: e.target.value })} /></div>
                      <div><Label>Drop location</Label><Input required value={form.drop_location} onChange={(e) => setForm({ ...form, drop_location: e.target.value })} /></div>
                      <div><Label>Drop date & time</Label><Input type="datetime-local" required value={form.drop_datetime} onChange={(e) => setForm({ ...form, drop_datetime: e.target.value })} /></div>
                    </>
                  ) : (
                    <>
                      <div><Label>From (starting city)</Label><Input required value={form.from_city} onChange={(e) => setForm({ ...form, from_city: e.target.value })} /></div>
                      <div><Label>To (destination city)</Label><Input required value={form.to_city} onChange={(e) => setForm({ ...form, to_city: e.target.value })} /></div>
                      <div><Label>Start date & time</Label><Input type="datetime-local" required value={form.start_datetime} onChange={(e) => setForm({ ...form, start_datetime: e.target.value })} /></div>
                      <div><Label>Number of days</Label><Input type="number" min="1" required value={form.days_count} onChange={(e) => setForm({ ...form, days_count: e.target.value })} /></div>
                      <div><Label>Number of people</Label><Input type="number" min="1" max="12" required value={form.people_count} onChange={(e) => setForm({ ...form, people_count: e.target.value })} /></div>
                    </>
                  )}
                </div>
              </div>

              {/* STEP 3 — Car */}
              <div>
                <SectionTitle step={3} title="Car Type" />
                <Toggle2
                  value={carMode}
                  onChange={(v) => setCarMode(v as any)}
                  options={[{ id: "rental", label: "Rental car" }, { id: "own", label: "Own car" }]}
                />

                {carMode === "rental" ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
                    {CAR_OPTIONS.map((c) => {
                      const active = form.car_type === c.id;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setForm({ ...form, car_type: c.id })}
                          className={`text-left rounded-xl border p-4 transition ${active ? "bg-[#FFF4F0] border-orange text-orange" : "bg-white border-[color:var(--border)] hover:border-orange hover:bg-[#FFF4F0]"}`}
                        >
                          <Car className="h-6 w-6 mb-2" />
                          <div className="font-medium">{c.label}</div>
                          <div className={`text-xs ${active ? "text-orange/80" : "text-muted-foreground"}`}>{c.desc}</div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4 mt-5">
                    <div><Label>Car brand & model</Label><Input required placeholder="Maruti Suzuki Swift" value={form.own_brand} onChange={(e) => setForm({ ...form, own_brand: e.target.value })} /></div>
                    <div><Label>Registration number</Label><Input required placeholder="TN 01 AB 1234" value={form.own_reg} onChange={(e) => setForm({ ...form, own_reg: e.target.value })} /></div>
                    <div><Label>Year of manufacture</Label><Input type="number" min="1980" max={new Date().getFullYear()} required value={form.own_year} onChange={(e) => setForm({ ...form, own_year: e.target.value })} /></div>
                    <div>
                      <Label>Fuel type</Label>
                      <Select value={form.own_fuel} onValueChange={(v) => setForm({ ...form, own_fuel: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Petrol">Petrol</SelectItem>
                          <SelectItem value="Diesel">Diesel</SelectItem>
                          <SelectItem value="Electric">Electric</SelectItem>
                          <SelectItem value="CNG">CNG</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-2"><Label>Special instructions for driver</Label><Textarea placeholder="e.g. AC not working" value={form.own_notes} onChange={(e) => setForm({ ...form, own_notes: e.target.value })} /></div>
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full bg-orange text-white hover:bg-[oklch(0.76_0.15_38)] orange-glow text-base py-6">
                Confirm Booking
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="trips">
            <MyTrips bookings={bookings} customerId={customerId} onChange={loadBookings} />
          </TabsContent>

          <TabsContent value="drivers">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {drivers.length === 0 && <p className="text-muted-foreground col-span-full text-center py-12">No drivers registered yet.</p>}
              {drivers.map((d) => (
                <Link key={d.id} to="/drivers/$id" params={{ id: d.id }} className="group brand-card p-6 hover:border-orange hover:orange-glow transition-all">
                  <div className="flex items-center gap-4 mb-4">
                    {d.profile_picture_url ? (
                      <img src={d.profile_picture_url} alt={d.full_name} className="h-16 w-16 rounded-full object-cover border-2 border-orange/40" />
                    ) : (
                      <div className="h-16 w-16 rounded-full bg-[#FFF4F0] border-2 border-orange/40 flex items-center justify-center text-orange font-display text-xl">
                        {d.full_name.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="font-display text-lg">{d.full_name}</div>
                      <div className="text-xs text-muted-foreground">Age {d.age}</div>
                      <div className="flex items-center gap-1 text-orange text-sm mt-1">
                        <Star className="h-3 w-3 fill-orange" /> {Number(d.rating).toFixed(1)}
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${d.availability ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                      {d.availability ? "Available" : "Busy"}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1 mb-2"><Phone className="h-3 w-3" /> {d.contact}</div>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {d.places_driven.slice(0, 4).map((p) => (
                      <span key={p} className="text-xs px-2 py-0.5 rounded-full bg-[#FFF4F0] text-orange border border-orange/30"><MapPin className="inline h-3 w-3 mr-1" />{p}</span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>
      <SiteFooter />
    </div>
  );
}

function SectionTitle({ step, title }: { step: number; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-orange text-white text-sm font-medium">{step}</span>
      <h2 className="font-display text-xl">{title}</h2>
    </div>
  );
}

function Toggle2({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { id: string; label: string }[] }) {
  return (
    <div className="inline-flex rounded-lg bg-secondary p-1">
      {options.map((o) => (
        <button key={o.id} type="button" onClick={() => onChange(o.id)}
          className={`px-5 py-2 rounded-md text-sm transition ${value === o.id ? "bg-orange text-white" : "text-foreground/70 hover:text-orange"}`}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

function BookingConfirmedCard({ b, onClose }: { b: any; onClose: () => void }) {
  return (
    <div className="brand-card p-6 mb-8 border-orange bg-[#FFF4F0] orange-glow fade-up">
      <div className="flex items-start gap-4">
        <CheckCircle2 className="h-10 w-10 text-orange flex-shrink-0" />
        <div className="flex-1">
          <h3 className="font-display text-2xl mb-1">Booking confirmed!</h3>
          <p className="text-sm text-muted-foreground mb-3">Email & SMS sent to you. We'll notify you the moment a driver accepts.</p>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-muted-foreground">Booking ID</span>
            <span className="font-mono text-lg text-orange font-semibold">{b.booking_code}</span>
            <button onClick={() => { navigator.clipboard.writeText(b.booking_code); toast.success("Copied"); }} className="text-orange hover:opacity-70"><Copy className="h-4 w-4" /></button>
          </div>
          <Button size="sm" variant="outline" onClick={onClose} className="border-orange text-orange hover:bg-orange hover:text-white">Dismiss</Button>
        </div>
      </div>
    </div>
  );
}

function MyTrips({ bookings, customerId, onChange }: { bookings: any[]; customerId: string | null; onChange: () => void }) {
  if (!bookings.length) return <p className="text-muted-foreground text-center py-12">No bookings yet.</p>;
  return (
    <div className="space-y-4">
      {bookings.map((b) => (
        <TripCard key={b.id} b={b} customerId={customerId} onChange={onChange} />
      ))}
    </div>
  );
}

function TripCard({ b, customerId, onChange }: { b: any; customerId: string | null; onChange: () => void }) {
  const [reviewing, setReviewing] = useState(false);
  const [hasReview, setHasReview] = useState(false);

  useEffect(() => {
    if (b.id) supabase.from("reviews").select("id").eq("booking_id", b.id).maybeSingle().then(({ data }) => setHasReview(!!data));
  }, [b.id]);

  const status = b.status as string;
  return (
    <div className="brand-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-orange font-semibold">{b.booking_code}</span>
            <StatusBadge status={status} />
          </div>
          <div className="font-medium">
            {b.trip_type === "round_trip"
              ? `${b.from_city} → ${b.to_city} · ${b.days_count} day(s)`
              : `${b.pickup_location} → ${b.drop_location}`}
          </div>
          <div className="text-sm text-muted-foreground">{b.car_type} · {b.people_count} {b.people_count === 1 ? "person" : "people"}</div>
        </div>
        {b.drivers && (
          <div className="flex items-center gap-2 text-sm">
            {b.drivers.profile_picture_url
              ? <img src={b.drivers.profile_picture_url} className="h-8 w-8 rounded-full object-cover" alt="" />
              : <div className="h-8 w-8 rounded-full bg-[#FFF4F0] flex items-center justify-center text-orange text-sm">{b.drivers.full_name?.charAt(0)}</div>}
            <div>
              <div className="font-medium">{b.drivers.full_name}</div>
              <div className="text-xs text-muted-foreground">{b.drivers.contact}</div>
            </div>
          </div>
        )}
      </div>
      {status === "accepted" && b.drivers && !hasReview && (
        <Button size="sm" onClick={() => setReviewing(true)} className="bg-orange text-white hover:bg-[oklch(0.76_0.15_38)]">Rate your trip</Button>
      )}
      {hasReview && <span className="text-xs text-green-700">Review submitted ✓</span>}
      {reviewing && (
        <ReviewForm
          bookingId={b.id}
          customerId={customerId!}
          driverId={b.drivers.id}
          onDone={() => { setReviewing(false); setHasReview(true); onChange(); }}
        />
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    accepted: "bg-green-50 text-green-700 border-green-200",
    completed: "bg-blue-50 text-blue-700 border-blue-200",
    cancelled: "bg-red-50 text-red-700 border-red-200",
  };
  return <span className={`text-xs px-2 py-0.5 rounded-full border ${map[status] ?? "bg-muted"}`}>{status}</span>;
}

function ReviewForm({ bookingId, customerId, driverId, onDone }: { bookingId: string; customerId: string; driverId: string; onDone: () => void }) {
  const [driverRating, setDriverRating] = useState(5);
  const [tripRating, setTripRating] = useState(5);
  const [tags, setTags] = useState<string[]>([]);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);

  const toggleTag = (t: string) => setTags((curr) => curr.includes(t) ? curr.filter((x) => x !== t) : [...curr, t]);

  const submit = async () => {
    setBusy(true);
    const { error } = await supabase.from("reviews").insert({
      booking_id: bookingId, customer_id: customerId, driver_id: driverId,
      rating: driverRating, trip_rating: tripRating, tags, comment,
    });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Thanks for your review!");
    onDone();
  };

  return (
    <div className="mt-5 brand-card p-5 bg-[#FFF4F0] border-orange">
      <h4 className="font-display text-lg mb-4">Rate your trip</h4>
      <div className="space-y-4">
        <div>
          <Label className="block mb-2">How was your driver?</Label>
          <StarRating value={driverRating} onChange={setDriverRating} />
        </div>
        <div>
          <Label className="block mb-2">How was your trip?</Label>
          <StarRating value={tripRating} onChange={setTripRating} />
        </div>
        <div>
          <Label className="block mb-2">Quick tags</Label>
          <div className="flex flex-wrap gap-2">
            {TAGS.map((t) => {
              const on = tags.includes(t);
              return (
                <button key={t} type="button" onClick={() => toggleTag(t)}
                  className={`text-sm px-3 py-1.5 rounded-full border transition ${on ? "bg-orange text-white border-orange" : "bg-white border-[color:var(--border)] text-foreground/70 hover:border-orange hover:text-orange"}`}>
                  {t}
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <Label>Write a short review</Label>
          <Textarea placeholder="Share your experience…" value={comment} onChange={(e) => setComment(e.target.value)} />
        </div>
        <Button onClick={submit} disabled={busy} className="bg-orange text-white hover:bg-[oklch(0.76_0.15_38)]">
          {busy ? "Submitting…" : "Submit review"}
        </Button>
      </div>
    </div>
  );
}
