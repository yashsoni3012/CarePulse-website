import { useState } from "react";

export default function DiseaseGallery({ gallery = [], categoryColor = "#0F7C7A", diseaseName = "" }) {
  const [selectedImg, setSelectedImg] = useState(null);

  if (!gallery || gallery.length === 0) return null;

  return (
    <section id="visual-guide" className="scroll-mt-32">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-ink/10 pb-4">
        <div>
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold text-white"
            style={{ backgroundColor: categoryColor }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            VISUAL HEALTH GUIDES
          </span>
          <h2 className="mt-2 text-2xl font-bold md:text-3xl">Visual Care & Explanatory Images</h2>
          <p className="mt-1 text-sm text-ink/70">
            Illustrated clinical guides, symptom checkpoints, and home recovery aids for {diseaseName}.
          </p>
        </div>
        <p className="text-xs font-medium text-ink/60">Click any image to enlarge</p>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {gallery.map((item, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedImg(item)}
            className="group cursor-pointer overflow-hidden rounded-3xl bg-white border border-ink/10 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="relative h-48 w-full overflow-hidden bg-sea/50">
              <img
                src={item.url}
                alt={item.title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/images/fever_care.jpg";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition group-hover:opacity-100 flex items-end p-4">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-ink shadow-sm">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    <line x1="11" y1="8" x2="11" y2="14" />
                    <line x1="8" y1="11" x2="14" y2="11" />
                  </svg>
                  Tap to expand
                </span>
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-base text-ink group-hover:text-pine transition">
                {item.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-ink/75">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImg && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm transition-opacity"
          onClick={() => setSelectedImg(null)}
        >
          <div
            className="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImg(null)}
              aria-label="Close modal"
              className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-black/60 text-white hover:bg-black transition"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <img
              src={selectedImg.url}
              alt={selectedImg.title}
              className="max-h-[60vh] w-full object-contain bg-ink"
            />
            <div className="p-6">
              <h3 className="text-xl font-bold text-ink">{selectedImg.title}</h3>
              <p className="mt-2 text-sm text-ink/80 leading-relaxed">{selectedImg.desc}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-ink/50">CarePulse Clinical Visual Guide</span>
                <button
                  type="button"
                  onClick={() => setSelectedImg(null)}
                  className="rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white hover:bg-pine transition"
                >
                  Close preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
