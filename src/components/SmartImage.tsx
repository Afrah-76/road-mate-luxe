import { useState, type ImgHTMLAttributes } from "react";

type Props = ImgHTMLAttributes<HTMLImageElement> & {
  thumb?: boolean; // smaller optimized variant for gallery thumbnails
};

/**
 * Image with lazy loading, shimmer skeleton, blur-up + fade-in.
 * Optimizes Unsplash URLs automatically.
 */
export function SmartImage({ src, alt = "", className = "", thumb, onLoad, ...rest }: Props) {
  const [loaded, setLoaded] = useState(false);

  const optimized = (() => {
    if (!src || typeof src !== "string") return src;
    if (!src.includes("images.unsplash.com")) return src;
    if (src.includes("auto=format")) return src;
    const sep = src.includes("?") ? "&" : "?";
    return thumb
      ? `${src}${sep}w=400&q=70&auto=format&fit=crop`
      : `${src}${sep}w=600&q=75&auto=format&fit=crop`;
  })();

  return (
    <div className={`relative overflow-hidden w-full h-full ${className}`}>
      {!loaded && (
        <div
          aria-hidden
          className="absolute inset-0 bg-[#EFEDEA]"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.06) 50%, rgba(0,0,0,0) 100%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.4s linear infinite",
          }}
        />
      )}
      <img
        {...rest}
        src={optimized as string}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={(e) => { setLoaded(true); onLoad?.(e); }}
        className="absolute inset-0 h-full w-full object-cover"
        style={{
          opacity: loaded ? 1 : 0,
          filter: loaded ? "blur(0)" : "blur(10px)",
          transform: loaded ? "scale(1)" : "scale(1.05)",
          transition: "opacity 0.5s ease, filter 0.5s ease, transform 0.5s ease",
          ...(rest.style ?? {}),
        }}
      />
    </div>
  );
}
