import { Link, useLocation } from "@tanstack/react-router";
import { Calendar } from "lucide-react";

export function FloatingBookButton() {
  const loc = useLocation();
  if (loc.pathname.startsWith("/book")) return null;
  return (
    <Link
      to="/book"
      className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full bg-orange text-white px-5 py-3 shadow-lg orange-glow hover:bg-[oklch(0.76_0.15_38)] transition-transform hover:scale-105 animate-pulse-slow"
      aria-label="Book Now"
    >
      <Calendar className="h-4 w-4" />
      <span className="font-medium hidden sm:inline">Book Now</span>
    </Link>
  );
}
