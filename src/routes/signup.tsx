import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Sign Up — Road Mate Tours" }] }),
  component: SignUp,
});

function SignUp() {
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
    if (form.password !== form.confirm) { toast.error("Passwords do not match"); return; }
    if (form.password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setBusy(true);
    try {
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
    } catch (err: any) {
      toast.error(err.message ?? "Sign up failed");
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
          <h1 className="font-display text-3xl text-center mb-2">Create your account</h1>
          <p className="text-foreground/60 text-center mb-8 text-sm">
            Join Road Mate Tours to start booking journeys
          </p>

          <form onSubmit={submit} className="space-y-4">
            <div><Label>Full name</Label><Input required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} /></div>
            <div><Label>Mobile number</Label><Input required value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} /></div>
            <div><Label>Email</Label><Input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div><Label>Password</Label><Input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
            <div><Label>Confirm password</Label><Input type="password" required value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} /></div>
            <Button type="submit" disabled={busy} className="w-full bg-gold text-primary-foreground hover:bg-gold-soft gold-glow">
              {busy ? "Creating account…" : "Sign up"}
            </Button>
          </form>

          <p className="text-center text-sm text-foreground/60 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-gold hover:underline">Sign in</Link>
          </p>
        </div>
      </section>
    </div>
  );
}
