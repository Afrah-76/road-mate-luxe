import { useEffect, useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const REVIEWS = [
  { name: "Rajesh Kumar", rating: 5, text: "Amazing experience! The driver was very professional and the ride to Ooty was smooth and comfortable. Highly recommend Road Mate Tours!" },
  { name: "Priya Sharma", rating: 5, text: "Booked a trip to Kodaikanal and it was perfect. Clean vehicle, friendly driver, and on-time pickup. Will definitely book again!" },
  { name: "Arun Selvam", rating: 4, text: "Good service overall. The tempo traveller was spacious for our family trip to Rameswaram. Driver was courteous and helpful." },
  { name: "Meena Lakshmi", rating: 5, text: "Best travel service in Tamil Nadu! Road Mate Tours made our Kanyakumari trip unforgettable. Great driver, great vehicle!" },
  { name: "Vikram Nair", rating: 4, text: "Very reliable service. Booked a cab to Mahabalipuram and everything went as planned. Will use again for future trips." },
];

export function ReviewsCarousel() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setI((p) => (p + 1) % REVIEWS.length), 5000);
    return () => clearInterval(t);
  }, [paused]);

  const r = REVIEWS[i];
  return (
    <div className="relative max-w-3xl mx-auto" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="brand-card p-8 md:p-12 text-center min-h-[260px] flex flex-col justify-center">
        <div className="flex justify-center gap-1 mb-4">
          {Array.from({ length: 5 }).map((_, k) => (
            <Star key={k} className={`h-5 w-5 ${k < r.rating ? "fill-orange text-orange" : "text-[#E0E0DD]"}`} />
          ))}
        </div>
        <p className="text-lg md:text-xl text-foreground/85 italic mb-6 transition-opacity duration-500" key={i}>
          “{r.text}”
        </p>
        <div className="font-display text-lg">{r.name}</div>
      </div>
      <button onClick={() => setI((p) => (p - 1 + REVIEWS.length) % REVIEWS.length)}
        aria-label="Previous"
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 md:-translate-x-6 bg-white border border-[color:var(--border)] rounded-full p-2 shadow hover:border-orange hover:text-orange">
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button onClick={() => setI((p) => (p + 1) % REVIEWS.length)}
        aria-label="Next"
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 md:translate-x-6 bg-white border border-[color:var(--border)] rounded-full p-2 shadow hover:border-orange hover:text-orange">
        <ChevronRight className="h-5 w-5" />
      </button>
      <div className="flex justify-center gap-2 mt-5">
        {REVIEWS.map((_, k) => (
          <button key={k} onClick={() => setI(k)} aria-label={`Review ${k + 1}`}
            className={`h-1.5 rounded-full transition-all ${k === i ? "w-8 bg-orange" : "w-2 bg-[#E0E0DD]"}`} />
        ))}
      </div>
    </div>
  );
}
