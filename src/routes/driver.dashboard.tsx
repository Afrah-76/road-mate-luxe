import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { Star, X, MapPin, Phone, Calendar, Bell } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { sendDriverAssigned } from "@/lib/notifications.functions";

export const Route = createFileRoute("/driver/dashboard")({
  head: () => ({ meta: [{ title: "Driver Dashboard — Road Mate Tours" }] }),
  component: DriverDashboard,
});

function DriverDashboard() {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();
  const sendAssigned = useServerFn(sendDriverAssigned);

  const [driverId, setDriverId] = useState<string | null>(null);
  const [form, setForm] = useState({
    full_name: "", age: "", address: "", contact: "",
    availability: true, profile_picture_url: "" as string | null | "",
    rating: 0,
  });
  const [places, setPlaces] = useState<string[]>([]);
  const [placeInput, setPlaceInput] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  // Notifications + jobs
  const [pending, setPending] = useState<any[]>([]);
  const [myTrips, setMyTrips] = useState<any[]>([]);

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate({ to: "/driver-login" }); return; }
    if (role === "customer") { navigate({ to: "/customer/dashboard" }); return; }

    (async () => {
      const { data } = await supabase.from("drivers").select("*").eq("user_id", user.id).maybeSingle();
      if (data) {
        setDriverId(data.id);
        setForm({
          full_name: data.full_name, age: String(data.age), address: data.address,
          contact: data.contact, availability: data.availability,
          profile_picture_url: data.profile_picture_url, rating: Number(data.rating),
        });
        setPlaces(data.places_driven ?? []);
      }
    })();
  }, [loading, user, role, navigate]);

  // Poll pending bookings (realtime disabled for security — bookings removed from publication)
  useEffect(() => {
    if (!driverId) return;
    refreshPending();
    refreshMyTrips();
    const iv = setInterval(() => {
      refreshPending();
      refreshMyTrips();
    }, 15000);
    return () => clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [driverId]);

  const refreshPending = async () => {
    const { data } = await supabase.rpc("get_pending_bookings_for_drivers" as any);
    setPending((data as any[]) ?? []);
  };

  const refreshMyTrips = async () => {
    if (!driverId) return;
    const { data } = await supabase.from("bookings")
      .select("*")
      .eq("driver_id", driverId)
      .order("created_at", { ascending: false });
    setMyTrips(data ?? []);
  };

  const accept = async (b: any) => {
    if (!driverId) return;
    const { data, error } = await supabase.from("bookings")
      .update({ driver_id: driverId, status: "accepted" })
      .eq("id", b.id)
      .is("driver_id", null)
      .eq("status", "pending")
      .select().maybeSingle();
    if (error) { toast.error(error.message); return; }
    if (!data) { toast.error("Another driver was faster — trip already taken."); refreshPending(); return; }
    toast.success(`Accepted ${b.booking_code}`);
    sendAssigned({ data: {
      bookingCode: b.booking_code,
      customerName: b.full_name,
      customerEmail: b.email,
      customerMobile: b.mobile,
      driverName: form.full_name,
      driverContact: form.contact,
    }}).catch(() => {});
    refreshPending();
    refreshMyTrips();
  };

  const decline = (b: any) => {
    setPending((curr) => curr.filter((x) => x.id !== b.id));
  };

  const addPlace = () => {
    const v = placeInput.trim();
    if (v && !places.includes(v)) setPlaces([...places, v]);
    setPlaceInput("");
  };

  const save = async () => {
    if (!driverId || !user) return;
    setBusy(true);
    try {
      let photo_url = form.profile_picture_url || null;
      if (photo) {
        const path = `${user.id}/${Date.now()}-${photo.name}`;
        const { error: upErr } = await supabase.storage.from("driver-photos").upload(path, photo);
        if (upErr) throw upErr;
        photo_url = supabase.storage.from("driver-photos").getPublicUrl(path).data.publicUrl;
      }
      const { error } = await supabase.from("drivers").update({
        full_name: form.full_name, age: parseInt(form.age), address: form.address,
        contact: form.contact, availability: form.availability,
        profile_picture_url: photo_url, places_driven: places,
      }).eq("id", driverId);
      if (error) throw error;
      setForm((f) => ({ ...f, profile_picture_url: photo_url }));
      setPhoto(null);
      toast.success("Profile updated");
    } catch (err: any) {
      toast.error(err.message);
    } finally { setBusy(false); }
  };

  if (loading || !user || !driverId) return <div className="min-h-screen bg-background"><SiteHeader /><div className="text-center py-32 text-muted-foreground">Loading…</div></div>;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="mx-auto max-w-5xl px-6 py-12 fade-up">
        <p className="text-orange tracking-[0.3em] text-xs uppercase mb-2">Driver</p>
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <h1 className="font-display text-4xl">My dashboard</h1>
          <div className="flex items-center gap-2 text-orange">
            <Star className="h-5 w-5 fill-orange" />
            <span className="text-2xl font-display">{form.rating.toFixed(1)}</span>
            <span className="text-muted-foreground text-sm">/ 5</span>
          </div>
        </div>

        {/* New trip requests */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Bell className="h-5 w-5 text-orange" />
            <h2 className="font-display text-xl">New trip requests</h2>
            {pending.length > 0 && <span className="text-xs px-2 py-0.5 rounded-full bg-orange text-white">{pending.length}</span>}
          </div>
          {pending.length === 0 ? (
            <p className="text-sm text-muted-foreground">No pending requests right now.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {pending.map((b) => (
                <div key={b.id} className="brand-card p-5 border-orange/30 hover:orange-glow transition">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-orange font-semibold">{b.booking_code}</span>
                    <span className="text-xs text-muted-foreground">{new Date(b.created_at).toLocaleString()}</span>
                  </div>
                  <div className="font-medium mb-1">{b.full_name}</div>
                  <div className="text-sm flex items-start gap-2 text-foreground/80"><MapPin className="h-4 w-4 mt-0.5 text-orange" />{tripLine(b)}</div>
                  <div className="text-sm flex items-center gap-2 text-muted-foreground mt-1"><Calendar className="h-4 w-4" />{tripWhen(b)}</div>
                  <div className="text-xs text-muted-foreground mt-1">Car: {b.car_type} · {b.people_count} pax</div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" className="bg-orange text-white hover:bg-[oklch(0.76_0.15_38)] flex-1" onClick={() => accept(b)}>Accept</Button>
                    <Button size="sm" variant="outline" className="border-[color:var(--border)] flex-1" onClick={() => decline(b)}>Decline</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My trips */}
        <div className="mb-10">
          <h2 className="font-display text-xl mb-3">My trips</h2>
          {myTrips.length === 0 ? (
            <p className="text-sm text-muted-foreground">You haven't accepted any trips yet.</p>
          ) : (
            <div className="space-y-3">
              {myTrips.map((b) => (
                <div key={b.id} className="brand-card p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="font-mono text-orange font-semibold">{b.booking_code}</div>
                      <div className="font-medium">{b.full_name} · {tripLine(b)}</div>
                      <div className="text-xs text-muted-foreground">{tripWhen(b)} · {b.car_type}</div>
                      {b.special_instructions && <div className="text-xs mt-1 text-orange">Note: {b.special_instructions}</div>}
                    </div>
                    <div className="text-sm flex items-center gap-2 text-foreground/80"><Phone className="h-4 w-4 text-orange" />{b.mobile}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profile */}
        <h2 className="font-display text-xl mb-3">My profile</h2>
        <div className="brand-card p-6 md:p-8 space-y-5">
          <div className="flex items-center gap-5">
            {form.profile_picture_url ? (
              <img src={form.profile_picture_url} alt="" className="h-24 w-24 rounded-full object-cover border-2 border-orange/40" />
            ) : (
              <div className="h-24 w-24 rounded-full bg-[#FFF4F0] border-2 border-orange/40 flex items-center justify-center text-orange font-display text-3xl">
                {form.full_name.charAt(0)}
              </div>
            )}
            <div className="flex-1">
              <Label>Update profile picture</Label>
              <Input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files?.[0] ?? null)} />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div><Label>Full name</Label><Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} /></div>
            <div><Label>Age</Label><Input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} /></div>
          </div>
          <div><Label>Contact</Label><Input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} /></div>
          <div><Label>Address</Label><Textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>

          <div className="flex items-center justify-between rounded-lg border border-[color:var(--border)] p-4">
            <Label className="m-0">Availability</Label>
            <div className="flex items-center gap-3">
              <span className={form.availability ? "text-green-700 text-sm" : "text-muted-foreground text-sm"}>
                {form.availability ? "Available" : "Not available"}
              </span>
              <Switch checked={form.availability} onCheckedChange={(v) => setForm({ ...form, availability: v })} />
            </div>
          </div>

          <div>
            <Label>Places driven to</Label>
            <div className="flex gap-2">
              <Input value={placeInput} onChange={(e) => setPlaceInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addPlace(); } }} />
              <Button type="button" onClick={addPlace} variant="outline" className="border-orange text-orange hover:bg-orange hover:text-white">Add</Button>
            </div>
            {places.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {places.map((p) => (
                  <span key={p} className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-[#FFF4F0] text-orange border border-orange/40">
                    {p}
                    <button type="button" onClick={() => setPlaces(places.filter((x) => x !== p))}><X className="h-3 w-3" /></button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <Button onClick={save} disabled={busy} className="w-full bg-orange text-white hover:bg-[oklch(0.76_0.15_38)] orange-glow">
            {busy ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

function tripLine(b: any) {
  return b.trip_type === "round_trip"
    ? `${b.from_city} → ${b.to_city} (${b.days_count}d)`
    : `${b.pickup_location} → ${b.drop_location}`;
}
function tripWhen(b: any) {
  const dt = b.pickup_datetime ?? b.start_date;
  try { return new Date(dt).toLocaleString(); } catch { return String(dt); }
}
