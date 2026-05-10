import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Customer Login — Road Mate Tours" }] }),
  component: CustomerLogin,
});

function CustomerLogin() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ full_name: "", email: "", mobile: "", password: "", confirm: "" });
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const { user, role, refreshRole } = useAuth();

  useEffect(() => {
    if (user && role === "customer") navigate({ to: "/customer/dashboard" });
    if (user && role === "driver") navigate({ to: "/driver/dashboard" });
  }, [user, role, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "register") {
        if (form.password !== form.confirm) { toast.error("Passwords do not match"); return; }
        if (form.password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
        const { data, error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: { emailRedirectTo: `${window.location.origin}/customer/dashboard` },
        });
        if (error) throw error;
        const uid = data.user?.id;
        if (uid) {
          const { error: insErr } = await supabase.from("customers").insert({
            user_id: uid, full_name: form.full_name, email: form.email, mobile: form.mobile,
          });
          if (insErr) throw insErr;
        }
        await refreshRole();
        toast.success("Welcome to Road Mate Tours!");
        navigate({ to: "/customer/dashboard" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
        if (error) throw error;
        await refreshRole();
        toast.success("Signed in");
        navigate({ to: "/customer/dashboard" });
      }
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-md px-6 py-16 fade-up">
        <div className="glass-card rounded-2xl p-8">
          <p className="text-gold/80 tracking-[0.3em] text-xs uppercase mb-2 text-center">Customer</p>
          <h1 className="font-display text-3xl text-center mb-2">{mode === "login" ? "Welcome back" : "Create account"}</h1>
          <p className="text-foreground/60 text-center mb-8 text-sm">
            {mode === "login" ? "Sign in to book your next journey" : "Join us to start planning your adventures"}
          </p>

          <div className="flex rounded-lg bg-secondary p-1 mb-6">
            <button type="button" onClick={() => setMode("login")} className={`flex-1 py-2 rounded-md text-sm transition ${mode === "login" ? "bg-gold text-primary-foreground" : "text-foreground/70"}`}>Login</button>
            <button type="button" onClick={() => setMode("register")} className={`flex-1 py-2 rounded-md text-sm transition ${mode === "register" ? "bg-gold text-primary-foreground" : "text-foreground/70"}`}>Register</button>
          </div>

          <form onSubmit={submit} className="space-y-4">
            {mode === "register" && (
              <>
                <div><Label>Full name</Label><Input required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} /></div>
                <div><Label>Mobile number</Label><Input required value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} /></div>
              </>
            )}
            <div><Label>Email</Label><Input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div><Label>Password</Label><Input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
            {mode === "register" && (
              <div><Label>Confirm password</Label><Input type="password" required value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} /></div>
            )}
            <Button type="submit" disabled={busy} className="w-full bg-gold text-primary-foreground hover:bg-gold-soft gold-glow">
              {busy ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
