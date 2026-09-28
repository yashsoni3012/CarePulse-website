import { useRef, useState } from "react";
import { Link } from "react-router-dom";

// Helper to convert "1:35" string to seconds
function parseTimeToSeconds(timeStr) {
  if (!timeStr) return 0;
  const parts = timeStr.split(":").map(Number);
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return 0;
}

export default function DiseaseVideoSection({ disease }) {
  const video = disease.video;
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeChapter, setActiveChapter] = useState(0);

  if (!video) return null;

  const seekTo = (timeStr, idx) => {
    setActiveChapter(idx);
    if (videoRef.current) {
      const secs = parseTimeToSeconds(timeStr);
      videoRef.current.currentTime = secs;
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePlayToggle = () => {
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
    <section id="video-guide" className="scroll-mt-32">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-ink/10 pb-4">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-coral/15 px-3 py-1 text-xs font-bold text-coral">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            DOCTOR'S VIDEO GUIDE
          </span>
          <h2 className="mt-2 text-2xl font-bold md:text-3xl">{video.title}</h2>
          <p className="mt-1 text-sm text-ink/70">
            Presented by <span className="font-semibold text-pine">{video.doctor}</span> • Verified clinical guidance • Duration: {video.duration}
          </p>
        </div>
        <Link
          to={`/doctors?spec=${encodeURIComponent(disease.specialist)}`}
          className="rounded-full border border-pine/30 bg-pine/10 px-4 py-2 text-xs font-semibold text-pine hover:bg-pine hover:text-white transition"
        >
          Consult a {disease.specialist}
        </Link>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Video Player & Main Frame */}
        <div className="lg:col-span-2 space-y-4">
          <div className="group relative overflow-hidden rounded-3xl bg-ink shadow-lg aspect-video flex items-center justify-center">
            <video
              ref={videoRef}
              src={video.src}
              poster={video.poster}
              controls
              playsInline
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              className="h-full w-full object-cover"
            >
              Your browser does not support the video tag.
            </video>

            {/* Quick Play overlay when paused */}
            {!isPlaying && (
              <button
                type="button"
                onClick={handlePlayToggle}
                aria-label="Play video"
                className="absolute inset-0 flex flex-col items-center justify-center bg-black/35 backdrop-blur-[2px] transition hover:bg-black/25"
              >
                <div className="grid h-16 w-16 place-items-center rounded-full bg-coral text-white shadow-2xl transition group-hover:scale-110">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="6 4 20 12 6 20 6 4" />
                  </svg>
                </div>
                <span className="mt-3 rounded-full bg-ink/80 px-4 py-1.5 text-xs font-semibold text-white tracking-wide">
                  Watch Explainer ({video.duration})
                </span>
              </button>
            )}
          </div>

          <p className="text-sm text-ink/75 leading-relaxed bg-white rounded-2xl p-4 border border-ink/5">
            <strong className="text-ink">Overview:</strong> {video.summary}
          </p>
        </div>

        {/* Video Chapters & Interactive Timestamps */}
        <div className="flex flex-col rounded-3xl bg-white p-5 border border-ink/10 shadow-sm">
          <div className="flex items-center justify-between border-b border-ink/10 pb-3">
            <h3 className="font-bold text-base text-ink flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              Video Chapters
            </h3>
            <span className="text-xs text-ink/50">Click to jump</span>
          </div>

          <div className="mt-3 space-y-2 flex-1">
            {video.chapters.map((ch, idx) => (
              <button
                key={ch.time}
                type="button"
                onClick={() => seekTo(ch.time, idx)}
                className={`w-full flex items-start gap-3 rounded-xl p-2.5 text-left text-xs transition ${
                  activeChapter === idx
                    ? "bg-pine text-white font-medium shadow-sm"
                    : "bg-sea/60 text-ink hover:bg-sea"
                }`}
              >
                <span
                  className={`shrink-0 rounded-md px-2 py-0.5 font-mono text-[11px] font-bold ${
                    activeChapter === idx ? "bg-white/20 text-white" : "bg-ink/10 text-ink"
                  }`}
                >
                  {ch.time}
                </span>
                <span className="line-clamp-2 leading-snug">{ch.title}</span>
              </button>
            ))}
          </div>

          {/* Quick tips callout */}
          <div className="mt-4 rounded-xl bg-pine/10 p-3.5 border border-pine/20">
            <p className="text-xs font-bold text-pine flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              Key Doctor Advice
            </p>
            <p className="mt-1 text-xs text-ink/75 leading-relaxed">
              Always monitor temperature and symptoms accurately before self-medicating. When symptoms persist beyond 3 days, consult a licensed clinician.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
