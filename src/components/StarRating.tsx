import { Star } from "lucide-react";

export function StarRating({ value, onChange, size = 28 }: { value: number; onChange: (v: number) => void; size?: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className="transition-transform hover:scale-110"
          aria-label={`${n} stars`}
        >
          <Star
            style={{ width: size, height: size }}
            className={n <= value ? "fill-[#FF5733] text-[#FF5733]" : "text-[#E0E0DD]"}
          />
        </button>
      ))}
    </div>
  );
}
