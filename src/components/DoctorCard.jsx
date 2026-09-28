import { Link } from "react-router-dom";

export default function DoctorCard({ d }) {
  const ini = (d?.name || "").replace(/^Dr\.\s*/i, "").trim().split(/\s+/).filter(Boolean).map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "DR";

  return (
    <Link
      to={`/doctors/${d.id}`}
      className="group flex flex-col justify-between overflow-hidden rounded-3xl bg-white shadow-sm border border-ink/10 transition duration-300 hover:-translate-y-1.5 hover:shadow-xl"
    >
      <div>
        {/* Top Portrait Image Header with Uniform Dimensions */}
        <div className="relative h-56 w-full overflow-hidden bg-gradient-to-b from-sea to-white/30">
          {d.image ? (
            <img
              src={d.image}
              alt={d.name}
              className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-105"
              onError={(e) => {
                e.target.style.display = "none";
                if (e.target.nextSibling) e.target.nextSibling.style.display = "grid";
              }}
            />
          ) : null}
          <div
            className="h-full w-full place-items-center bg-gradient-to-br from-ink to-pine font-display text-4xl font-bold text-white"
            style={{ display: d.image ? "none" : "grid" }}
          >
            {ini}
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/25 pointer-events-none" />

          {/* Top Left: Specialty Badge */}
          <span className="absolute top-3 left-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-pine shadow-sm backdrop-blur">
            {d.specialization}
          </span>

          {/* Top Right: Rating Pill */}
          <span className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-xs font-bold text-amber-300 shadow backdrop-blur border border-white/10">
            ★ {d.rating} {d.reviewCount > 0 && <span className="text-[10px] text-white/80 font-normal">({d.reviewCount})</span>}
          </span>

          {/* Bottom Left: Verified Pill */}
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-pine/90 px-2.5 py-0.5 text-[11px] font-semibold text-white shadow backdrop-blur">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Verified Doctor
          </span>
        </div>

        {/* Card Body */}
        <div className="p-5">
          <h3 className="text-xl font-extrabold text-ink group-hover:text-pine transition leading-snug">
            {d.name}
          </h3>
          <p className="mt-1 text-xs font-medium text-ink/60 truncate">{d.education}</p>

          {/* Details Badges */}
          <div className="mt-3.5 flex flex-wrap gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-sea px-2.5 py-1 font-semibold text-ink/80">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
              {d.experience} yrs exp
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-sea px-2.5 py-1 font-semibold text-ink/80">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {d.city}
            </span>
          </div>

          {/* Bio Snippet */}
          {d.about && (
            <p className="mt-3 text-xs text-ink/75 line-clamp-2 leading-relaxed">
              {d.about}
            </p>
          )}
        </div>
      </div>

      {/* Card Footer: Fee & Book CTA */}
      <div className="p-5 pt-0 border-t border-ink/5 mt-2 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-ink/50 block">Fee per visit</span>
          <span className="text-lg font-black text-ink">₹{d.fee}</span>
        </div>

        <span className="inline-flex items-center gap-1 rounded-full bg-coral px-4 py-2 text-xs font-bold text-white shadow-sm transition group-hover:bg-ink">
          Book Slot
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
