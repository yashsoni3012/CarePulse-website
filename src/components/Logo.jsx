import { Link } from "react-router-dom";

export default function Logo({ size = "md", light = false, linkTo = "/" }) {
  const imgSizes = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  const textSizes = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  };

  const content = (
    <div className="flex items-center gap-2.5 group">
      <div className={`relative overflow-hidden rounded-xl bg-white p-0.5 shadow-sm ring-1 ring-ink/10 transition group-hover:scale-105 ${imgSizes[size] || imgSizes.md}`}>
        <img
          src="/images/logo.jpg"
          alt="CarePulse Logo"
          className="h-full w-full object-cover rounded-[10px]"
          onError={(e) => {
            // Graceful SVG fallback if image is loading
            e.target.style.display = "none";
          }}
        />
        {/* Subtle pulse indicator */}
        <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-coral opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-coral"></span>
        </span>
      </div>

      <div className="flex flex-col leading-tight">
        <span className={`font-display font-extrabold tracking-tight ${textSizes[size] || textSizes.md} ${light ? "text-white" : "text-ink"}`}>
          Care<span className="text-coral">Pulse</span>
        </span>
        <span className={`text-[10px] font-semibold tracking-wider uppercase ${light ? "text-white/60" : "text-pine"}`}>
          Health &amp; Guidance
        </span>
      </div>
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className="focus:outline-none" aria-label="CarePulse Home">
        {content}
      </Link>
    );
  }

  return content;
}
