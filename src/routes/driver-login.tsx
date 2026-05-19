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
import { X, Facebook, Instagram, MessageCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/driver-login")({
  head: () => ({ meta: [{ title: "Driver Login — Road Mate Tours" }] }),
  component: DriverLogin,
});

function DriverLogin() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({
    full_name: "", age: "", address: "", contact: "", email: "",
    password: "", confirm: "", availability: true,
    facebook_url: "", instagram_id: "", whatsapp_number: "", vehicle_type: "Car",
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [places, setPlaces] = useState<string[]>([]);
  const [placeInput, setPlaceInput] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const { user, role, refreshRole } = useAuth();

  useEffect(() => {
    if (user && role === "driver") navigate({ to: "/driver/dashboard" });
    if (user && role === "customer") navigate({ to: "/customer/dashboard" });
  }, [user, role, navigate]);

  const addPlace = () => {
    const v = placeInput.trim();
    if (v && !places.includes(v)) setPlaces([...places, v]);
    setPlaceInput("");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "register") {
        if (form.password !== form.confirm) { toast.error("Passwords do not match"); return; }
        if (form.password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
        const { data, error } = await supabase.auth.signUp({
          email: form.email, password: form.password,
          options: { emailRedirectTo: `${window.location.origin}/driver/dashboard` },
        });
        if (error) throw error;
        const uid = data.user?.id;
        if (!uid) throw new Error("Sign up failed");

        let photo_url: string | null = null;
        if (photo) {
          const path = `${uid}/${Date.now()}-${photo.name}`;
          const { error: upErr } = await supabase.storage.from("driver-photos").upload(path, photo);
          if (upErr) throw upErr;
          photo_url = supabase.storage.from("driver-photos").getPublicUrl(path).data.publicUrl;
        }

        const { error: insErr } = await supabase.from("drivers").insert({
          user_id: uid, full_name: form.full_name, age: parseInt(form.age),
          address: form.address, contact: form.contact, email: form.email,
          availability: form.availability, profile_picture_url: photo_url, places_driven: places,
          facebook_url: form.facebook_url || null, instagram_id: form.instagram_id || null,
          whatsapp_number: form.whatsapp_number || null, vehicle_type: form.vehicle_type,
        });
        if (insErr) throw insErr;
        await refreshRole();
        toast.success("Driver profile created!");
        navigate({ to: "/driver/dashboard" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
        if (error) throw error;
        await refreshRole();
        toast.success("Signed in");
        navigate({ to: "/driver/dashboard" });
      }
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="mx-auto max-w-lg px-6 py-16 fade-up">
        <div className="brand-card p-8">
          <p className="text-orange tracking-[0.3em] text-xs uppercase mb-2 text-center">Driver</p>
          <h1 className="font-display text-3xl text-center mb-2">{mode === "login" ? "Driver sign in" : "Become a driver"}</h1>

          <div className="flex rounded-lg bg-secondary p-1 my-6">
            <button type="button" onClick={() => setMode("login")} className={`flex-1 py-2 rounded-md text-sm transition ${mode === "login" ? "bg-orange text-white" : "text-foreground/70"}`}>Login</button>
            <button type="button" onClick={() => setMode("register")} className={`flex-1 py-2 rounded-md text-sm transition ${mode === "register" ? "bg-orange text-white" : "text-foreground/70"}`}>Register</button>
          </div>

          <form onSubmit={submit} className="space-y-4">
            {mode === "register" && (
              <>
                <div><Label>Full name</Label><Input required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Age</Label><Input type="number" min="18" required value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} /></div>
                  <div><Label>Contact</Label><Input required value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} /></div>
                </div>
                <div><Label>Address</Label><Textarea required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
              </>
            )}
            <div><Label>Email</Label><Input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div><Label>Password</Label><Input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
            {mode === "register" && (
              <>
                <div><Label>Confirm password</Label><Input type="password" required value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} /></div>
                <div className="flex items-center justify-between rounded-lg border border-[color:var(--border)] p-3">
                  <Label className="m-0">Available for trips</Label>
                  <Switch checked={form.availability} onCheckedChange={(v) => setForm({ ...form, availability: v })} />
                </div>
                <div>
                  <Label>Profile picture</Label>
                  <Input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files?.[0] ?? null)} />
                </div>
                <div>
                  <Label>Places you have driven to</Label>
                  <div className="flex gap-2">
                    <Input value={placeInput} onChange={(e) => setPlaceInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addPlace(); } }}
                      placeholder="e.g. Ooty" />
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
              </>
            )}
            <Button type="submit" disabled={busy} className="w-full bg-orange text-white hover:bg-[oklch(0.76_0.15_38)] orange-glow">
              {busy ? "Please wait…" : mode === "login" ? "Sign in" : "Create driver account"}
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
