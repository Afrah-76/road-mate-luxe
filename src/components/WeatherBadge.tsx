import { useEffect, useState } from "react";
import { fetchWeather, type Weather } from "@/lib/weather";
import { Cloud, CloudRain, Sun, CloudSun, CloudFog, Snowflake, Zap, Droplets, Wind } from "lucide-react";

function iconFor(code?: number) {
  if (code === undefined) return Cloud;
  if (code === 0) return Sun;
  if (code <= 2) return CloudSun;
  if (code === 3) return Cloud;
  if (code === 45 || code === 48) return CloudFog;
  if (code >= 51 && code <= 65) return CloudRain;
  if (code >= 71 && code <= 77) return Snowflake;
  if (code >= 80 && code <= 82) return CloudRain;
  if (code >= 95) return Zap;
  return Cloud;
}

export function WeatherBadge({ lat, lon, compact = false }: { lat: number; lon: number; compact?: boolean }) {
  const [w, setW] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchWeather(lat, lon).then((d) => { if (mounted) { setW(d); setLoading(false); } });
    return () => { mounted = false; };
  }, [lat, lon]);

  const Icon = iconFor(w?.code);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <div className="h-3 w-3 rounded-full border-2 border-orange border-t-transparent animate-spin" />
        Loading weather…
      </div>
    );
  }
  if (!w) return <div className="text-xs text-muted-foreground">Weather unavailable</div>;

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <Icon className="h-4 w-4 text-orange" />
        <span className="font-medium">{w.temp}°C</span>
        <span className="text-muted-foreground">· {w.description}</span>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-orange/30 bg-[#FFF4F0] p-3">
      <div className="flex items-center gap-3">
        <Icon className="h-7 w-7 text-orange" />
        <div>
          <div className="font-display text-xl leading-none">{w.temp}°C</div>
          <div className="text-xs text-muted-foreground">{w.description}</div>
        </div>
      </div>
      <div className="mt-2 flex gap-4 text-xs text-foreground/70">
        <span className="inline-flex items-center gap-1"><Droplets className="h-3 w-3 text-orange" /> {w.humidity}%</span>
        <span className="inline-flex items-center gap-1"><Wind className="h-3 w-3 text-orange" /> {w.wind} km/h</span>
      </div>
    </div>
  );
}
