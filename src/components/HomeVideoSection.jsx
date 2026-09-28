import { useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function HomeVideoSection() {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <section className="bg-ink text-white py-16">
      <div className="mx-auto max-w-6xl px-5">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-coral/20 px-3 py-1 text-xs font-bold text-coral uppercase tracking-wider">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              CarePulse In Action
            </span>
            <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">
              Watch: Everyday Health Guidance &amp; Doctor Care
            </h2>
            <p className="mt-2 max-w-2xl text-white/75">
              See how CarePulse empowers patients with verified health guides, interactive symptom checks, and direct doctor consultations.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/doctors"
              className="rounded-full bg-coral px-5 py-2.5 text-xs font-semibold text-white shadow hover:bg-white hover:text-ink transition"
            >
              Meet Our Doctors
            </Link>
          </div>
        </div>

        <div className="mt-10 grid items-center gap-8 lg:grid-cols-12">
          {/* Main Video Player */}
          <div className="lg:col-span-7">
            <div className="group relative overflow-hidden rounded-3xl bg-black shadow-2xl aspect-video flex items-center justify-center border border-white/10">
              <video
                ref={videoRef}
                src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
                poster="/images/doctor_video.jpg"
                controls
                playsInline
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                className="h-full w-full object-cover"
              >
                Your browser does not support the video tag.
              </video>

              {/* Custom Play overlay when paused */}
              {!isPlaying && (
                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label="Play CarePulse intro video"
                  className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] transition hover:bg-black/30"
                >
                  <div className="grid h-20 w-20 place-items-center rounded-full bg-coral text-white shadow-2xl transition group-hover:scale-110">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="6 4 20 12 6 20 6 4" />
                    </svg>
                  </div>
                  <span className="mt-4 rounded-full bg-ink/90 px-4 py-1.5 text-xs font-semibold text-white tracking-wide border border-white/20">
                    Watch Platform Overview (2:10)
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Feature Highlights on the right */}
          <div className="lg:col-span-5 space-y-4">
            {[
              {
                title: "16+ Verified Condition Guides",
                desc: "Read plain-language symptoms, causes, and precaution checklists without medical jargon.",
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                )
              },
              {
                title: "Doctor Explainer Videos",
                desc: "Every major illness guide includes a clinical video and visual infographics to guide home recovery safely.",
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="23 7 16 12 23 17 23 7" />
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                  </svg>
                )
              },
              {
                title: "Real-Time Slot-Wise Booking",
                desc: "Choose a day, pick a verified specialist, and lock your slot instantly with automatic conflict prevention.",
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                )
              }
            ].map((f, i) => (
              <div key={i} className="rounded-2xl bg-white/10 p-5 border border-white/5 flex items-start gap-4 transition hover:bg-white/15">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-coral/20 text-coral">
                  {f.icon}
                </span>
                <div>
                  <h3 className="font-bold text-base text-white">{f.title}</h3>
                  <p className="mt-1 text-xs text-white/70 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
