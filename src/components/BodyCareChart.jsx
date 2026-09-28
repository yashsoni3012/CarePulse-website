import { useState } from "react";

const PILLARS = [
  {
    id: "cardio",
    name: "Heart & Cardio",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    color: "#F0644F",
    target: "30 mins daily activity",
    optimal: "60-80 bpm resting pulse",
    metricName: "Daily Active Minutes",
    min: 0,
    max: 90,
    defaultVal: 35,
    unit: "mins",
    statusText: (v) => (v >= 30 ? "Optimal cardiovascular benefit achieved" : "Aim for 30+ minutes of brisk walking"),
    tips: [
      "A 30-minute daily walk reduces heart disease risk by up to 35%.",
      "Keep resting pulse between 60 and 80 beats per minute.",
      "Stay hydrated during workouts to prevent extra strain on circulation."
    ]
  },
  {
    id: "hydration",
    name: "Hydration Balance",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
      </svg>
    ),
    color: "#2B7FBF",
    target: "2.5 - 3.0 Litres / day",
    optimal: "Light pale yellow urine index",
    metricName: "Water Intake (Glasses)",
    min: 0,
    max: 16,
    defaultVal: 8,
    unit: "glasses (250ml)",
    statusText: (v) => (v >= 8 ? "Excellent cellular hydration and kidney function" : "Drink 1-2 more glasses to avoid fatigue"),
    tips: [
      "Drink a full glass of water right upon waking to reactivate metabolism.",
      "Sip water gradually rather than gulping in large amounts at once.",
      "In hot weather or during fever, add electrolytes (ORS) to prevent cramps."
    ]
  },
  {
    id: "sleep",
    name: "Sleep & Cellular Repair",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    ),
    color: "#7A5AC8",
    target: "7 - 8.5 Hours of sleep",
    optimal: "Consistent wake-up within 30 mins",
    metricName: "Sleep Duration",
    min: 3,
    max: 11,
    defaultVal: 7.5,
    unit: "hours",
    statusText: (v) => (v >= 7 && v <= 9 ? "Ideal restorative sleep zone for immune defense" : "Sleep under 6h impairs white blood cell counts"),
    tips: [
      "Cease bright blue screens 45 minutes before turning off lights.",
      "Keep bedroom temperature cool (around 19-21°C) for deeper REM stages.",
      "Avoid heavy caffeine after 3:00 PM to protect slow-wave deep sleep."
    ]
  },
  {
    id: "nutrition",
    name: "Immune Plate & Fiber",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
      </svg>
    ),
    color: "#0F7C7A",
    target: "30g fiber + 5 colors / day",
    optimal: "50% veggies, 25% protein, 25% grains",
    metricName: "Color & Veggie Servings",
    min: 0,
    max: 8,
    defaultVal: 5,
    unit: "servings",
    statusText: (v) => (v >= 5 ? "Strong antioxidant coverage & gut microbiome balance" : "Add one leafy green or whole fruit to lunch"),
    tips: [
      "Fill half your meal plate with vegetables and low-sugar seasonal fruits.",
      "Pair dietary iron (spinach, lentils) with Vitamin C (lemon) for maximum absorption.",
      "Eat fermented foods like fresh curd (yogurt) to enrich beneficial gut flora."
    ]
  },
  {
    id: "stress",
    name: "Stress & Nervous Reset",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
        <line x1="9" y1="9" x2="9.01" y2="9" />
        <line x1="15" y1="9" x2="15.01" y2="9" />
      </svg>
    ),
    color: "#C58A1B",
    target: "10 mins mindfulness / breathwork",
    optimal: "Cortisol baseline stabilization",
    metricName: "Mindful Breath Minutes",
    min: 0,
    max: 30,
    defaultVal: 12,
    unit: "mins",
    statusText: (v) => (v >= 10 ? "Vagus nerve activated; lower resting blood pressure" : "Take 5 deep abdominal breaths now to reset stress"),
    tips: [
      "Practice 4-7-8 breathing: Inhale 4s, hold 7s, exhale slowly for 8s.",
      "A 10-minute walk outdoors in natural daylight clears mental fog.",
      "Short breaks every 90 minutes prevent postural headaches and fatigue."
    ]
  }
];

export default function BodyCareChart() {
  const [activeId, setActiveId] = useState("cardio");
  const [metrics, setMetrics] = useState({
    cardio: 35,
    hydration: 8,
    sleep: 7.5,
    nutrition: 5,
    stress: 12
  });

  const [breathActive, setBreathActive] = useState(false);

  const activePillar = PILLARS.find((p) => p.id === activeId) || PILLARS[0];
  const currentVal = metrics[activeId];

  const updateMetric = (val) => {
    setMetrics({ ...metrics, [activeId]: Number(val) });
  };

  // Compute overall Health Vitality Score (0 to 100)
  const cardioPct = Math.min(100, (metrics.cardio / 30) * 100);
  const hydroPct = Math.min(100, (metrics.hydration / 8) * 100);
  const sleepPct = Math.min(100, (metrics.sleep / 7.5) * 100);
  const nutPct = Math.min(100, (metrics.nutrition / 5) * 100);
  const stressPct = Math.min(100, (metrics.stress / 10) * 100);
  const totalScore = Math.round((cardioPct + hydroPct + sleepPct + nutPct + stressPct) / 5);

  return (
    <section className="bg-sea/40 border-y border-ink/10 py-16">
      <div className="mx-auto max-w-6xl px-5">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-ink/10 pb-6">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-pine/15 px-3 py-1 text-xs font-bold text-pine uppercase tracking-wider">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              Daily Body Care Guide
            </span>
            <h2 className="mt-3 text-3xl font-extrabold text-ink md:text-4xl">
              Take Care of Your Body: Interactive Vitality Chart
            </h2>
            <p className="mt-2 max-w-2xl text-ink/70">
              Interactive health metrics for the 5 vital pillars of physical wellbeing. Track your habits and see how they protect your body from illness.
            </p>
          </div>

          {/* Vitality Score Badge */}
          <div className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm border border-ink/10">
            <div className="relative h-16 w-16 flex items-center justify-center">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-sea stroke-current"
                  strokeWidth="3.5"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="stroke-current text-pine transition-all duration-700 ease-out"
                  strokeDasharray={`${totalScore}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-lg font-black text-ink">{totalScore}%</span>
            </div>
            <div>
              <p className="text-xs uppercase font-bold text-ink/50 tracking-wider">Body Vitality Score</p>
              <p className="font-extrabold text-ink text-base">
                {totalScore >= 80 ? "Optimal Balance" : totalScore >= 60 ? "Good Progress" : "Needs Attention"}
              </p>
            </div>
          </div>
        </div>

        {/* Pillars Tab Selector */}
        <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
          {PILLARS.map((p) => {
            const isActive = p.id === activeId;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setActiveId(p.id)}
                className={`flex shrink-0 items-center gap-2.5 rounded-2xl px-5 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-ink text-white shadow-md scale-102"
                    : "bg-white text-ink/80 hover:bg-white/80 border border-ink/5"
                }`}
              >
                <span style={{ color: isActive ? "#F0644F" : p.color }}>{p.icon}</span>
                <span>{p.name}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Chart & Controls Box */}
        <div className="mt-6 grid gap-8 lg:grid-cols-12 rounded-3xl bg-white p-6 shadow-sm border border-ink/10 md:p-8">
          {/* Left: Interactive Controls & Status */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <span
                  className="rounded-full px-3 py-1 text-xs font-bold text-white shadow-sm"
                  style={{ backgroundColor: activePillar.color }}
                >
                  {activePillar.name}
                </span>
                <span className="text-xs font-medium text-ink/60">Target: {activePillar.target}</span>
              </div>

              <h3 className="mt-4 text-2xl font-bold text-ink">
                Adjust Your Daily {activePillar.name}
              </h3>
              <p className="mt-1 text-sm text-ink/70">
                Move the slider to match your typical day and see the real clinical recommendations.
              </p>

              {/* Slider Input */}
              <div className="mt-6 rounded-2xl bg-sea/40 p-5 border border-ink/5">
                <div className="flex items-baseline justify-between">
                  <span className="font-semibold text-sm text-ink">{activePillar.metricName}</span>
                  <span className="font-display text-3xl font-extrabold" style={{ color: activePillar.color }}>
                    {currentVal} <span className="text-sm font-medium text-ink/60">{activePillar.unit}</span>
                  </span>
                </div>

                <input
                  type="range"
                  min={activePillar.min}
                  max={activePillar.max}
                  step={activePillar.id === "sleep" ? "0.5" : "1"}
                  value={currentVal}
                  onChange={(e) => updateMetric(e.target.value)}
                  className="mt-4 w-full accent-coral h-2.5 bg-ink/15 rounded-lg cursor-pointer"
                  aria-label={activePillar.metricName}
                />

                <div className="mt-2 flex justify-between text-[11px] font-medium text-ink/50">
                  <span>Min ({activePillar.min} {activePillar.unit})</span>
                  <span>Target Range</span>
                  <span>Max ({activePillar.max} {activePillar.unit})</span>
                </div>
              </div>

              {/* Dynamic Status message */}
              <div className="mt-4 rounded-xl bg-pine/10 p-4 border border-pine/20 flex items-start gap-3">
                <svg className="shrink-0 text-pine mt-0.5" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <p className="text-sm font-semibold text-ink leading-snug">
                  {activePillar.statusText(currentVal)}
                </p>
              </div>
            </div>

            {/* Quick Interactive Exercise */}
            {activePillar.id === "stress" && (
              <div className="rounded-2xl border border-ink/10 p-4 bg-coral/5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase text-coral">Quick Nervous System Reset</p>
                  <p className="text-sm font-semibold text-ink">4-7-8 Breathing Circle</p>
                </div>
                <button
                  type="button"
                  onClick={() => setBreathActive(!breathActive)}
                  className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                    breathActive ? "bg-coral text-white animate-pulse" : "bg-ink text-white hover:bg-pine"
                  }`}
                >
                  {breathActive ? "Inhale... Hold... Exhale..." : "Start 30s Reset"}
                </button>
              </div>
            )}

            {/* Doctor Tips */}
            <div>
              <p className="text-xs font-bold uppercase text-ink/50 tracking-wider">Clinical Guidance for this Pillar</p>
              <ul className="mt-3 space-y-2">
                {activePillar.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-ink/80 leading-relaxed">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: activePillar.color }} />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: Comparative Multi-Pillar Visual Chart */}
          <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl bg-sea/30 p-5 border border-ink/10">
            <div>
              <h4 className="font-bold text-base text-ink flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
                5-Pillar Health Overview
              </h4>
              <p className="mt-1 text-xs text-ink/65">
                Relative balance comparison across your daily routine:
              </p>

              {/* Visual Bar Chart */}
              <div className="mt-6 space-y-4">
                {[
                  { name: "Heart & Cardio", pct: cardioPct, color: "#F0644F", val: `${metrics.cardio}m` },
                  { name: "Hydration Balance", pct: hydroPct, color: "#2B7FBF", val: `${metrics.hydration} gl` },
                  { name: "Sleep & Repair", pct: sleepPct, color: "#7A5AC8", val: `${metrics.sleep}h` },
                  { name: "Immune Plate", pct: nutPct, color: "#0F7C7A", val: `${metrics.nutrition} serv` },
                  { name: "Stress Relief", pct: stressPct, color: "#C58A1B", val: `${metrics.stress}m` }
                ].map((item) => (
                  <div key={item.name} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-ink">{item.name}</span>
                      <span className="font-mono text-ink/70">{item.val} ({Math.round(item.pct)}%)</span>
                    </div>
                    <div className="h-3 w-full overflow-hidden rounded-full bg-white shadow-inner">
                      <div
                        className="h-full rounded-full transition-all duration-500 ease-out"
                        style={{
                          width: `${item.pct}%`,
                          backgroundColor: item.color
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom summary prompt */}
            <div className="mt-8 rounded-xl bg-white p-4 border border-ink/10 shadow-sm text-center">
              <p className="text-xs font-bold text-pine">Consistent Small Habits = Powerful Immunity</p>
              <p className="mt-1 text-[11px] text-ink/70">
                Maintaining 80%+ across these five daily benchmarks reduces common infections and metabolic risks by up to 40%.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
