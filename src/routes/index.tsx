import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { ReviewsCarousel } from "@/components/ReviewsCarousel";
import { FloatingBookButton } from "@/components/FloatingBookButton";
import { WeatherBadge } from "@/components/WeatherBadge";
import { PLACES } from "@/lib/places";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import heroImg from "@/assets/hero.jpg";
import { ArrowRight, Car, Star, MapPin, Send } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Road Mate Tours — Tamil Nadu's Trusted Travel Partner" },
      { name: "description", content: "Curated rides across Tamil Nadu — Ooty, Kodaikanal, Rameswaram, Madurai, Kanyakumari and more." },
    ],
  }),
  component: HomePage,
});

const featured = PLACES.slice(0, 6);

function HomePage() {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* HERO with parallax */}
      <section className="relative overflow-hidden bg-charcoal text-white">
        <div className="absolute inset-0" style={{ transform: `translateY(${scrollY * 0.35}px) scale(1.1)` }}>
          <img src={heroImg} alt="" className="h-full w-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 via-charcoal/70 to-charcoal" />
        </div>
        <div className="relative mx-auto max-w-6xl px-6 py-32 md:py-44 text-center fade-up">
          <p className="text-orange tracking-[0.4em] text-xs uppercase mb-6">Tamil Nadu · Curated travel</p>
          <h1 className="font-display text-5xl md:text-7xl leading-[1.05] mb-6 text-white">
            Drive into stories <br />
            <span className="text-orange">worth telling.</span>
          </h1>
          <p className="mx-auto max-w-xl text-lg text-white/75 mb-10">
            Curated journeys across Tamil Nadu's most enchanting destinations, with expert drivers who know every winding road.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/book">
              <Button size="lg" className="bg-orange text-white hover:bg-[oklch(0.76_0.15_38)] orange-glow px-8">
                Book a Journey <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/services">
              <Button size="lg" variant="outline" className="border-orange text-orange hover:bg-orange hover:text-white px-8">
                Explore Destinations
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-charcoal text-white py-16 border-t border-white/5">
        <div className="mx-auto max-w-6xl px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { n: 500, l: "Trips Completed" },
            { n: 200, l: "Expert Drivers" },
            { n: 12, l: "Destinations" },
            { n: 4, l: "Avg Rating", suffix: ".8★" },
          ].map((s) => (
            <Reveal key={s.l}>
              <div>
                <div className="font-display text-4xl md:text-5xl text-orange">
                  <AnimatedCounter to={s.n} suffix={s.suffix ?? "+"} />
                </div>
                <div className="text-sm text-white/70 mt-2 tracking-wider uppercase">{s.l}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <Reveal>
        <section id="about" className="mx-auto max-w-5xl px-6 py-24 text-center">
          <p className="text-orange tracking-[0.3em] text-xs uppercase mb-4">About</p>
          <h2 className="font-display text-3xl md:text-5xl mb-6">A premier name in Tamil Nadu travel</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Road Mate Tours connects discerning travellers with Tamil Nadu's most accomplished drivers
            and the state's most spectacular destinations. Every trip is hand-curated, every driver is vetted,
            and every memory is built to last.
          </p>
        </section>
      </Reveal>

      {/* DESTINATIONS */}
      <section id="services" className="mx-auto max-w-7xl px-6 py-20">
        <Reveal>
          <div className="text-center mb-14">
            <p className="text-orange tracking-[0.3em] text-xs uppercase mb-4">Destinations</p>
            <h2 className="font-display text-3xl md:text-5xl">Where shall we take you?</h2>
          </div>
        </Reveal>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((p, idx) => (
            <Reveal key={p.slug} delay={(idx % 3) * 80}>
              <article className="group brand-card overflow-hidden h-full flex flex-col transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:orange-glow hover:border-orange">
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={`https://source.unsplash.com/featured/800x600/?${encodeURIComponent(p.name + ",tamilnadu")}`}
                    alt={p.name} loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <h3 className="absolute bottom-4 left-5 font-display text-2xl text-white">{p.name}</h3>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <p className="text-sm text-muted-foreground mb-4">{p.description}</p>
                  <div className="mb-4">
                    <div className="text-[10px] tracking-[0.25em] uppercase text-orange font-medium mb-2">Current climate</div>
                    <WeatherBadge lat={p.lat} lon={p.lon} compact />
                  </div>
                  <Link to="/places/$slug" params={{ slug: p.slug }} className="mt-auto">
                    <Button variant="outline" className="w-full border-orange text-orange hover:bg-orange hover:text-white">
                      <MapPin className="h-4 w-4 mr-2" /> View Location & Photos
                    </Button>
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
        <div className="text-center mt-14">
          <Link to="/services"><Button size="lg" className="bg-orange text-white hover:bg-[oklch(0.76_0.15_38)] orange-glow px-10">View All 12 Destinations</Button></Link>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="bg-[oklch(0.99_0_0)] py-20">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <div className="text-center mb-12">
              <p className="text-orange tracking-[0.3em] text-xs uppercase mb-4">Reviews</p>
              <h2 className="font-display text-3xl md:text-5xl">Customer Reviews & Feedback</h2>
            </div>
          </Reveal>
          <Reveal><ReviewsCarousel /></Reveal>
          <Reveal><FeedbackForm /></Reveal>
        </div>
      </section>

      {/* USER TYPE */}
      <Reveal>
        <section className="mx-auto max-w-5xl px-6 py-20">
          <div className="brand-card p-10 md:p-14 text-center">
            <h2 className="font-display text-3xl md:text-4xl mb-3">Customer or Driver?</h2>
            <p className="text-muted-foreground mb-10">Choose your path to begin your journey.</p>
            <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <Link to="/login" className="group brand-card p-8 hover:border-orange hover:bg-[#FFF4F0] transition-all hover:-translate-y-1 hover:shadow-lg">
                <Star className="h-8 w-8 text-orange mx-auto mb-4" />
                <div className="font-display text-2xl mb-2">Customer</div>
                <div className="text-sm text-muted-foreground">Login or register to book your next adventure.</div>
              </Link>
              <Link to="/driver-login" className="group brand-card p-8 hover:border-orange hover:bg-[#FFF4F0] transition-all hover:-translate-y-1 hover:shadow-lg">
                <Car className="h-8 w-8 text-orange mx-auto mb-4" />
                <div className="font-display text-2xl mb-2">Driver</div>
                <div className="text-sm text-muted-foreground">Join our network of expert drivers.</div>
              </Link>
            </div>
          </div>
        </section>
      </Reveal>

      <SiteFooter />
      <FloatingBookButton />
    </div>
  );
}

function FeedbackForm() {
  const { user } = useAuth();
  const [tripRating, setTripRating] = useState(0);
  const [driverRating, setDriverRating] = useState(0);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto mt-10 brand-card p-6 text-center">
        <p className="text-sm text-muted-foreground">
          <Link to="/login" className="text-orange font-medium hover:underline">Sign in</Link> to leave your own review after a trip.
        </p>
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tripRating === 0 || driverRating === 0) { toast.error("Please rate both trip and driver"); return; }
    setBusy(true);
    try {
      const { data: cust } = await supabase.from("customers").select("id").eq("user_id", user.id).maybeSingle();
      if (!cust?.id) { toast.error("Customer profile not found"); return; }
      const { data: latest } = await supabase.from("bookings")
        .select("driver_id, id").eq("customer_id", cust.id).not("driver_id", "is", null)
        .order("created_at", { ascending: false }).limit(1).maybeSingle();
      if (!latest?.driver_id) { toast.error("Complete a trip first to leave a review"); return; }
      const { error } = await supabase.from("reviews").insert({
        customer_id: cust!.id, driver_id: latest.driver_id, booking_id: latest.id,
        rating: driverRating, trip_rating: tripRating, comment: text, tags: [],
      });
      if (error) throw error;
      toast.success("Thanks for your feedback!");
      setTripRating(0); setDriverRating(0); setText("");
    } catch (err: any) { toast.error(err.message); }
    finally { setBusy(false); }
  };

  return (
    <form onSubmit={submit} className="max-w-2xl mx-auto mt-10 brand-card p-8">
      <h3 className="font-display text-xl mb-5 text-center">Share your experience</h3>
      <RatingRow label="Trip rating" value={tripRating} onChange={setTripRating} />
      <RatingRow label="Driver rating" value={driverRating} onChange={setDriverRating} />
      <textarea
        value={text} onChange={(e) => setText(e.target.value)}
        placeholder="Tell us about your journey…"
        className="w-full mt-4 p-3 rounded-lg brand-input focus:outline-none min-h-[100px] text-sm"
      />
      <Button type="submit" disabled={busy} className="w-full mt-4 bg-orange text-white hover:bg-[oklch(0.76_0.15_38)] orange-glow">
        {busy ? "Sending…" : (<><Send className="h-4 w-4 mr-2" /> Submit feedback</>)}
      </Button>
    </form>
  );
}

function RatingRow({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm font-medium">{label}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" onClick={() => onChange(n)} className="transition-transform hover:scale-110" aria-label={`${n} stars`}>
            <Star className={`h-6 w-6 ${n <= value ? "fill-orange text-orange" : "text-[#E0E0DD]"}`} />
          </button>
        ))}
      </div>
    </div>
  );
}
