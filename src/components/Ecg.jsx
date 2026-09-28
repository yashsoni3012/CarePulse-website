export default function Ecg({ className = "" }) {
  return (
    <svg viewBox="0 0 800 140" className={className} fill="none" aria-hidden="true">
      <path className="ecg" stroke="#F0644F" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
        d="M0 80H170l18-14 16 14h40l14 34 22-96 24 122 20-60h30l16-16 16 16h120l14-24 14 24h60l16-20 16 20H800" />
    </svg>
  );
}
