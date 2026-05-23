import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, X, Mail, Phone, MapPin, Facebook, Instagram, Youtube, MessageCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 80) setHidden(false);
      else if (y > lastY.current + 6) setHidden(true);
      else if (y < lastY.current - 6) setHidden(false);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 bg-charcoal text-white border-b border-black/20 transition-transform duration-300 ${hidden ? "-translate-y-full" : "translate-y-0"}`}>
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
              className="nav-link text-sm tracking-wide text-white/75 hover:text-orange transition-colors"
              activeProps={{ className: "text-orange font-medium" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
          {!user ? (
            <Link to="/login">
              <Button className="bg-orange text-white hover:bg-[oklch(0.76_0.15_38)]">Login</Button>
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <Link to={role === "driver" ? "/driver/dashboard" : "/customer/dashboard"}>
                <Button className="bg-orange text-white hover:bg-[oklch(0.76_0.15_38)]">Dashboard</Button>
              </Link>
              <Button
                size="icon" variant="ghost"
                className="text-white/80 hover:text-orange hover:bg-white/10"
                onClick={async () => { await signOut(); navigate({ to: "/" }); }}
                aria-label="Sign out"
              ><LogOut className="h-4 w-4" /></Button>
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
              <Link to={role === "driver" ? "/driver/dashboard" : "/customer/dashboard"} onClick={() => setOpen(false)} className="text-orange font-medium">Dashboard</Link>
              <button onClick={async () => { await signOut(); setOpen(false); navigate({ to: "/" }); }} className="text-left text-white/85">Sign out</button>
            </>
          )}
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-charcoal text-white/75 mt-20">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Company */}
          <div>
            <div className="font-display text-2xl text-white mb-2">Road Mate <span className="text-orange">Tours</span></div>
            <p className="text-sm text-white/65 mb-5">Your Trusted Travel Partner Across Tamil Nadu.</p>
            <div className="space-y-2 text-sm">
              <a href="mailto:roadmates@gmail.com" className="flex items-center gap-2 hover:text-orange">
                <Mail className="h-4 w-4 text-orange" /> roadmates@gmail.com
              </a>
              <a href="tel:+919876543210" className="flex items-center gap-2 hover:text-orange">
                <Phone className="h-4 w-4 text-orange" /> +91 98765 43210
              </a>
              <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-orange" /> Tamil Nadu, India</div>
            </div>
            <div className="flex gap-3 mt-5">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="p-2 rounded-full border border-white/15 hover:border-orange hover:text-orange hover:scale-110 transition-transform duration-300"><Facebook className="h-4 w-4" /></a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="p-2 rounded-full border border-white/15 hover:border-orange hover:text-orange hover:scale-110 transition-transform duration-300"><Instagram className="h-4 w-4" /></a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube" className="p-2 rounded-full border border-white/15 hover:border-orange hover:text-orange hover:scale-110 transition-transform duration-300"><Youtube className="h-4 w-4" /></a>
              <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" aria-label="WhatsApp" className="p-2 rounded-full border border-white/15 hover:border-orange hover:text-orange hover:scale-110 transition-transform duration-300"><MessageCircle className="h-4 w-4" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-medium mb-4 text-sm tracking-wider uppercase">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-orange">Home</Link></li>
              <li><Link to="/services" className="hover:text-orange">Services</Link></li>
              <li><Link to="/services" className="hover:text-orange">Places</Link></li>
              <li><Link to="/book" className="hover:text-orange">Book a Ride</Link></li>
              <li><Link to="/driver-login" className="hover:text-orange">Driver Login</Link></li>
              <li><Link to="/login" className="hover:text-orange">Customer Login</Link></li>
              <li><Link to="/about" className="hover:text-orange">Contact Us</Link></li>
            </ul>
          </div>

          {/* Vehicles */}
          <div>
            <h4 className="text-white font-medium mb-4 text-sm tracking-wider uppercase">Vehicles We Offer</h4>
            <ul className="space-y-2 text-sm text-white/65">
              <li>Car</li><li>SUV</li><li>Van</li><li>Bus</li><li>Tempo Traveller</li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-medium mb-4 text-sm tracking-wider uppercase">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-orange">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-orange">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-orange">Cancellation Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 text-xs text-white/55 text-center">
          © 2025 Road Mate Tours. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
