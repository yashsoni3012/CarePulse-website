import { Link } from "react-router-dom";
import Logo from "./Logo.jsx";
const specs = ["General Physician", "Pediatrician", "Cardiologist", "Dermatologist", "Neurologist", "Pulmonologist"];
export default function Footer() {
  return (
    <footer className="bg-ink text-white/75">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo size="md" light={true} />
          <p className="mt-4 max-w-md text-sm text-white/70 leading-relaxed">
            Everyday health guidance, doctor video explainers, and verified specialist bookings. Information for awareness only. In an emergency, call 112.
          </p>
        </div>
        <div><h3 className="font-bold text-white">Explore</h3><ul className="mt-3 space-y-2 text-sm">{[["/", "Home"], ["/diseases", "Health library"], ["/doctors", "Doctors"], ["/register", "Join as a doctor"], ["/login", "Log in"]].map(([to, t]) => <li key={to}><Link className="hover:text-white" to={to}>{t}</Link></li>)}</ul></div>
        <div><h3 className="font-bold text-white">Specialties</h3><ul className="mt-3 space-y-2 text-sm">{specs.map((s) => <li key={s}><Link className="hover:text-white" to={`/doctors?spec=${encodeURIComponent(s)}`}>{s}</Link></li>)}</ul></div>
      </div>
      <p className="border-t border-white/10 py-4 text-center text-xs text-white/50">© {new Date().getFullYear()} CarePulse. All rights reserved.</p>
    </footer>
  );
}
