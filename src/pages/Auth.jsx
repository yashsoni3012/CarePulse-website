import { useState, useRef, useEffect } from "react";
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const SPECS = [
  "General Physician (MBBS)",
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
  const [searchParams, setSearchParams] = useSearchParams();

  const roleQuery = searchParams.get("role");
  const [role, setRole] = useState(() => (roleQuery === "doctor" ? "doctor" : "patient"));
  const [err, setErr] = useState("");
  const [loadingAction, setLoadingAction] = useState(null);

  // Sync role if query param changes
  useEffect(() => {
    if (roleQuery === "doctor" || roleQuery === "patient") {
      setRole(roleQuery);
    }
  }, [roleQuery]);

  const [f, setF] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    gender: "male",
    specialization: "General Physician (MBBS)",
    qualification: "MBBS",
    registration_number: "",
    license: "",
    experience: "2",
    fee: "450",
    clinic_name: "",
    clinic_address: "Vastral",
    city: "Ahmedabad",
    about: "",
    image: ""
  });

  const isReg = mode === "register";
  const doc = role === "doctor";

  if (user) return <Navigate to="/dashboard" replace />;

  const set = (k) => (e) => setF((prev) => ({ ...prev, [k]: e.target.value }));

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setErr("");
    if (!isReg) {
      setSearchParams({ role: newRole });
    }
  };

  // Quick fill demo credentials
  const autofillCredentials = (targetRole) => {
    setErr("");
    if (targetRole === "doctor") {
      handleRoleChange("doctor");
      setF((prev) => ({
        ...prev,
        email: "akash@gmail.com",
        password: "12345"
      }));
    } else {
      handleRoleChange("patient");
      setF((prev) => ({
        ...prev,
        email: "susma@gmail.com",
        password: "12345"
      }));
    }
  };

  const handle1ClickLogin = async (target) => {
    setErr("");
    setLoadingAction(target);
    try {
      const res = await loginDemo(target);
      if (res?.ok) {
        nav(loc.state?.from?.pathname || "/dashboard", { replace: true });
      } else {
        setErr(res?.error || "Could not log in");
      }
    } catch (e) {
      setErr(e.message || "Login request failed");
    } finally {
      setLoadingAction(null);
    }
  };

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

  const submit = async (e) => {
    e.preventDefault();
    setErr("");

    if (isReg && f.password.length < 5) {
      return setErr("Password needs at least 5 characters.");
    }

    setLoadingAction("submit");

    try {
      const r = isReg
        ? await register({
            ...f,
            role,
            name: doc && !f.name.startsWith("Dr") ? `Dr. ${f.name}` : f.name,
            specialization: f.specialization,
            qualification: f.qualification || "MBBS",
            experience: Number(f.experience) || 2,
            fee: Number(f.fee) || 450,
            registration_number: f.registration_number || f.license || "1001",
            clinic_name: f.clinic_name || (f.name ? `${f.name} Clinic` : "Care Clinic"),
            clinic_address: f.clinic_address || f.city || "Ahmedabad",
            image:
              f.image ||
              (doc
                ? "https://sudhanshutask.pythonanywhere.com/media/doctors/Screenshot_2025-07-17_102731.png"
                : "https://sudhanshutask.pythonanywhere.com/media/users/bombay_ortho_1.png")
          })
        : await login({ email: f.email, password: f.password, role });

      if (r.ok) {
        nav(loc.state?.from?.pathname || "/dashboard", { replace: true });
      } else {
        setErr(r.error || "Authentication failed. Please verify your details.");
      }
    } catch (error) {
      setErr(error.message || "An unexpected error occurred.");
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="mx-auto grid max-w-5xl items-center gap-10 px-5 py-12 md:grid-cols-2">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-pine flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Live PythonAnywhere API Authentication
        </span>

        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-ink">
          {isReg ? "Create your account" : doc ? "Doctor Sign In" : "Patient Sign In"}
        </h1>

        <p className="mt-3 text-sm text-ink/75 leading-relaxed">
          {isReg
            ? "Sign up with verified credentials. Doctors get an instant public profile and automated slot booking synced with the live API."
            : doc
            ? "Access your doctor appointments, clinical profile, and patient consultation slots via the live doctor login endpoint."
            : "Sign in to your patient account to book appointments and consult verified doctors via the live patient login endpoint."}
        </p>

        {/* Live Backend API Info Card */}
        <div className="mt-6 rounded-2xl bg-sea/70 p-4 border border-ink/10 space-y-2">
          <p className="text-xs font-bold text-ink flex items-center gap-1.5">
            <span className="text-sm">🌐</span> Dedicated Login Endpoints:
          </p>
          <div className="space-y-1.5">
            <div className={`p-2.5 rounded-xl border transition ${doc ? "bg-emerald-50 border-emerald-300 ring-2 ring-emerald-200" : "bg-white/70 border-ink/5"}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-900 flex items-center gap-1">
                  <span>🩺</span> Doctor Login API
                </span>
                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100/60 px-1.5 py-0.5 rounded">POST</span>
              </div>
              <code className="text-[11px] font-mono text-ink/80 block mt-1 break-all">
                https://sudhanshutask.pythonanywhere.com/doctor/login/
              </code>
            </div>

            <div className={`p-2.5 rounded-xl border transition ${!doc ? "bg-sky-50 border-sky-300 ring-2 ring-sky-200" : "bg-white/70 border-ink/5"}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-900 flex items-center gap-1">
                  <span>👤</span> Patient Login API
                </span>
                <span className="text-[10px] font-mono text-sky-700 bg-sky-100/60 px-1.5 py-0.5 rounded">POST</span>
              </div>
              <code className="text-[11px] font-mono text-ink/80 block mt-1 break-all">
                https://sudhanshutask.pythonanywhere.com/login/
              </code>
            </div>
          </div>
        </div>

        {/* Quick Demo Test Logins Card */}
        {!isReg && (
          <div className="mt-6 rounded-2xl bg-pine/10 p-4 border border-pine/20">
            <p className="text-xs font-bold text-pine flex items-center justify-between">
              <span>⚡ Live Demo API Credentials</span>
              <span className="text-[10px] font-normal text-pine/80">1-Click Test</span>
            </p>
            <p className="mt-1 text-xs text-ink/70">
              Click either card below to instantly authenticate with live backend credentials:
            </p>

            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {/* Doctor Button */}
              <button
                type="button"
                disabled={Boolean(loadingAction)}
                onClick={() => handle1ClickLogin("akash")}
                className="flex flex-col items-start rounded-xl bg-emerald-600 p-2.5 text-left text-white shadow-xs hover:bg-emerald-700 active:scale-[0.98] transition cursor-pointer disabled:opacity-60"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  <span>🩺</span>
                  <span>Dr. Akash (Doctor)</span>
                </div>
                <span className="mt-0.5 text-[10px] text-white/80 font-mono">akash@gmail.com</span>
                <span className="mt-1 inline-block rounded-md bg-white/20 px-1.5 py-0.5 text-[9px] font-semibold">
                  {loadingAction === "akash" ? "Authenticating..." : "1-Click Doctor Login →"}
                </span>
              </button>

              {/* Patient Button */}
              <button
                type="button"
                disabled={Boolean(loadingAction)}
                onClick={() => handle1ClickLogin("susma")}
                className="flex flex-col items-start rounded-xl bg-sky-600 p-2.5 text-left text-white shadow-xs hover:bg-sky-700 active:scale-[0.98] transition cursor-pointer disabled:opacity-60"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  <span>👤</span>
                  <span>Susma (Patient)</span>
                </div>
                <span className="mt-0.5 text-[10px] text-white/80 font-mono">susma@gmail.com</span>
                <span className="mt-1 inline-block rounded-md bg-white/20 px-1.5 py-0.5 text-[9px] font-semibold">
                  {loadingAction === "susma" ? "Authenticating..." : "1-Click Patient Login →"}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={submit} className="space-y-4 rounded-3xl bg-white p-6 shadow-md border border-ink/10 md:p-8">
        {/* Role Toggle */}
        <div>
          <label className="text-[11px] font-bold text-ink/60 uppercase block mb-1.5">
            Select Login Account Type
          </label>
          <div className="grid grid-cols-2 gap-2 rounded-2xl bg-sea p-1" role="tablist">
            <button
              type="button"
              onClick={() => handleRoleChange("patient")}
              role="tab"
              aria-selected={role === "patient"}
              className={`rounded-xl py-2.5 text-xs font-bold capitalize transition flex items-center justify-center gap-1.5 ${
                role === "patient" ? "bg-sky-600 text-white shadow-sm" : "text-ink/70 hover:text-ink"
              }`}
            >
              <span>👤</span> Patient Login
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange("doctor")}
              role="tab"
              aria-selected={role === "doctor"}
              className={`rounded-xl py-2.5 text-xs font-bold capitalize transition flex items-center justify-center gap-1.5 ${
                role === "doctor" ? "bg-emerald-600 text-white shadow-sm" : "text-ink/70 hover:text-ink"
              }`}
            >
              <span>🩺</span> Doctor Login
            </button>
          </div>
        </div>

        {/* Active Endpoint Indicator Bar */}
        {!isReg && (
          <div className={`rounded-xl p-2.5 border text-xs flex items-center justify-between ${doc ? "bg-emerald-50/70 border-emerald-200" : "bg-sky-50/70 border-sky-200"}`}>
            <span className="font-semibold text-ink/80 flex items-center gap-1.5 text-[11px]">
              <span className={`h-2 w-2 rounded-full ${doc ? "bg-emerald-500" : "bg-sky-500"} animate-pulse`} />
              Target API: <code className="font-mono text-[10px] font-bold">{doc ? "/doctor/login/" : "/login/"}</code>
            </span>
            <button
              type="button"
              onClick={() => autofillCredentials(role)}
              className="text-[11px] font-bold text-pine hover:underline"
            >
              Autofill {doc ? "Dr. Akash" : "Susma"}
            </button>
          </div>
        )}

        {/* Profile Photo Upload Section for Register */}
        {isReg && (
          <div className="rounded-2xl border border-ink/10 bg-sea/40 p-4">
            <label className="text-xs font-bold uppercase tracking-wider text-ink/70 block mb-2">
              {doc ? "Doctor Profile Photo" : "Patient Profile Photo"}
            </label>
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-white ring-2 ring-pine/20 shadow-sm flex items-center justify-center">
                {f.image ? (
                  <img src={f.image} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-2xl text-ink/40">{doc ? "👨‍⚕️" : "👤"}</span>
                )}
              </div>

              <div className="flex-1 space-y-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="user-photo-upload"
                />
                <label
                  htmlFor="user-photo-upload"
                  className="inline-flex items-center gap-1.5 cursor-pointer rounded-full bg-ink px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-pine transition"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  {f.image ? "Change Photo" : "Upload Photo"}
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

        {/* Full Name for Register */}
        {isReg && (
          <div>
            <label className="text-[11px] font-bold text-ink/60 uppercase block mb-1">Full Name</label>
            <input
              className="input text-sm"
              placeholder={doc ? "e.g. Akash" : "e.g. Susma"}
              required
              value={f.name}
              onChange={set("name")}
            />
          </div>
        )}

        {/* Email & Password */}
        <div>
          <label className="text-[11px] font-bold text-ink/60 uppercase block mb-1">Email Address</label>
          <input
            className="input text-sm"
            type="email"
            placeholder={doc ? "akash@gmail.com" : "susma@gmail.com"}
            required
            value={f.email}
            onChange={set("email")}
          />
        </div>

        <div>
          <label className="text-[11px] font-bold text-ink/60 uppercase block mb-1">Password</label>
          <input
            className="input text-sm"
            type="password"
            placeholder={isReg ? "Password (minimum 5 characters)" : "12345"}
            required
            value={f.password}
            onChange={set("password")}
          />
        </div>

        {/* Mobile & Gender (Required by Django API) */}
        {isReg && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-ink/60 uppercase block mb-1">Mobile Number</label>
              <input
                className="input text-sm"
                type="tel"
                placeholder={doc ? "e.g. 9313786545" : "e.g. 9112784800"}
                required
                value={f.mobile}
                onChange={set("mobile")}
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-ink/60 uppercase block mb-1">Gender</label>
              <select
                className="input text-sm cursor-pointer"
                value={f.gender}
                onChange={set("gender")}
                required
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        )}

        {/* Doctor-Specific Details */}
        {isReg && doc && (
          <>
            <div className="grid grid-cols-2 gap-3">
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
              <div>
                <label className="text-[11px] font-bold text-ink/60 uppercase block mb-1">Qualification</label>
                <input
                  className="input text-sm"
                  placeholder="e.g. MBBS, MD"
                  required
                  value={f.qualification}
                  onChange={set("qualification")}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-ink/60 uppercase block mb-1">Reg Number</label>
                <input
                  className="input text-sm"
                  placeholder="e.g. 2332322"
                  required
                  value={f.registration_number}
                  onChange={set("registration_number")}
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-ink/60 uppercase block mb-1">Years of Exp</label>
                <input
                  className="input text-sm"
                  type="number"
                  min="1"
                  max="60"
                  placeholder="e.g. 2"
                  required
                  value={f.experience}
                  onChange={set("experience")}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-ink/60 uppercase block mb-1">Clinic Name</label>
                <input
                  className="input text-sm"
                  placeholder="e.g. Akash Clinic"
                  required
                  value={f.clinic_name}
                  onChange={set("clinic_name")}
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-ink/60 uppercase block mb-1">Clinic Area / Address</label>
                <input
                  className="input text-sm"
                  placeholder="e.g. Vastral"
                  required
                  value={f.clinic_address}
                  onChange={set("clinic_address")}
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-ink/60 uppercase block mb-1">Consultation Fee (₹)</label>
              <input
                className="input text-sm"
                type="number"
                min="100"
                step="50"
                placeholder="e.g. 450"
                required
                value={f.fee}
                onChange={set("fee")}
              />
            </div>

            <textarea
              className="input text-sm"
              rows="2"
              placeholder="Clinical practice bio (optional)"
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

        <button
          disabled={loadingAction === "submit"}
          className={`btn w-full !py-3 font-bold text-sm shadow cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 ${
            doc ? "!bg-emerald-600 hover:!bg-emerald-700" : "!bg-sky-600 hover:!bg-sky-700"
          }`}
        >
          {loadingAction === "submit" && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          )}
          {isReg
            ? doc
              ? "Register Doctor Profile"
              : "Register Patient Profile"
            : doc
            ? "Log In as Doctor →"
            : "Log In as Patient →"}
        </button>

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
