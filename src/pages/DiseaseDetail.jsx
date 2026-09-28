import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { diseases, catColor } from "../data/diseases.js";
import { useAuth } from "../context/AuthContext.jsx";
import DoctorCard from "../components/DoctorCard.jsx";
import DiseaseVideoSection from "../components/DiseaseVideoSection.jsx";
import DiseaseGallery from "../components/DiseaseGallery.jsx";

const tabs = [
  ["symptoms", "Symptoms"],
  ["causes", "Causes"],
  ["precautions", "Precautions"],
  ["video-guide", "Video guide"],
  ["visual-guide", "Visual images"],
  ["see-doctor", "See a doctor"],
  ["doctors", "Doctors"],
];

export default function DiseaseDetail() {
  const { slug } = useParams();
  const { doctors } = useAuth();
  const [done, setDone] = useState({});

  const d = diseases.find((x) => x.slug === slug);
  if (!d) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-16">
        <p className="text-lg">Disease not found.</p>
        <Link to="/diseases" className="mt-3 inline-block font-semibold text-pine hover:underline">
          Back to library
        </Link>
      </div>
    );
  }

  const c = catColor[d.category] || "#0F7C7A";
  const ticks = done[slug] || [];
  const tick = (p) =>
    setDone({
      ...done,
      [slug]: ticks.includes(p) ? ticks.filter((x) => x !== p) : [...ticks, p],
    });

  const docs = (doctors || []).filter((x) => x.specialization === d.specialist).slice(0, 3);
  const related = diseases
    .filter((x) => x.slug !== slug && x.category === d.category)
    .concat(diseases.filter((x) => x.slug !== slug && x.category !== d.category))
    .slice(0, 3);

  const precCount = d.precautions?.length || 1;
  const pct = Math.round((ticks.length / precCount) * 100);

  return (
    <>
      {/* Hero Section with Disease Imagery */}
      <section className="bg-ink text-white" style={{ borderBottom: `6px solid ${c}` }}>
        <div className="mx-auto max-w-6xl px-5 py-12">
          <Link to="/diseases" className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to library
          </Link>

          <div className="mt-6 grid items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="rounded-full px-3.5 py-1 text-xs font-bold tracking-wide"
                  style={{ background: c, color: "#fff" }}
                >
                  {d.category}
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/90">
                  {d.badge || "Verified Guide"}
                </span>
              </div>

              <h1 className="mt-4 text-4xl font-extrabold md:text-5xl">{d.name}</h1>
              <p className="mt-3 max-w-2xl text-lg text-white/80 leading-relaxed">{d.summary}</p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  ["Usual duration", d.duration],
                  ["Contagious", d.contagious],
                  ["Best specialist", d.specialist],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-2xl bg-white/10 p-4 border border-white/5">
                    <p className="text-xs text-white/60">{k}</p>
                    <p className="mt-1 font-semibold">{v}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href="#video-guide"
                  className="inline-flex items-center gap-2 rounded-full bg-coral px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-white hover:text-ink"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  Watch Video Guide
                </a>
                <a
                  href="#visual-guide"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  View Clinical Images
                </a>
              </div>
            </div>

            {/* Featured Image Banner */}
            <div className="lg:col-span-5">
              <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/5 shadow-2xl group">
                <img
                  src={d.image}
                  alt={`${d.name} illustration`}
                  className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/images/fever_care.jpg";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent flex items-end p-5">
                  <div>
                    <span className="rounded-md bg-coral px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white">
                      Clinical Visual Guide
                    </span>
                    <p className="mt-1 text-sm font-medium text-white/90">
                      Visual checkpoints for symptoms, home recovery, and medical care
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Tab Nav */}
      <nav className="sticky top-16 z-20 border-b border-ink/10 bg-sea/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl gap-2 overflow-x-auto px-5 py-3">
          {tabs.map(([id, t]) => (
            <a
              key={id}
              href={`#${id}`}
              className="shrink-0 rounded-full bg-white px-4 py-2 text-sm font-medium text-ink shadow-sm transition hover:bg-ink hover:text-white"
            >
              {t}
            </a>
          ))}
        </div>
      </nav>

      {/* Main Detail Content */}
      <div className="mx-auto max-w-5xl space-y-14 px-5 py-12">
        {/* Symptoms */}
        <section id="symptoms" className="scroll-mt-32">
          <h2 className="text-2xl font-bold">Common symptoms</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {(d.symptoms || []).map((s) => (
              <div key={s} className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm border border-ink/5">
                <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: c }} />
                <span className="font-medium text-ink">{s}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Causes */}
        <section id="causes" className="scroll-mt-32">
          <h2 className="text-2xl font-bold">What causes it</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-3">
            {(d.causes || []).map((s) => (
              <li key={s} className="rounded-2xl bg-white p-4 shadow-sm border border-ink/5 text-ink/85 leading-relaxed">
                {s}
              </li>
            ))}
          </ul>
        </section>

        {/* Precautions */}
        <section id="precautions" className="scroll-mt-32">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <h2 className="text-2xl font-bold">Precautions checklist</h2>
            <p className="text-sm font-medium text-ink/60">
              {ticks.length} of {d.precautions?.length || 0} completed
            </p>
          </div>
          <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white shadow-inner">
            <div className="h-full bg-pine transition-all duration-300" style={{ width: `${pct}%` }} />
          </div>
          <ul className="mt-4 space-y-3">
            {(d.precautions || []).map((p) => (
              <li key={p}>
                <label
                  className={`flex cursor-pointer items-center gap-3 rounded-2xl p-4 transition border shadow-sm ${
                    ticks.includes(p)
                      ? "bg-pine text-white border-pine"
                      : "bg-white text-ink border-ink/5 hover:border-ink/20"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="h-5 w-5 accent-coral cursor-pointer"
                    checked={ticks.includes(p)}
                    onChange={() => tick(p)}
                  />
                  <span className={`font-medium ${ticks.includes(p) ? "line-through opacity-85" : ""}`}>
                    {p}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </section>

        {/* Video Guide Section */}
        <DiseaseVideoSection disease={d} />

        {/* Visual Images & Infographics Gallery */}
        <DiseaseGallery gallery={d.gallery} categoryColor={c} diseaseName={d.name} />

        {/* See Doctor Warning */}
        <section id="see-doctor" className="scroll-mt-32 rounded-3xl border-2 border-coral/50 bg-coral/10 p-6 md:p-8">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-coral text-white">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </span>
            <h2 className="text-2xl font-bold text-ink">See a doctor immediately if</h2>
          </div>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-ink/90 leading-relaxed">
            {(d.doctor || []).map((s) => (
              <li key={s} className="font-medium">{s}</li>
            ))}
          </ul>
          <p className="mt-5 text-sm font-medium text-ink/75 border-t border-coral/20 pt-4">
            In a medical emergency call your local emergency number (112 in India) or visit the nearest emergency department.
          </p>
        </section>

        {/* Specialist Booking */}
        <section id="doctors" className="scroll-mt-32">
          <div className="flex flex-wrap items-end justify-between gap-2 border-b border-ink/10 pb-4">
            <div>
              <h2 className="text-2xl font-bold">Book a verified {d.specialist}</h2>
              <p className="mt-1 text-sm text-ink/65">
                Consult verified clinicians specializing in {d.category.toLowerCase()} treatments.
              </p>
            </div>
            <Link
              to={`/doctors?spec=${encodeURIComponent(d.specialist)}`}
              className="font-semibold text-pine hover:underline flex items-center gap-1"
            >
              See all specialists
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          </div>
          {docs.length ? (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {docs.map((x) => (
                <DoctorCard key={x.id} d={x} />
              ))}
            </div>
          ) : (
            <p className="mt-6 text-ink/70 bg-white rounded-2xl p-6 text-center border border-ink/10">
              No {d.specialist} is registered yet. Browse our full directory of doctors.
            </p>
          )}
        </section>

        {/* Related Conditions */}
        <section className="border-t border-ink/10 pt-10">
          <h2 className="text-2xl font-bold">Explore related conditions</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            {related.map((r) => (
              <Link
                key={r.slug}
                to={`/diseases/${r.slug}`}
                className="group overflow-hidden rounded-2xl bg-white border border-ink/10 shadow-sm transition hover:-translate-y-1 hover:shadow-lg flex flex-col"
              >
                <div className="h-32 w-full overflow-hidden bg-sea/50">
                  <img
                    src={r.image}
                    alt={r.name}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/fever_care.jpg";
                    }}
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-semibold" style={{ color: catColor[r.category] }}>
                      {r.category}
                    </span>
                    <h3 className="mt-1 font-bold text-ink group-hover:text-pine transition">{r.name}</h3>
                    <p className="mt-1 line-clamp-2 text-xs text-ink/70 leading-relaxed">{r.summary}</p>
                  </div>
                  <span className="mt-4 text-xs font-semibold text-pine flex items-center gap-1">
                    Read guide
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
