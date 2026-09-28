import { useState } from "react";
import { Link } from "react-router-dom";
import Ecg from "../components/Ecg.jsx";
import DoctorCard from "../components/DoctorCard.jsx";
import BodyCareChart from "../components/BodyCareChart.jsx";
import HomeVideoSection from "../components/HomeVideoSection.jsx";
import { StatsStrip, SymptomSection, WhyUs, SeasonalWatch, EmergencySigns, BmiSection } from "../components/HomeExtras.jsx";
import { diseases, catColor } from "../data/diseases.js";
import { useAuth } from "../context/AuthContext.jsx";

const steps = [
  ["Create your account", "Sign up as a patient or a doctor in under a minute."],
  ["Explore conditions", "Read symptoms, watch video guides, and track precautions."],
  ["Pick a doctor", "Compare profiles, clinical experience, reviews and fees."],
  ["Book a slot", "Choose a day and time that suits you and get it confirmed."]
];

const specs = [
  { name: "General Physician", desc: "Fever, viral infections, daily health checks", icon: "🩺" },
  { name: "Pediatrician", desc: "Babies, child immunity, fevers and growth", icon: "👶" },
  { name: "Cardiologist", desc: "Heart rhythm, blood pressure and cardio health", icon: "❤️" },
  { name: "Dermatologist", desc: "Skin allergies, rashes, acne and dermal repair", icon: "✨" },
  { name: "Neurologist", desc: "Migraines, nerve tension and headache relief", icon: "🧠" },
  { name: "Pulmonologist", desc: "Lungs, asthma, chronic cough and breathing", icon: "🫁" }
];

const tips = [
  ["Drink enough water", "Two to three litres a day for most adults, more in warm weather.", "💧"],
  ["Sleep 7 to 8 hours", "Steady slow-wave sleep restores cellular immunity and mood.", "🌙"],
  ["Move for 30 minutes", "A brisk walk on most days protects arterial elasticity.", "🏃‍♂️"],
  ["Wash hands well", "Twenty seconds with antibacterial soap blocks viral transfer.", "🧼"],
  ["Eat colourful food", "Antioxidants from vegetables, fruits, and whole pulses.", "🥗"],
  ["Check in regularly", "Routine blood pressure and glucose checks catch issues early.", "🩺"]
];

const reviews = [
  ["Booking took a minute. I picked a 5 PM slot and it was confirmed immediately.", "Meera, Ahmedabad"],
  ["The fever video guide and precautions checklist helped us take care of my child safely.", "Kunal, Vadodara"],
  ["The health library is very readable. I now send my patients the precautions page.", "Dr. Aarav Mehta, MD"],
  ["My doctor profile went live quickly and patients now book daily free slots smoothly.", "Dr. Sneha Patel, Surat"]
];

const faqs = [
  ["How do I book an appointment?", "Create a patient account, open a doctor's profile, choose a day and a free slot, then confirm."],
  ["Can I cancel?", "Yes. Open your dashboard and cancel any upcoming appointment. The slot becomes free for others."],
  ["Is CarePulse for emergencies?", "No. In an emergency call your local emergency number (112 in India) or go to the nearest hospital."],
  ["How do doctors join?", "Register with the Doctor option and add your specialization, licence, experience and fee."],
  ["Where is my data stored?", "In this demo, in your own browser's local storage. Nothing is sent to a server."]
];

export default function Home() {
  const { doctors, sendMessage } = useAuth();
  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    sendMessage(Object.fromEntries(f));
    setSent(true);
    e.target.reset();
  };

  return (
    <>
      {/* Enhanced Hero Section with Hero Image & Trust Badges */}
      <section className="relative overflow-hidden bg-ink text-white">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-1/4 h-96 w-96 rounded-full bg-pine/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 h-72 w-72 rounded-full bg-coral/15 blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-6xl px-5 pb-12 pt-14 md:pt-20">
          <div className="grid items-center gap-10 lg:grid-cols-12">
            {/* Left Column: Heading & CTAs */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold backdrop-blur text-white/90 border border-white/10">
                <span className="h-2 w-2 rounded-full bg-coral animate-ping" />
                Verified Clinical Guidance &amp; Doctor Bookings
              </div>

              <h1 className="mt-5 text-4xl font-extrabold leading-tight md:text-6xl tracking-tight">
                Know what your body is telling you, and <span className="text-coral">who to ask next.</span>
              </h1>

              <p className="mt-5 max-w-xl text-lg text-white/80 leading-relaxed">
                Learn about everyday conditions with doctor video explainers, track your daily vitality benchmarks, and book appointments with verified local specialists.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  to="/doctors"
                  className="rounded-full bg-coral px-7 py-3.5 font-semibold text-white shadow-lg transition hover:bg-white hover:text-ink"
                >
                  Book an appointment
                </Link>
                <Link
                  to="/diseases"
                  className="rounded-full border border-white/30 px-6 py-3.5 font-semibold transition hover:bg-white/10 backdrop-blur"
                >
                  Browse Health Library
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="mt-10 grid grid-cols-3 gap-4 border-t border-white/15 pt-6">
                <div>
                  <p className="font-display text-2xl font-extrabold text-coral">16+</p>
                  <p className="text-xs text-white/70">Illustrated Guides</p>
                </div>
                <div>
                  <p className="font-display text-2xl font-extrabold text-pine">100%</p>
                  <p className="text-xs text-white/70">Verified Clinicians</p>
                </div>
                <div>
                  <p className="font-display text-2xl font-extrabold text-white">4.9 ★</p>
                  <p className="text-xs text-white/70">Patient Satisfaction</p>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md">
                {/* Main Hero Photo Card */}
                <div className="relative overflow-hidden rounded-3xl border-2 border-white/15 bg-white/5 shadow-2xl group">
                  <img
                    src="/images/hero_consultation.jpg"
                    alt="Doctor consultation"
                    className="h-96 w-full object-cover transition duration-700 group-hover:scale-105"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/fever_care.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-transparent flex flex-col justify-end p-6">
                    <span className="inline-block rounded-md bg-coral px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                      Patient Consultation
                    </span>
                    <p className="mt-1 text-sm font-semibold text-white">
                      Clear answers &amp; tailored home care recovery steps
                    </p>
                  </div>
                </div>

                {/* Floating Badge 1: Active Doctor */}
                <div className="absolute -top-4 -left-4 rounded-2xl bg-white p-3.5 shadow-xl text-ink border border-ink/5 hidden sm:flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-pine text-white font-bold text-sm">
                    Dr
                  </span>
                  <div>
                    <p className="text-xs font-bold leading-none">6 Specialists</p>
                    <p className="mt-1 text-[11px] text-pine font-medium flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-pine animate-pulse" />
                      Available Today
                    </p>
                  </div>
                </div>

                {/* Floating Badge 2: Video & Guide Preview */}
                <div className="absolute -bottom-5 -right-4 rounded-2xl bg-ink/90 backdrop-blur p-3.5 shadow-2xl text-white border border-white/20 hidden sm:flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-coral text-white">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="6 4 20 12 6 20 6 4" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-xs font-bold leading-none">Doctor Video Guides</p>
                    <p className="mt-1 text-[11px] text-white/70">HD Explainer in every guide</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Ecg className="mx-auto w-full max-w-6xl px-2 opacity-80" />
      </section>

      {/* Emergency Notice */}
      <div className="bg-coral/15 border-b border-coral/20">
        <p className="mx-auto max-w-6xl px-5 py-3 text-sm font-medium text-ink flex items-center gap-2">
          <svg className="shrink-0 text-coral" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          In an emergency, call 112 immediately. CarePulse is for routine consultations and guidance, not acute trauma.
        </p>
      </div>

      {/* Animated Stats Strip */}
      <StatsStrip />

      {/* Interactive Body Care & Vitality Chart */}
      <BodyCareChart />

      {/* Find Care by Specialty with visual icons */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-pine">Clinical Departments</span>
            <h2 className="mt-1 text-3xl font-bold">Find care by specialty</h2>
          </div>
          <Link to="/doctors" className="text-sm font-semibold text-pine hover:underline">
            View all 6 specialties →
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {specs.map((item) => (
            <Link
              key={item.name}
              to={`/doctors?spec=${encodeURIComponent(item.name)}`}
              className="group rounded-2xl bg-white p-6 shadow-sm border border-ink/5 transition hover:-translate-y-1 hover:shadow-lg flex items-start gap-4"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-sea text-2xl group-hover:scale-110 transition">
                {item.icon}
              </span>
              <div>
                <h3 className="text-lg font-bold text-ink group-hover:text-pine transition">{item.name}</h3>
                <p className="mt-1 text-xs text-ink/70 leading-relaxed">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Interactive Symptom Checker Section */}
      <SymptomSection />

      {/* CarePulse In Action Video Section */}
      <HomeVideoSection />

      {/* Meet our Doctors */}
      <section className="bg-white border-y border-ink/10">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-pine">Verified Specialists</span>
              <h2 className="mt-1 text-3xl font-bold">Meet our doctors</h2>
            </div>
            <Link to="/doctors" className="font-semibold text-pine hover:underline text-sm">
              See all {doctors.length} doctors →
            </Link>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {doctors.slice(0, 3).map((d) => (
              <DoctorCard key={d.id} d={d} />
            ))}
          </div>
        </div>
      </section>

      {/* Seasonal Health Watch */}
      <SeasonalWatch />

      {/* Why Choose CarePulse */}
      <WhyUs />

      {/* Booking Steps */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="text-3xl font-bold">Booking in four steps</h2>
        <ol className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {steps.map(([t, d], i) => (
            <li key={t} className="rounded-2xl bg-white p-6 shadow-sm border border-ink/5">
              <span className="font-display text-3xl font-extrabold text-coral">{i + 1}</span>
              <h3 className="mt-2 text-xl font-bold">{t}</h3>
              <p className="mt-1 text-xs text-ink/70 leading-relaxed">{d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Common Conditions Grid with Visual Cards */}
      <section className="bg-white border-t border-ink/10">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-pine">Health Library</span>
              <h2 className="mt-1 text-3xl font-bold">Common conditions</h2>
            </div>
            <Link to="/diseases" className="font-semibold text-pine hover:underline text-sm">
              Explore all {diseases.length} conditions →
            </Link>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {diseases.slice(0, 8).map((d) => (
              <Link
                key={d.slug}
                to={`/diseases/${d.slug}`}
                className="group overflow-hidden rounded-2xl border border-ink/10 bg-white transition hover:-translate-y-1 hover:shadow-lg flex flex-col"
              >
                <div className="relative h-32 w-full overflow-hidden bg-slate-100">
                  <img
                    src={d.image}
                    alt={d.name}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/fever_care.jpg";
                    }}
                  />
                  <span
                    className="absolute top-2 left-2 rounded-full px-2 py-0.5 text-[10px] font-bold text-white shadow-sm"
                    style={{ background: catColor[d.category] || "#0F7C7A" }}
                  >
                    {d.category}
                  </span>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-base text-ink group-hover:text-pine transition">{d.name}</h3>
                    <p className="mt-1 line-clamp-2 text-xs text-ink/70">{d.summary}</p>
                  </div>
                  <span className="mt-3 text-xs font-semibold text-pine flex items-center gap-1">
                    Read guide
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Signs */}
      <EmergencySigns />

      {/* Daily Habits That Help */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="text-3xl font-bold">Daily habits that protect your body</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tips.map(([t, d, icon]) => (
            <div key={t} className="rounded-2xl bg-pine p-6 text-white shadow-sm flex items-start gap-4">
              <span className="text-3xl shrink-0">{icon}</span>
              <div>
                <h3 className="text-lg font-bold">{t}</h3>
                <p className="mt-1 text-xs text-white/85 leading-relaxed">{d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive BMI Calculator */}
      <BmiSection />

      {/* Reviews & Social Proof */}
      <section className="bg-ink text-white py-16">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-3xl font-bold">What people say</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {reviews.map(([q, n]) => (
              <figure key={n} className="rounded-2xl bg-white/10 p-6 border border-white/5 flex flex-col justify-between">
                <blockquote className="text-sm text-white/90 leading-relaxed">“{q}”</blockquote>
                <figcaption className="mt-4 text-xs font-bold text-coral uppercase tracking-wider">{n}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-5 py-16">
        <h2 className="text-3xl font-bold">Questions, answered</h2>
        <div className="mt-6 space-y-3">
          {faqs.map(([q, a]) => (
            <details key={q} className="group rounded-2xl bg-white p-5 border border-ink/5 shadow-sm">
              <summary className="cursor-pointer font-semibold text-ink">{q}</summary>
              <p className="mt-2 text-sm text-ink/70 leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Contact Form */}
      <section className="mx-auto max-w-6xl px-5 pb-16">
        <div className="grid gap-8 rounded-3xl bg-white p-8 md:grid-cols-2 md:p-12 border border-ink/10 shadow-sm">
          <div>
            <h2 className="text-3xl font-bold">Contact our medical care team</h2>
            <p className="mt-2 text-sm text-ink/70 leading-relaxed">
              Questions about your account or registering as a licensed medical practitioner? Send our team a note.
            </p>
            <Link to="/register" className="btn mt-6 inline-block">
              Register as a doctor
            </Link>
          </div>

          <form onSubmit={submit} className="space-y-3">
            <input name="name" className="input" placeholder="Your full name" required />
            <input name="email" type="email" className="input" placeholder="Email address" required />
            <textarea name="message" rows="3" className="input" placeholder="How can our clinical support help you?" required />
            <button className="btn w-full">Send message</button>
            {sent && <p role="status" className="text-sm font-medium text-pine">Thanks, your message was saved.</p>}
          </form>
        </div>
      </section>
    </>
  );
}
