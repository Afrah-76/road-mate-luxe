import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { Star, X } from "lucide-react";

export const Route = createFileRoute("/driver/dashboard")({
  head: () => ({ meta: [{ title: "Driver Dashboard — Road Mate Tours" }] }),
  component: DriverDashboard,
});

function DriverDashboard() {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();
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

  if (loading || !user || !driverId) return <div className="min-h-screen"><SiteHeader /><div className="text-center py-32 text-foreground/60">Loading…</div></div>;

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-3xl px-6 py-12 fade-up">
        <p className="text-gold/80 tracking-[0.3em] text-xs uppercase mb-2">Driver</p>
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <h1 className="font-display text-4xl">My profile</h1>
          <div className="flex items-center gap-2 text-gold">
            <Star className="h-5 w-5 fill-gold" />
            <span className="text-2xl font-display">{form.rating.toFixed(1)}</span>
            <span className="text-foreground/60 text-sm">/ 5</span>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-8 space-y-5">
          <div className="flex items-center gap-5">
            {form.profile_picture_url ? (
              <img src={form.profile_picture_url} alt="" className="h-24 w-24 rounded-full object-cover border-2 border-gold/40" />
            ) : (
              <div className="h-24 w-24 rounded-full bg-gold/10 border-2 border-gold/30 flex items-center justify-center text-gold font-display text-3xl">
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

          <div className="flex items-center justify-between glass-card rounded-lg p-4">
            <Label className="m-0">Availability</Label>
            <div className="flex items-center gap-3">
              <span className={form.availability ? "text-green-400 text-sm" : "text-foreground/60 text-sm"}>
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
              <Button type="button" onClick={addPlace} variant="outline" className="border-gold/40 text-gold">Add</Button>
            </div>
            {places.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {places.map((p) => (
                  <span key={p} className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-gold/10 text-gold border border-gold/30">
                    {p}
                    <button type="button" onClick={() => setPlaces(places.filter((x) => x !== p))}><X className="h-3 w-3" /></button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <Button onClick={save} disabled={busy} className="w-full bg-gold text-primary-foreground hover:bg-gold-soft gold-glow">
            {busy ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </section>
    </div>
  );
}
