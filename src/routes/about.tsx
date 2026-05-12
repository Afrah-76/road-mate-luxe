import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Road Mate Tours" },
      { name: "description", content: "Learn about Road Mate Tours, India's premier travel agency." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="mx-auto max-w-3xl px-6 py-20 fade-up">
        <p className="text-orange tracking-[0.3em] text-xs uppercase mb-4">About</p>
        <h1 className="font-display text-4xl md:text-6xl mb-8">The road, refined.</h1>
        <div className="space-y-6 text-foreground/80 text-lg leading-relaxed">
          <p>
            Road Mate Tours was born from a simple belief — that the most memorable journeys
            are not measured in kilometres, but in moments. Every misty morning in the Western Ghats,
            every sunset over a colonial street, every cup of estate-grown coffee shared with a stranger
            who soon becomes a friend.
          </p>
          <p>
            We connect travellers with India's most accomplished drivers — locals who know every shortcut,
            every viewpoint, every roadside dhaba worth stopping at.
          </p>
          <p>
            Whether it's the tea-cloaked hills of Ooty or the bougainvillea-draped streets of Pondicherry,
            your story begins the moment the engine starts.
          </p>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
