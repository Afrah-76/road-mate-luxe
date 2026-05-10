import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Star, MapPin, Phone, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/drivers/$id")({
  head: () => ({ meta: [{ title: "Driver Profile — Road Mate Tours" }] }),
  component: DriverProfile,
});

function DriverProfile() {
  const { id } = Route.useParams();
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();
  const [driver, setDriver] = useState<any>(null);
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate({ to: "/login" }); return; }
    (async () => {
      const { data } = await supabase.from("drivers").select("*").eq("id", id).maybeSingle();
      setDriver(data);
      const { count } = await supabase.from("reviews").select("*", { count: "exact", head: true }).eq("driver_id", id);
      setReviewCount(count ?? 0);
    })();
  }, [id, loading, user, navigate]);

  if (!driver) return <div className="min-h-screen"><SiteHeader /><div className="text-center py-32 text-foreground/60">Loading…</div></div>;

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-3xl px-6 py-12 fade-up">
        <Link to={role === "driver" ? "/driver/dashboard" : "/customer/dashboard"} className="inline-flex items-center gap-2 text-gold/80 hover:text-gold mb-8 text-sm">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <div className="glass-card rounded-2xl p-8 md:p-10">
          <div className="flex flex-col md:flex-row items-start gap-8">
            {driver.profile_picture_url ? (
              <img src={driver.profile_picture_url} alt={driver.full_name} className="h-40 w-40 rounded-2xl object-cover border-2 border-gold/40" />
            ) : (
              <div className="h-40 w-40 rounded-2xl bg-gold/10 border-2 border-gold/30 flex items-center justify-center text-gold font-display text-5xl">
                {driver.full_name.charAt(0)}
              </div>
            )}
            <div className="flex-1">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="font-display text-3xl md:text-4xl">{driver.full_name}</h1>
                  <p className="text-foreground/60 mt-1">Age {driver.age}</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full ${driver.availability ? "bg-green-500/15 text-green-400 border border-green-500/30" : "bg-red-500/15 text-red-400 border border-red-500/30"}`}>
                  {driver.availability ? "Available" : "Not available"}
                </span>
              </div>

              <div className="flex items-center gap-2 text-gold mt-4">
                <Star className="h-5 w-5 fill-gold" />
                <span className="text-xl font-display">{Number(driver.rating).toFixed(1)}</span>
                <span className="text-foreground/60 text-sm">· {reviewCount} review{reviewCount === 1 ? "" : "s"}</span>
              </div>

              <div className="flex items-center gap-2 text-foreground/70 mt-3"><Phone className="h-4 w-4 text-gold" /> {driver.contact}</div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-sm tracking-widest uppercase text-gold/80 mb-3">Places driven to</h2>
            <div className="flex flex-wrap gap-2">
              {driver.places_driven?.length ? driver.places_driven.map((p: string) => (
                <span key={p} className="text-sm px-3 py-1 rounded-full bg-gold/10 text-gold border border-gold/30">
                  <MapPin className="inline h-3 w-3 mr-1" />{p}
                </span>
              )) : <span className="text-foreground/50 text-sm">No places listed yet.</span>}
            </div>
          </div>

          {role === "customer" && (
            <Link to="/customer/dashboard" search={{ driver: driver.id, driverName: driver.full_name } as any} className="block mt-8">
              <Button className="w-full bg-gold text-primary-foreground hover:bg-gold-soft gold-glow">
                Request this Driver
              </Button>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
