import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { diseases } from "../data/diseases.js";
import { useAuth } from "../context/AuthContext.jsx";

function useInView() {
  const ref = useRef(null); const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: 0.05 });
    io.observe(el); return () => io.disconnect();
  }, []);
  return [ref, seen];
}
function CountUp({ to }) {
  const [ref, seen] = useInView(); const [n, setN] = useState(to);
  useEffect(() => {
    if (!seen) return; let raf, t0;
    const step = (t) => { t0 = t0 ?? t; const p = Math.min((t - t0) / 1400, 1); setN(Math.round(to * p)); if (p < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step); return () => cancelAnimationFrame(raf);
  }, [seen, to]);
  return <span ref={ref}>{n}</span>;
}
const name = (slug) => diseases.find((d) => d.slug === slug)?.name;

export function StatsStrip() {
  const { doctors } = useAuth();
  const items = [[diseases.length, "Condition guides"], [doctors.length, "Doctors on CarePulse"], [new Set(doctors.map((d) => d.specialization)).size, "Specialties"], [6, "Slots per doctor, every day"]];
  return (
    <section className="mx-auto -mt-1 max-w-6xl px-5 py-10">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {items.map(([n, l]) => <div key={l} className="border-l-4 border-coral pl-4"><p className="font-display text-4xl font-extrabold"><CountUp to={n} /></p><p className="text-sm text-ink/70">{l}</p></div>)}
      </div>
    </section>
  );
}

const SYM = { Fever: ["fever", "dengue", "typhoid", "influenza", "malaria", "chickenpox", "pneumonia"], Cough: ["common-cold", "influenza", "asthma", "pneumonia"], Headache: ["migraine", "fever", "dengue", "hypertension"], "Skin rash": ["skin-allergy", "chickenpox", "dengue"], "Stomach pain": ["gastroenteritis", "typhoid", "acidity"], Breathlessness: ["asthma", "pneumonia", "anemia"], Tiredness: ["anemia", "diabetes", "influenza", "dengue"], "Joint pain": ["dengue", "influenza", "malaria"], "Frequent thirst": ["diabetes"], Vomiting: ["gastroenteritis", "typhoid", "malaria", "migraine"] };
export function SymptomSection() {
  const [sel, setSel] = useState([]);
  const toggle = (s) => setSel(sel.includes(s) ? sel.filter((x) => x !== s) : [...sel, s]);
  const score = {}; sel.forEach((s) => SYM[s].forEach((k) => (score[k] = (score[k] || 0) + 1)));
  const res = Object.entries(score).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([k, n]) => ({ d: diseases.find((x) => x.slug === k), n })).filter((r) => r.d);
  return (
    <section className="bg-white"><div className="mx-auto max-w-6xl px-5 py-16">
      <h2 className="text-3xl font-bold">What are you feeling today?</h2>
      <p className="mt-2 max-w-2xl text-ink/70">Tap your symptoms to see which conditions to read about. This is a reading guide, not a diagnosis.</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {Object.keys(SYM).map((s) => <button key={s} onClick={() => toggle(s)} aria-pressed={sel.includes(s)} className={`rounded-full border px-4 py-2 font-medium transition ${sel.includes(s) ? "border-coral bg-coral text-white" : "border-ink/20 hover:border-pine"}`}>{s}</button>)}
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {res.length === 0 ? <p className="text-ink/60 sm:col-span-2 lg:col-span-4">Pick one or more symptoms to see suggestions.</p> :
          res.map(({ d, n }) => <Link key={d.slug} to={`/diseases/${d.slug}`} className="rounded-2xl bg-sea p-5 transition hover:-translate-y-1 hover:shadow-lg"><p className="text-sm font-semibold text-pine">Matches {n} of {sel.length}</p><h3 className="mt-1 text-lg font-bold">{d.name}</h3><p className="mt-1 text-sm text-ink/70">See a {d.specialist}</p></Link>)}
      </div>
    </div></section>
  );
}

const WHY = [["Clear doctor profiles", "Qualification, experience, city and fee shown before you book."], ["Slot-wise booking", "Pick a day and a free time. Taken slots are blocked automatically."], ["Plain-language guides", "Symptoms, causes and precautions without medical jargon."], ["Easy cancellation", "Change of plan? Cancel from your dashboard in one tap."], ["Works on every screen", "Designed for phones first and scales up to desktops."], ["Private by design", "In this demo your data stays in your own browser."]];
export function WhyUs() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <h2 className="text-3xl font-bold">Why patients and doctors choose CarePulse</h2>
      <div className="mt-8 grid gap-x-8 gap-y-6 md:grid-cols-2 lg:grid-cols-3">
        {WHY.map(([t, d]) => <div key={t} className="border-t-2 border-ink pt-4"><h3 className="text-lg font-bold">{t}</h3><p className="mt-1 text-ink/70">{d}</p></div>)}
      </div>
    </section>
  );
}

const SEASONS = [["Monsoon", "June to September", ["dengue", "malaria", "typhoid", "gastroenteritis"], "#2B7FBF"], ["Winter", "November to February", ["common-cold", "influenza", "asthma", "pneumonia"], "#7A5AC8"], ["Summer", "March to May", ["gastroenteritis", "skin-allergy", "hypertension", "acidity"], "#C58A1B"]];
export function SeasonalWatch() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <h2 className="text-3xl font-bold">Health watch by season</h2>
      <p className="mt-2 text-ink/70">Some illnesses rise at certain times of year. Read up before they reach you.</p>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {SEASONS.map(([t, m, list, c]) => (
          <div key={t} className="overflow-hidden rounded-2xl bg-white"><div className="px-6 py-4 text-white" style={{ background: c }}><h3 className="text-xl font-bold">{t}</h3><p className="text-sm text-white/85">{m}</p></div>
            <ul className="space-y-2 p-6">{list.map((s) => <li key={s}><Link className="font-medium hover:text-pine hover:underline" to={`/diseases/${s}`}>{name(s)}</Link></li>)}</ul></div>))}
      </div>
    </section>
  );
}

const SIGNS = [["Heart attack", "Chest pressure, pain spreading to arm or jaw, cold sweat"], ["Stroke", "Face drooping, arm weakness, slurred speech. Act fast"], ["Severe breathing trouble", "Cannot speak full sentences, bluish lips"], ["Heavy bleeding or fainting", "Bleeding that will not stop, or unresponsive person"]];
export function EmergencySigns() {
  return (
    <section className="bg-coral/10"><div className="mx-auto max-w-6xl px-5 py-16">
      <h2 className="text-3xl font-bold">Go to emergency care if you see these signs</h2>
      <p className="mt-2 text-ink/70">Call your local emergency number (112 in India) instead of booking an appointment.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{SIGNS.map(([t, d]) => <div key={t} className="rounded-2xl border-2 border-coral/40 bg-white p-5"><h3 className="font-bold text-coral">{t}</h3><p className="mt-2 text-sm text-ink/75">{d}</p></div>)}</div>
    </div></section>
  );
}

export function BmiSection() {
  const [h, setH] = useState(""); const [w, setW] = useState("");
  const bmi = h > 0 && w > 0 ? w / (h / 100) ** 2 : null;
  const cat = bmi == null ? "" : bmi < 18.5 ? "Underweight" : bmi < 25 ? "Healthy range" : bmi < 30 ? "Overweight" : "Obese range";
  const pos = bmi == null ? 0 : Math.min(100, Math.max(0, ((bmi - 15) / 20) * 100));
  return (
    <section className="bg-pine text-white"><div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-2">
      <div><h2 className="text-3xl font-bold">Check your BMI</h2><p className="mt-3 max-w-md text-white/85">Body mass index is a quick screening number. It does not replace a doctor's assessment, so talk to one about your result.</p></div>
      <div className="rounded-3xl bg-white p-6 text-ink">
        <div className="grid grid-cols-2 gap-3"><input className="input" type="number" min="0" placeholder="Height (cm)" value={h} onChange={(e) => setH(e.target.value)} aria-label="Height in centimetres" /><input className="input" type="number" min="0" placeholder="Weight (kg)" value={w} onChange={(e) => setW(e.target.value)} aria-label="Weight in kilograms" /></div>
        <p className="mt-5 font-display text-4xl font-extrabold">{bmi ? bmi.toFixed(1) : "--"} <span className="text-lg font-semibold text-pine">{cat}</span></p>
        <div className="relative mt-4 h-3 rounded-full" style={{ background: "linear-gradient(90deg,#2B7FBF 0 17.5%,#0F7C7A 17.5% 50%,#C58A1B 50% 75%,#F0644F 75%)" }}>{bmi && <span className="absolute -top-1 h-5 w-1.5 rounded bg-ink transition-all" style={{ left: `${pos}%` }} />}</div>
        <div className="mt-2 flex justify-between text-xs text-ink/60"><span>Under 18.5</span><span>18.5 to 24.9</span><span>25 to 29.9</span><span>30+</span></div>
      </div>
    </div></section>
  );
}
