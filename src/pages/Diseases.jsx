import { useState } from "react";
import { Link } from "react-router-dom";
import { diseases, categories, catColor } from "../data/diseases.js";
export default function Diseases() {
  const [q, setQ] = useState(""); const [cat, setCat] = useState("All");
  const count = (c) => (c === "All" ? diseases.length : diseases.filter((d) => d.category === c).length);
  const list = diseases.filter((d) => (cat === "All" || d.category === cat) && (d.name + " " + d.symptoms.join(" ")).toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <section className="bg-ink text-white"><div className="mx-auto max-w-6xl px-5 py-14">
        <h1 className="text-4xl font-extrabold md:text-5xl">Health library</h1>
        <p className="mt-3 max-w-xl text-white/75">{diseases.length} conditions explained in plain language, with symptoms, causes, precautions and the right specialist to see.</p>
        <div className="relative mt-6 max-w-xl">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/50" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
          <input className="input !py-4 !pl-12 text-ink" placeholder="Search a disease or a symptom, for example cough" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search diseases" />
        </div>
      </div></section>
      <div className="sticky top-16 z-20 border-b border-ink/10 bg-sea/95 backdrop-blur"><div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-5 py-3">
        {categories.map((c) => <button key={c} onClick={() => setCat(c)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${cat === c ? "bg-ink text-white" : "bg-white hover:bg-ink/10"}`}>{c} <span className="opacity-60">{count(c)}</span></button>)}
      </div></div>
      <div className="mx-auto max-w-6xl px-5 py-10">
        <p className="text-sm text-ink/60">Showing {list.length} of {diseases.length}</p>
        {list.length === 0 ? <p className="mt-10 text-center text-ink/70">Nothing matches. Try a different word or choose All.</p> : (
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((d) => { const c = catColor[d.category]; return (
              <Link key={d.slug} to={`/diseases/${d.slug}`} className="group overflow-hidden rounded-2xl bg-white border border-ink/10 shadow-sm transition hover:-translate-y-1 hover:shadow-xl flex flex-col">
                <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                  <img
                    src={d.image}
                    alt={d.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/fever_care.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <span
                    className="absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-bold text-white shadow-sm"
                    style={{ background: c }}
                  >
                    {d.category}
                  </span>
                  {d.video && (
                    <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-ink/85 px-2.5 py-1 text-xs font-semibold text-white shadow backdrop-blur">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="6 4 20 12 6 20 6 4" />
                      </svg>
                      Video Guide
                    </span>
                  )}
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-xl font-bold group-hover:text-pine transition">{d.name}</h2>
                    <p className="mt-2 line-clamp-2 text-sm text-ink/70 leading-relaxed">{d.summary}</p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {d.symptoms.slice(0, 3).map((s) => (
                        <span key={s} className="rounded-full bg-sea px-2.5 py-1 text-xs font-medium text-ink/80">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-5 border-t border-ink/10 pt-4 flex items-center justify-between text-sm font-semibold text-pine">
                    <span>{d.specialist}</span>
                    <span className="flex items-center gap-1 transition group-hover:translate-x-1">
                      Read guide &amp; media
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>); })}
          </div>)}
      </div>
    </>
  );
}
