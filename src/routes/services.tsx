import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { WeatherBadge } from "@/components/WeatherBadge";
import { PLACES } from "@/lib/places";
import { MapPin } from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Tamil Nadu Destinations — Road Mate Tours" },
      { name: "description", content: "Explore Ooty, Kodaikanal, Rameswaram, Madurai, Kanyakumari, Mahabalipuram and more — with live climate updates." },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="mx-auto max-w-7xl px-6 py-20">
        <Reveal>
          <div className="text-center mb-14">
            <p className="text-orange tracking-[0.3em] text-xs uppercase mb-4">Destinations</p>
            <h1 className="font-display text-4xl md:text-6xl">Tamil Nadu, the way it should be seen</h1>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">Twelve handpicked destinations with live climate updates and curated travel guides.</p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PLACES.map((p, idx) => (
            <Reveal key={p.slug} delay={(idx % 3) * 80}>
              <article className="group brand-card overflow-hidden h-full flex flex-col transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:orange-glow hover:border-orange">
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={`https://source.unsplash.com/featured/800x600/?${encodeURIComponent(p.name + ",tamilnadu")}`}
                    alt={p.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <h3 className="absolute bottom-4 left-5 font-display text-2xl text-white">{p.name}</h3>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <p className="text-sm text-muted-foreground mb-4">{p.description}</p>
                  <div className="mb-5">
                    <div className="text-[10px] tracking-[0.25em] uppercase text-orange font-medium mb-2">Current climate & conditions</div>
                    <WeatherBadge lat={p.lat} lon={p.lon} />
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
          <Link to="/book"><Button size="lg" className="bg-orange text-white hover:bg-[oklch(0.76_0.15_38)] orange-glow px-10">Book Now</Button></Link>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
