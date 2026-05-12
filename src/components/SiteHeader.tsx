import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/book", label: "Book" },
] as const;

export function SiteHeader() {
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-charcoal text-white border-b border-black/20">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-display text-2xl tracking-tight text-white">
            Road Mate <span className="text-orange">Tours</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm tracking-wide text-white/75 hover:text-orange transition-colors"
              activeProps={{ className: "text-orange font-medium" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
          {!user ? (
            <Link to="/login">
              <Button className="bg-orange text-white hover:bg-[oklch(0.76_0.15_38)]">
                Login
              </Button>
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <Link to={role === "driver" ? "/driver/dashboard" : "/customer/dashboard"}>
                <Button className="bg-orange text-white hover:bg-[oklch(0.76_0.15_38)]">
                  Dashboard
                </Button>
              </Link>
              <Button
                size="icon"
                variant="ghost"
                className="text-white/80 hover:text-orange hover:bg-white/10"
                onClick={async () => { await signOut(); navigate({ to: "/" }); }}
                aria-label="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </nav>

        <button className="md:hidden text-white" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav className="md:hidden border-t border-black/30 px-6 py-4 flex flex-col gap-3 bg-charcoal">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} className="text-white/85 hover:text-orange" onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          {!user ? (
            <Link to="/login" onClick={() => setOpen(false)} className="text-orange font-medium">Login</Link>
          ) : (
            <>
              <Link to={role === "driver" ? "/driver/dashboard" : "/customer/dashboard"} onClick={() => setOpen(false)} className="text-orange font-medium">
                Dashboard
              </Link>
              <button onClick={async () => { await signOut(); setOpen(false); navigate({ to: "/" }); }} className="text-left text-white/85">
                Sign out
              </button>
            </>
          )}
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-charcoal text-white/70 mt-20">
      <div className="mx-auto max-w-7xl px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
        <div className="font-display text-lg text-white">Road Mate <span className="text-orange">Tours</span></div>
        <div>© {new Date().getFullYear()} Road Mate Tours · All rights reserved.</div>
      </div>
    </footer>
  );
}
