import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/book")({
  component: BookRedirect,
});

function BookRedirect() {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (loading) return;
    if (!user) navigate({ to: "/login" });
    else if (role === "driver") navigate({ to: "/driver/dashboard" });
    else navigate({ to: "/customer/dashboard" });
  }, [loading, user, role, navigate]);
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="flex items-center justify-center py-32 text-foreground/60">Redirecting…</div>
    </div>
  );
}
