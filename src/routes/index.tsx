import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero.jpg";
import ootyImg from "@/assets/ooty.jpg";
import kodaiImg from "@/assets/kodaikanal.jpg";
import munnarImg from "@/assets/munnar.jpg";
import coorgImg from "@/assets/coorg.jpg";
import pondyImg from "@/assets/pondicherry.jpg";
import { ArrowRight, Car, Star, MapPin } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Road Mate Tours — Luxury journeys across India" },
      { name: "description", content: "Curated luxury tours across South India with expert drivers — Ooty, Munnar, Coorg, Kodaikanal, Pondicherry." },
    ],
  }),
  component: HomePage,
});

const destinations = [
  {
    name: "Ooty",
    img: ootyImg,
    attractions: ["Botanical Gardens", "Doddabetta Peak", "Toy Train", "Tea Estates"],
    season: "Apr – Jun · 10–25°C",
  },
  {
    name: "Kodaikanal",
    img: kodaiImg,
    attractions: ["Kodai Lake", "Coaker's Walk", "Pillar Rocks", "Bryant Park"],
    season: "Oct – Mar · 8–20°C",
  },
  {
    name: "Munnar",
    img: munnarImg,
    attractions: ["Tea Plantations", "Eravikulam Park", "Mattupetty Dam", "Anamudi Peak"],
    season: "Sep – Mar · 12–22°C",
  },
  {
    name: "Coorg",
    img: coorgImg,
    attractions: ["Abbey Falls", "Raja's Seat", "Coffee Estates", "Dubare Elephant Camp"],
    season: "Oct – Mar · 15–25°C",
  },
  {
    name: "Pondicherry",
    img: pondyImg,
    attractions: ["French Quarter", "Promenade Beach", "Auroville", "Paradise Beach"],
    season: "Nov – Mar · 20–30°C",
  },
];

function HomePage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="" className="h-full w-full object-cover opacity-40" width={1920} height={1080} />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        </div>
        <div className="relative mx-auto max-w-6xl px-6 py-32 md:py-44 text-center fade-up">
          <p className="text-gold/80 tracking-[0.4em] text-xs uppercase mb-6">Est. Luxury Travel — India</p>
          <h1 className="font-display text-5xl md:text-7xl leading-[1.05] mb-6">
            Drive into stories <br />
            <span className="gold-gradient">worth telling.</span>
          </h1>
          <p className="mx-auto max-w-xl text-lg text-foreground/70 mb-10">
            Curated journeys across India's most enchanting destinations,
            with expert drivers who know every winding road.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/book">
              <Button size="lg" className="bg-gold text-primary-foreground hover:bg-gold-soft gold-glow px-8">
                Book a Journey <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/services">
              <Button size="lg" variant="outline" className="border-gold/40 text-gold hover:bg-gold/10 px-8">
                Explore Destinations
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="mx-auto max-w-5xl px-6 py-24 text-center fade-up">
        <p className="text-gold/80 tracking-[0.3em] text-xs uppercase mb-4">About</p>
        <h2 className="font-display text-3xl md:text-5xl mb-6">A premier name in Indian travel</h2>
        <p className="text-lg text-foreground/70 leading-relaxed">
          Road Mate Tours connects discerning travellers with India's most accomplished drivers
          and the country's most spectacular destinations. Every trip is hand-curated, every driver is vetted,
          and every memory is built to last. From the misty hills of the Western Ghats to the colonial charm
          of Pondicherry — the open road has never felt this refined.
        </p>
      </section>

      {/* SERVICES */}
      <section id="services" className="mx-auto max-w-7xl px-6 py-24">
        <div className="text-center mb-16 fade-up">
          <p className="text-gold/80 tracking-[0.3em] text-xs uppercase mb-4">Destinations</p>
          <h2 className="font-display text-3xl md:text-5xl">Where shall we take you?</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((d) => (
            <article key={d.name} className="group glass-card rounded-xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:gold-glow">
              <div className="relative h-56 overflow-hidden">
                <img
                  src={d.img}
                  alt={d.name}
                  width={1024}
                  height={768}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                <h3 className="absolute bottom-4 left-5 font-display text-3xl">{d.name}</h3>
              </div>
              <div className="p-6">
                <div className="flex items-start gap-2 text-sm text-foreground/70 mb-4">
                  <MapPin className="h-4 w-4 text-gold mt-0.5 flex-shrink-0" />
                  <span>{d.attractions.join(" · ")}</span>
                </div>
                <div className="text-xs text-gold/90 tracking-wider uppercase">
                  Best time to visit · {d.season}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-16">
          <Link to="/book">
            <Button size="lg" className="bg-gold text-primary-foreground hover:bg-gold-soft gold-glow px-10">
              Book Now <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* USER TYPE */}
      <section className="mx-auto max-w-5xl px-6 py-24">
        <div className="glass-card rounded-2xl p-10 md:p-14 text-center">
          <h2 className="font-display text-3xl md:text-4xl mb-3">Are you a Customer or a Driver?</h2>
          <p className="text-foreground/60 mb-10">Choose your path to begin your journey with us.</p>
          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Link to="/login" className="group glass-card rounded-xl p-8 hover:gold-glow transition-all">
              <Star className="h-8 w-8 text-gold mx-auto mb-4" />
              <div className="font-display text-2xl mb-2">Customer</div>
              <div className="text-sm text-foreground/60">Login or register to book your next adventure.</div>
            </Link>
            <Link to="/driver-login" className="group glass-card rounded-xl p-8 hover:gold-glow transition-all">
              <Car className="h-8 w-8 text-gold mx-auto mb-4" />
              <div className="font-display text-2xl mb-2">Driver</div>
              <div className="text-sm text-foreground/60">Join our network of expert drivers across India.</div>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 py-10 text-center text-sm text-foreground/50">
        © {new Date().getFullYear()} Road Mate Tours · Crafted with care.
      </footer>
    </div>
  );
}
