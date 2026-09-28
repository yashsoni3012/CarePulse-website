import { useState, useRef } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const SPECS = [
  "General Physician",
  "Pediatrician",
  "Cardiologist",
  "Dermatologist",
  "Neurologist",
  "Pulmonologist",
  "Orthopedic",
  "Gynecologist",
  "ENT Specialist"
];

export default function Auth({ mode }) {
  const { user, login, register, loginDemo } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const fileInputRef = useRef(null);

  const [role, setRole] = useState("patient");
  const [err, setErr] = useState("");
  const [loadingRole, setLoadingRole] = useState(null);

  const handleDemoLogin = (targetRole) => {
    setErr("");
    setLoadingRole(targetRole);
    const res = loginDemo(targetRole);
    if (res?.ok) {
      nav(loc.state?.from?.pathname || "/dashboard", { replace: true });
    } else {
      setLoadingRole(null);
      setErr(res?.error || "Could not log in");
    }
  };
  const [f, setF] = useState({
    name: "",
    email: "",
    password: "",
    specialization: "General Physician",
    license: "",
    experience: "",
    fee: "",
    city: "Ahmedabad",
    about: "",
    image: ""
  });

  const isReg = mode === "register";
  const doc = role === "doctor";

  if (user) return <Navigate to="/dashboard" replace />;

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      setErr("Image file size should be under 3MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setF((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setF((prev) => ({ ...prev, image: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const submit = (e) => {
    e.preventDefault();
    setErr("");
    if (isReg && f.password.length < 6) return setErr("Password needs at least 6 characters.");

    const r = isReg
      ? register({
          ...f,
          role,
          name: doc && !f.name.startsWith("Dr") ? `Dr. ${f.name}` : f.name,
          image: f.image || (doc ? "https://images.unsplash.com/photo-1594824813596-f6b0f192eb96?auto=format&fit=crop&w=600&q=80" : ""),
          ...(doc ? {} : { specialization: "", license: "", experience: "", fee: "", city: "", about: "" })
        })
      : login({ ...f, role });

    r.ok ? nav(loc.state?.from?.pathname || "/dashboard", { replace: true }) : setErr(r.error);
  };

  return (
    <div className="mx-auto grid max-w-5xl items-center gap-10 px-5 py-14 md:grid-cols-2">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-pine">CarePulse Access</span>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight">
          {isReg ? "Create your account" : "Welcome back"}
        </h1>
        <p className="mt-3 text-sm text-ink/75 leading-relaxed">
          {isReg
            ? "Patients get verified health guidance & video explainers. Doctors get an instant public profile and automated slot booking."
            : "Log in as a patient or a doctor to access your dashboard and appointments."}
        </p>

        {isReg && doc && (
          <div className="mt-6 rounded-2xl bg-pine/10 p-4 border border-pine/20">
            <p className="text-xs font-bold text-pine flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              Doctor Profile Storage
            </p>
            <p className="mt-1 text-xs text-ink/70">
              Your profile picture and details will be saved to your browser's local storage and displayed across the Doctors directory immediately. You can update details at any time from your dashboard.
            </p>
          </div>
        )}
      </div>

      <form onSubmit={submit} className="space-y-4 rounded-3xl bg-white p-6 shadow-md border border-ink/10 md:p-8">
        {/* Role Toggle */}
        <div className="grid grid-cols-2 gap-2 rounded-full bg-sea p-1" role="tablist">
          {["patient", "doctor"].map((r) => (
            <button
              type="button"
              key={r}
              onClick={() => {
                setRole(r);
                setErr("");
              }}
              role="tab"
              aria-selected={role === r}
              className={`rounded-full py-2 text-xs font-bold capitalize transition ${
                role === r ? "bg-ink text-white shadow-sm" : "text-ink/70 hover:text-ink"
              }`}
            >
              {r === "doctor" ? "👨‍⚕️ Doctor" : "👤 Patient"}
            </button>
          ))}
        </div>

        {/* Doctor Photo Upload Section */}
        {isReg && doc && (
          <div className="rounded-2xl border border-ink/10 bg-sea/40 p-4">
            <label className="text-xs font-bold uppercase tracking-wider text-ink/70 block mb-2">
              Doctor Profile Photo
            </label>
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-white ring-2 ring-pine/20 shadow-sm flex items-center justify-center">
                {f.image ? (
                  <img src={f.image} alt="Doctor preview" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-2xl text-ink/40">👨‍⚕️</span>
                )}
              </div>

              <div className="flex-1 space-y-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="doctor-photo-upload"
                />
                <label
                  htmlFor="doctor-photo-upload"
                  className="inline-flex items-center gap-1.5 cursor-pointer rounded-full bg-ink px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-pine transition"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  {f.image ? "Change Photo" : "Upload Doctor Photo"}
                </label>

                {f.image && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="ml-2 text-xs font-semibold text-coral hover:underline"
                  >
                    Remove
                  </button>
                )}
                <p className="text-[11px] text-ink/50">PNG, JPG or WEBP (Max 3MB)</p>
              </div>
            </div>
          </div>
        )}

        {isReg && (
          <input
            className="input text-sm"
            placeholder={doc ? "Full name (e.g. Aarav Mehta)" : "Full name"}
            required
            value={f.name}
            onChange={set("name")}
          />
        )}

        <input
          className="input text-sm"
          type="email"
          placeholder="Email address"
          required
          value={f.email}
          onChange={set("email")}
        />

        <input
          className="input text-sm"
          type="password"
          placeholder="Password (minimum 6 characters)"
          required
          value={f.password}
          onChange={set("password")}
        />

        {/* Doctor-Specific Details */}
        {isReg && doc && (
          <>
            <div>
              <label className="text-[11px] font-bold text-ink/60 uppercase block mb-1">Specialization</label>
              <select
                className="input text-sm cursor-pointer"
                value={f.specialization}
                onChange={set("specialization")}
                required
              >
                {SPECS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <input
              className="input text-sm"
              placeholder="Medical licence number (e.g. MCI-48291)"
              required
              value={f.license}
              onChange={set("license")}
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-ink/60 uppercase block mb-1">Years of Exp</label>
                <input
                  className="input text-sm"
                  type="number"
                  min="1"
                  max="60"
                  placeholder="e.g. 8"
                  required
                  value={f.experience}
                  onChange={set("experience")}
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-ink/60 uppercase block mb-1">Fee per visit (₹)</label>
                <input
                  className="input text-sm"
                  type="number"
                  min="100"
                  step="50"
                  placeholder="e.g. 600"
                  required
                  value={f.fee}
                  onChange={set("fee")}
                />
              </div>
            </div>

            <input
              className="input text-sm"
              placeholder="City of Practice (e.g. Ahmedabad, Surat)"
              required
              value={f.city}
              onChange={set("city")}
            />

            <textarea
              className="input text-sm"
              rows="2"
              placeholder="Short clinical summary / about your practice (optional)"
              value={f.about}
              onChange={set("about")}
            />
          </>
        )}

        {err && (
          <p role="alert" className="rounded-xl bg-coral/15 border border-coral/30 px-4 py-3 text-xs font-medium text-ink">
            {err}
          </p>
        )}

        <button className="btn w-full !py-3 font-bold text-sm shadow">
          {isReg ? (doc ? "Create Doctor Profile" : "Create Account") : "Log in"}
        </button>

        {/* {!isReg && (
          <div className="rounded-2xl border border-ink/10 bg-sea/50 p-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink/60 block mb-2 text-center">
              ⚡ Quick 1-Click Demo Login
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={Boolean(loadingRole)}
                onClick={() => handleDemoLogin("doctor")}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 active:scale-[0.98] transition disabled:opacity-60 cursor-pointer"
              >
                <span>🩺</span> {loadingRole === "doctor" ? "Connecting..." : "Log in as Doctor"}
              </button>
              <button
                type="button"
                disabled={Boolean(loadingRole)}
                onClick={() => handleDemoLogin("patient")}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-sky-600 px-3 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-sky-700 active:scale-[0.98] transition disabled:opacity-60 cursor-pointer"
              >
                <span>👤</span> {loadingRole === "patient" ? "Connecting..." : "Log in as Patient"}
              </button>
            </div>
          </div>
        )} */}

        <p className="text-center text-xs text-ink/70">
          {isReg ? "Already have an account?" : "Need an account?"}{" "}
          <Link className="font-bold text-pine hover:underline" to={isReg ? "/login" : "/register"}>
            {isReg ? "Log in" : "Create an account"}
          </Link>
        </p>
      </form>
    </div>
  );
}
