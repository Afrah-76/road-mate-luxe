import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { WeatherBadge } from "@/components/WeatherBadge";
import { Reveal } from "@/components/Reveal";
import { findPlace, PLACES } from "@/lib/places";
import { ArrowLeft, MapPin, Camera } from "lucide-react";

export const Route = createFileRoute("/places/$slug")({
  head: ({ params }) => {
    const p = findPlace(params.slug);
    const title = p ? `${p.name} — Road Mate Tours` : "Place — Road Mate Tours";
    const description = p?.description ?? "Travel guide for Tamil Nadu destinations.";
    return { meta: [{ title }, { name: "description", content: description }] };
  },
  component: PlaceDetail,
  notFoundComponent: () => (
    <div className="min-h-screen bg-background"><SiteHeader />
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="font-display text-3xl mb-3">Place not found</h1>
        <Link to="/services" className="text-orange">Back to destinations</Link>
      </div>
    </div>
  ),
});

function PlaceDetail() {
  const { slug } = Route.useParams();
  const place = findPlace(slug);
  if (!place) throw notFound();

  const mapSrc = `https://www.google.com/maps?q=${place.lat},${place.lon}&z=12&output=embed`;
  const galleryImages = place.gallery;
  const galleryCaptions = [place.name, ...place.spots.slice(0, 4)];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-6 py-10">
        <Link to="/services" className="inline-flex items-center gap-2 text-orange hover:opacity-80 mb-6 text-sm">
          <ArrowLeft className="h-4 w-4" /> All destinations
        </Link>

        <Reveal>
          <div className="brand-card overflow-hidden mb-8">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="aspect-[4/3] md:aspect-auto bg-[#FFF4F0]">
                <img
                  src={`https://source.unsplash.com/featured/1200x900/?${encodeURIComponent(place.name + ",india,travel")}`}
                  alt={place.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-6 md:p-10 flex flex-col">
                <p className="text-orange tracking-[0.3em] text-xs uppercase mb-3">Tamil Nadu</p>
                <h1 className="font-display text-3xl md:text-5xl mb-3">{place.name}</h1>
                <p className="text-muted-foreground mb-5">{place.description}</p>
                <div className="mb-6"><WeatherBadge lat={place.lat} lon={place.lon} /></div>
                <Link to="/book" className="mt-auto">
                  <Button className="bg-orange text-white hover:bg-[oklch(0.76_0.15_38)] orange-glow w-full">
                    Book a Ride to {place.name.split(" ")[0]}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div className="brand-card overflow-hidden">
              <div className="p-5 border-b border-[color:var(--border)] flex items-center gap-2">
                <MapPin className="h-4 w-4 text-orange" />
                <span className="font-medium">Location</span>
              </div>
              <iframe
                title={`Map of ${place.name}`}
                src={mapSrc}
                className="w-full h-72 border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="brand-card p-6">
              <h2 className="font-display text-2xl mb-4">Top 5 spots to visit</h2>
              <ol className="space-y-3">
                {place.spots.slice(0, 5).map((s, i) => (
                  <li key={s} className="flex items-start gap-3">
                    <span className="h-7 w-7 flex-shrink-0 rounded-full bg-orange text-white text-sm grid place-items-center font-medium">{i + 1}</span>
                    <span className="text-foreground/85">{s}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div className="mb-10">
            <h2 className="font-display text-2xl mb-4 flex items-center gap-2">
              <Camera className="h-5 w-5 text-orange" /> Photo gallery
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {galleryQueries.map((q, i) => (
                <div key={i} className="aspect-[4/3] overflow-hidden rounded-xl border border-[color:var(--border)] group">
                  <img
                    src={`https://source.unsplash.com/featured/800x600/?${encodeURIComponent(q + ",tamilnadu,india")}&sig=${i}`}
                    alt={q}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>
      <SiteFooter />
    </div>
  );
}

export const _placesIndex = PLACES;
