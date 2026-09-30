import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import DoctorCard from "../components/DoctorCard.jsx";

export default function Doctors() {
  const { doctors } = useAuth();
  const [sp, setSp] = useSearchParams();
  const [q, setQ] = useState("");
  const [sortBy, setSortBy] = useState("rating");

  const spec = sp.get("spec") || "All";
  const specs = ["All", ...new Set(doctors.map((d) => d.specialization))];

  const filteredDoctors = useMemo(() => {
    return doctors
      .filter((d) => {
        const matchesSpec = spec === "All" || d.specialization === spec;
        const searchableText = `${d.name} ${d.city || ""} ${d.clinic_address || ""} ${d.clinic_name || ""} ${d.specialization} ${d.qualification || ""} ${d.registration_number || ""}`.toLowerCase();
        const matchesQuery = searchableText.includes(q.toLowerCase().trim());
        return matchesSpec && matchesQuery;
      })
      .sort((a, b) => {
        if (sortBy === "fee-asc") return a.fee - b.fee;
        if (sortBy === "fee-desc") return b.fee - a.fee;
        if (sortBy === "exp") return b.experience - a.experience;
        return b.rating - a.rating; // default: rating
      });
  }, [doctors, spec, q, sortBy]);

  const countForSpec = (s) => (s === "All" ? doctors.length : doctors.filter((d) => d.specialization === s).length);

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      {/* Header Banner */}
      <div className="rounded-3xl bg-ink p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-coral/20 px-3 py-1 text-xs font-bold text-coral uppercase tracking-wider">
              Verified Healthcare Directory
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live API Synced
            </span>
          </div>
          <h1 className="mt-4 text-3xl font-extrabold md:text-5xl tracking-tight">
            Consult Qualified Specialists
          </h1>
          <p className="mt-3 text-sm md:text-base text-white/80 leading-relaxed">
            Connect with verified clinicians from our medical registry. Compare clinical experience, patient reviews, and book direct consultation slots instantly.
          </p>
        </div>

        {/* Search & Sort Controls inside Hero */}
        <div className="mt-8 grid gap-3 sm:grid-cols-12 relative z-10">
          <div className="relative sm:col-span-8">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/50"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              className="input !py-3.5 !pl-12 text-ink text-sm bg-white"
              placeholder="Search doctor by name, specialty, or city (e.g. Ahmedabad, Surat)..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label="Search doctors"
            />
            {q && (
              <button
                type="button"
                onClick={() => setQ("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink text-xs font-bold bg-ink/10 rounded-full h-5 w-5 grid place-items-center"
              >
                ✕
              </button>
            )}
          </div>

          <div className="sm:col-span-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input !py-3.5 text-sm text-ink bg-white font-medium cursor-pointer"
              aria-label="Sort doctors"
            >
              <option value="rating">Sort by: Top Rated ★</option>
              <option value="exp">Sort by: Highest Experience</option>
              <option value="fee-asc">Sort by: Consultation Fee (Low to High)</option>
              <option value="fee-desc">Sort by: Consultation Fee (High to Low)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Specialty Filter Tabs */}
      <div className="sticky top-16 z-20 -mx-5 px-5 py-4 border-b border-ink/10 bg-sea/95 backdrop-blur mt-8">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {specs.map((s) => (
            <button
              key={s}
              onClick={() => setSp(s === "All" ? {} : { spec: s })}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition ${
                spec === s
                  ? "bg-ink text-white shadow-sm"
                  : "bg-white text-ink/80 hover:bg-white/80 border border-ink/5"
              }`}
            >
              {s} <span className="opacity-60 ml-1">({countForSpec(s)})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Results Count & Active Filters */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 text-sm text-ink/70">
        <p className="font-medium">
          Showing <span className="font-bold text-ink">{filteredDoctors.length}</span> of {doctors.length} verified {doctors.length === 1 ? "doctor" : "doctors"}
          {spec !== "All" && <span> in <strong className="text-pine">{spec}</strong></span>}
          {q && <span> matching "<strong className="text-ink">{q}</strong>"</span>}
        </p>

        {(spec !== "All" || q) && (
          <button
            onClick={() => {
              setSp({});
              setQ("");
            }}
            className="text-xs font-bold text-coral hover:underline"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Doctor Cards Grid */}
      {filteredDoctors.length === 0 ? (
        <div className="mt-12 rounded-3xl bg-white p-12 text-center border border-ink/10 shadow-sm max-w-lg mx-auto">
          <span className="text-4xl">🩺</span>
          <h3 className="mt-3 text-lg font-bold text-ink">No doctors matched your search</h3>
          <p className="mt-1 text-xs text-ink/70">Try searching another city or clearing your specialty filter.</p>
          <button
            onClick={() => {
              setSp({});
              setQ("");
            }}
            className="btn mt-4 !py-2 text-xs"
          >
            Reset search
          </button>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDoctors.map((d) => (
            <DoctorCard key={d.id} d={d} />
          ))}
        </div>
      )}

      {/* Doctor Registration CTA */}
      <div className="mt-16 rounded-3xl bg-sea p-8 border border-ink/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-pine">Are you a Medical Doctor?</span>
          <h2 className="mt-1 text-xl font-bold text-ink">Join CarePulse to offer direct patient appointments</h2>
          <p className="mt-1 text-xs text-ink/70 max-w-xl">
            Create a professional doctor profile in 1 minute, upload your clinic photo, customize consultation fees, and manage slots online.
          </p>
        </div>
        <Link to="/register" className="btn shrink-0 !py-3 !px-6">
          Register as Doctor
        </Link>
      </div>
    </div>
  );
}
