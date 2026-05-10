import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/book", label: "Book Now" },
] as const;

export function SiteHeader() {
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[oklch(0.18_0.04_255_/_0.7)] border-b border-white/5">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="font-display text-2xl tracking-tight">
            <span className="gold-gradient">Road Mate</span>
            <span className="text-foreground/90"> Tours</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm tracking-wide text-foreground/70 hover:text-gold transition-colors"
              activeProps={{ className: "text-gold" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
          {!user ? (
            <Link to="/login">
              <Button variant="outline" className="border-gold/40 text-gold hover:bg-gold hover:text-primary-foreground">
                Login
              </Button>
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <Link to={role === "driver" ? "/driver/dashboard" : "/customer/dashboard"}>
                <Button variant="outline" className="border-gold/40 text-gold hover:bg-gold hover:text-primary-foreground">
                  Dashboard
                </Button>
              </Link>
              <Button
                size="icon"
                variant="ghost"
                onClick={async () => { await signOut(); navigate({ to: "/" }); }}
                aria-label="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </nav>

        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav className="md:hidden border-t border-white/5 px-6 py-4 flex flex-col gap-3 bg-background/95">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} className="text-foreground/80 hover:text-gold" onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          {!user ? (
            <Link to="/login" onClick={() => setOpen(false)} className="text-gold">Login</Link>
          ) : (
            <>
              <Link to={role === "driver" ? "/driver/dashboard" : "/customer/dashboard"} onClick={() => setOpen(false)} className="text-gold">
                Dashboard
              </Link>
              <button onClick={async () => { await signOut(); setOpen(false); navigate({ to: "/" }); }} className="text-left text-foreground/80">
                Sign out
              </button>
            </>
          )}
        </nav>
      )}
    </header>
  );
}
