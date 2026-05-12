import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import ootyImg from "@/assets/ooty.jpg";
import kodaiImg from "@/assets/kodaikanal.jpg";
import munnarImg from "@/assets/munnar.jpg";
import coorgImg from "@/assets/coorg.jpg";
import pondyImg from "@/assets/pondicherry.jpg";
import { MapPin } from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Destinations — Road Mate Tours" },
      { name: "description", content: "Explore curated destinations: Ooty, Kodaikanal, Munnar, Coorg, Pondicherry." },
    ],
  }),
  component: ServicesPage,
});

const destinations = [
  { name: "Ooty", img: ootyImg, attractions: ["Botanical Gardens", "Doddabetta Peak", "Toy Train", "Tea Estates"], season: "Apr – Jun · 10–25°C" },
  { name: "Kodaikanal", img: kodaiImg, attractions: ["Kodai Lake", "Coaker's Walk", "Pillar Rocks", "Bryant Park"], season: "Oct – Mar · 8–20°C" },
  { name: "Munnar", img: munnarImg, attractions: ["Tea Plantations", "Eravikulam Park", "Mattupetty Dam", "Anamudi Peak"], season: "Sep – Mar · 12–22°C" },
  { name: "Coorg", img: coorgImg, attractions: ["Abbey Falls", "Raja's Seat", "Coffee Estates", "Dubare Elephant Camp"], season: "Oct – Mar · 15–25°C" },
  { name: "Pondicherry", img: pondyImg, attractions: ["French Quarter", "Promenade Beach", "Auroville", "Paradise Beach"], season: "Nov – Mar · 20–30°C" },
];

function ServicesPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center mb-14 fade-up">
          <p className="text-orange tracking-[0.3em] text-xs uppercase mb-4">Destinations</p>
          <h1 className="font-display text-4xl md:text-6xl">Curated by us, loved by you</h1>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((d) => (
            <article key={d.name} className="group brand-card overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:orange-glow hover:border-orange">
              <div className="relative h-56 overflow-hidden">
                <img src={d.img} alt={d.name} width={1024} height={768} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <h3 className="absolute bottom-4 left-5 font-display text-3xl text-white">{d.name}</h3>
              </div>
              <div className="p-6">
                <div className="flex items-start gap-2 text-sm text-muted-foreground mb-4">
                  <MapPin className="h-4 w-4 text-orange mt-0.5 flex-shrink-0" />
                  <span>{d.attractions.join(" · ")}</span>
                </div>
                <div className="text-xs text-orange tracking-wider uppercase font-medium">Best time to visit · {d.season}</div>
              </div>
            </article>
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
