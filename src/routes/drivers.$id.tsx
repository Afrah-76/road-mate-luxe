import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Star, MapPin, Phone, ArrowLeft, Award, Car, Facebook, Instagram, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/drivers/$id")({
  head: () => ({ meta: [{ title: "Driver Profile — Road Mate Tours" }] }),
  component: DriverProfile,
});

function DriverProfile() {
  const { id } = Route.useParams();
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();
  const [driver, setDriver] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate({ to: "/login" }); return; }
    (async () => {
      const { data } = await supabase.from("drivers").select("*").eq("id", id).maybeSingle();
      setDriver(data);
      const { data: rs } = await supabase.from("reviews").select("*, customers(full_name)").eq("driver_id", id).order("created_at", { ascending: false }).limit(20);
      setReviews(rs ?? []);
    })();
  }, [id, loading, user, navigate]);

  if (!driver) return <div className="min-h-screen bg-background"><SiteHeader /><div className="text-center py-32 text-muted-foreground">Loading…</div></div>;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="mx-auto max-w-3xl px-6 py-12 fade-up">
        <Link to={role === "driver" ? "/driver/dashboard" : "/customer/dashboard"} className="inline-flex items-center gap-2 text-orange hover:opacity-80 mb-8 text-sm">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <div className="brand-card p-8 md:p-10">
          <div className="flex flex-col md:flex-row items-start gap-8">
            {driver.profile_picture_url ? (
              <img src={driver.profile_picture_url} alt={driver.full_name} className="h-40 w-40 rounded-2xl object-cover border-2 border-orange/40" />
            ) : (
              <div className="h-40 w-40 rounded-2xl bg-[#FFF4F0] border-2 border-orange/40 flex items-center justify-center text-orange font-display text-5xl">
                {driver.full_name.charAt(0)}
              </div>
            )}
            <div className="flex-1">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="font-display text-3xl md:text-4xl">{driver.full_name}</h1>
                  <p className="text-muted-foreground mt-1">Age {driver.age}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`text-xs px-3 py-1 rounded-full ${driver.availability ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                    {driver.availability ? "Available" : "Not available"}
                  </span>
                  {Number(driver.rating) >= 4.5 && (
                    <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-orange text-white font-medium">
                      <Award className="h-3 w-3" /> Top Rated
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 text-orange mt-4">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-5 w-5 ${i < Math.round(Number(driver.rating)) ? "fill-orange" : "text-[#E0E0DD]"}`} />
                  ))}
                </div>
                <span className="text-xl font-display ml-1">{Number(driver.rating).toFixed(1)}</span>
                <span className="text-muted-foreground text-sm">· {reviews.length} review{reviews.length === 1 ? "" : "s"}</span>
              </div>

              <div className="flex flex-wrap gap-4 mt-3 text-sm text-foreground/80">
                <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-orange" /> {driver.contact}</div>
                {driver.vehicle_type && (
                  <div className="flex items-center gap-2"><Car className="h-4 w-4 text-orange" /> {driver.vehicle_type}</div>
                )}
              </div>

              {(driver.facebook_url || driver.instagram_id || driver.whatsapp_number) && (
                <div className="flex gap-2 mt-4">
                  {driver.facebook_url && (
                    <a href={driver.facebook_url} target="_blank" rel="noreferrer" aria-label="Facebook"
                      className="p-2 rounded-full border border-orange/30 text-orange hover:bg-orange hover:text-white transition">
                      <Facebook className="h-4 w-4" />
                    </a>
                  )}
                  {driver.instagram_id && (
                    <a href={`https://instagram.com/${driver.instagram_id.replace("@", "")}`} target="_blank" rel="noreferrer" aria-label="Instagram"
                      className="p-2 rounded-full border border-orange/30 text-orange hover:bg-orange hover:text-white transition">
                      <Instagram className="h-4 w-4" />
                    </a>
                  )}
                  {driver.whatsapp_number && (
                    <a href={`https://wa.me/${driver.whatsapp_number.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" aria-label="WhatsApp"
                      className="p-2 rounded-full border border-orange/30 text-orange hover:bg-orange hover:text-white transition">
                      <MessageCircle className="h-4 w-4" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-sm tracking-widest uppercase text-orange font-medium mb-3">Places driven to</h2>
            <div className="flex flex-wrap gap-2">
              {driver.places_driven?.length ? driver.places_driven.map((p: string) => (
                <span key={p} className="text-sm px-3 py-1 rounded-full bg-[#FFF4F0] text-orange border border-orange/40">
                  <MapPin className="inline h-3 w-3 mr-1" />{p}
                </span>
              )) : <span className="text-muted-foreground text-sm">No places listed yet.</span>}
            </div>
          </div>

          {role === "customer" && (
            <Link to="/customer/dashboard" search={{ driver: driver.id, driverName: driver.full_name } as any} className="block mt-8">
              <Button className="w-full bg-orange text-white hover:bg-[oklch(0.76_0.15_38)] orange-glow">
                Request this Driver
              </Button>
            </Link>
          )}
        </div>

        {/* Reviews */}
        <div className="mt-10">
          <h2 className="font-display text-2xl mb-4">Reviews</h2>
          {reviews.length === 0 ? (
            <p className="text-sm text-muted-foreground">No reviews yet.</p>
          ) : (
            <div className="space-y-3">
              {reviews.map((r) => (
                <div key={r.id} className="brand-card p-5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">{r.customers?.full_name ?? "Customer"}</div>
                    <div className="flex items-center gap-1 text-orange">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < r.rating ? "fill-orange" : "text-[#E0E0DD]"}`} />
                      ))}
                    </div>
                  </div>
                  {r.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {r.tags.map((t: string) => (
                        <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-[#FFF4F0] text-orange border border-orange/30">{t}</span>
                      ))}
                    </div>
                  )}
                  {r.comment && <p className="text-sm text-foreground/80">{r.comment}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
