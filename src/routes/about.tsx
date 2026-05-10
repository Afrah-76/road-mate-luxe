import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Road Mate Tours" },
      { name: "description", content: "Learn about Road Mate Tours, India's premier luxury travel agency." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-3xl px-6 py-24 fade-up">
        <p className="text-gold/80 tracking-[0.3em] text-xs uppercase mb-4">About</p>
        <h1 className="font-display text-4xl md:text-6xl mb-8">The road, refined.</h1>
        <div className="space-y-6 text-foreground/75 text-lg leading-relaxed">
          <p>
            Road Mate Tours was born from a simple belief — that the most memorable journeys
            are not measured in kilometres, but in moments. Every misty morning in the
            Western Ghats, every sunset over a colonial street, every cup of estate-grown
            coffee shared with a stranger who soon becomes a friend.
          </p>
          <p>
            We connect travellers with India's most accomplished drivers — locals who know
            every shortcut, every viewpoint, every roadside dhaba worth stopping at. Each
            tour is curated to your taste, your pace, and your sense of wonder.
          </p>
          <p>
            Whether it's the tea-cloaked hills of Ooty or the bougainvillea-draped streets
            of Pondicherry, your story begins the moment the engine starts.
          </p>
        </div>
      </section>
    </div>
  );
}
