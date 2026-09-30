import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { normalizeImageUrl } from "../services/api.js";
import Logo from "./Logo.jsx";

export default function Navbar() {
  const { user, logout, appts } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [showNotificationPopup, setShowNotificationPopup] = useState(() => {
    // Show toast notification initially if user is logged in
    return Boolean(user && !sessionStorage.getItem("cp_notif_dismissed"));
  });

  const nav = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update notification popup when user changes
  useEffect(() => {
    if (user) {
      // If user logs in, show notification popup
      setShowNotificationPopup(true);
      sessionStorage.removeItem("cp_notif_dismissed");
    } else {
      setShowNotificationPopup(false);
    }
  }, [user?.id, user?.role]);

  const dismissNotification = () => {
    setShowNotificationPopup(false);
    sessionStorage.setItem("cp_notif_dismissed", "true");
  };

  const toggleNotification = () => {
    setShowNotificationPopup((prev) => !prev);
  };

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
    setShowNotificationPopup(false);
    sessionStorage.removeItem("cp_notif_dismissed");
    nav("/");
  };

  const isDoctor = user?.role === "doctor";
  const userInitials = (user?.name || (isDoctor ? "DR" : "US"))
    .replace(/^Dr\.\s*/i, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || (isDoctor ? "DR" : "U");

  // Format display name
  const displayName = isDoctor
    ? (user.name?.startsWith("Dr.") ? user.name : `Dr. ${user.name || "Doctor"}`)
    : (user?.name || "Patient");

  // Calculate appointment count for current user
  const userApptCount = user
    ? (isDoctor
        ? appts.filter((a) => a.doctorId === String(user.id) || a.doctorName === user.name).length
        : appts.filter((a) => a.patientId === user.id || a.patientEmail === user.email).length)
    : 0;

  const linkStyle = ({ isActive }) =>
    `px-3 py-2 text-sm font-semibold transition ${
      isActive ? "text-coral font-bold" : "text-ink/80 hover:text-pine"
    }`;

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-white/95 backdrop-blur shadow-xs">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          {/* Brand Logo */}
          <Logo size="md" />

          {/* Desktop Navigation Links */}
          <nav className="hidden items-center gap-1 md:flex">
            <NavLink to="/" end className={linkStyle}>
              Home
            </NavLink>
            <NavLink to="/diseases" className={linkStyle}>
              Diseases
            </NavLink>
            <NavLink to="/doctors" className={linkStyle}>
              Doctors
            </NavLink>

            {user && (
              <NavLink to="/dashboard" className={linkStyle}>
                Dashboard
              </NavLink>
            )}
          </nav>

          {/* Right Section: Auth State / Logged-in User Pill */}
          <div className="hidden items-center gap-3 md:flex">
            {user ? (
              <div className="relative flex items-center gap-2" ref={dropdownRef}>
                {/* Notification Bell Button */}
                <button
                  type="button"
                  onClick={toggleNotification}
                  title="Toggle login notification popup"
                  className="relative grid h-10 w-10 place-items-center rounded-full bg-sea/60 text-ink/75 hover:bg-sea hover:text-ink transition border border-ink/5"
                  aria-label="Toggle login session notification"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                  {/* Indicator Dot */}
                  <span className={`absolute top-2 right-2 h-2.5 w-2.5 rounded-full ${isDoctor ? "bg-emerald-500" : "bg-sky-500"} ring-2 ring-white`} />
                </button>

                {/* Logged In User/Doctor Pill Button */}
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen((prev) => !prev)}
                  className={`group flex items-center gap-2.5 rounded-full p-1.5 pr-3.5 transition border ${
                    isDoctor
                      ? "bg-emerald-50/80 hover:bg-emerald-100/90 border-emerald-200 text-emerald-950"
                      : "bg-sky-50/80 hover:bg-sky-100/90 border-sky-200 text-sky-950"
                  }`}
                  aria-expanded={profileDropdownOpen}
                  aria-haspopup="true"
                >
                  {/* Avatar / Photo with Online Pulse */}
                  <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full ring-2 ring-white shadow-xs">
                    {user.image ? (
                      <img
                        src={normalizeImageUrl(user.image)}
                        alt={displayName}
                        className="h-full w-full object-cover object-top"
                        onError={(e) => {
                          e.target.style.display = "none";
                          if (e.target.nextSibling) e.target.nextSibling.style.display = "grid";
                        }}
                      />
                    ) : null}
                    <div
                      className={`h-full w-full place-items-center text-xs font-bold text-white ${
                        isDoctor ? "bg-emerald-700" : "bg-sky-700"
                      }`}
                      style={{ display: user.image ? "none" : "grid" }}
                    >
                      {userInitials}
                    </div>

                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-1 ring-white" />
                  </div>

                  {/* Name and Role Label */}
                  <div className="text-left">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-ink truncate max-w-[120px]">
                        {displayName}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.2 text-[10px] font-extrabold uppercase tracking-wider ${
                          isDoctor
                            ? "bg-emerald-600 text-white"
                            : "bg-sky-600 text-white"
                        }`}
                      >
                        {isDoctor ? "🩺 Dr" : "👤 User"}
                      </span>
                    </div>
                  </div>

                  {/* Dropdown Chevron */}
                  <svg
                    className={`h-4 w-4 text-ink/50 transition-transform ${profileDropdownOpen ? "rotate-180" : ""}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {/* Profile & Account Dropdown Pop-up */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 top-12 mt-2 w-80 rounded-3xl bg-white p-5 shadow-2xl ring-1 ring-ink/10 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    {/* Header info */}
                    <div className="flex items-center gap-3 pb-4 border-b border-ink/10">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-sea ring-2 ring-pine/20 shadow">
                        {user.image ? (
                          <img
                            src={normalizeImageUrl(user.image)}
                            alt={displayName}
                            className="h-full w-full object-cover object-top"
                          />
                        ) : (
                          <div className={`grid h-full w-full place-items-center text-lg font-bold text-white ${isDoctor ? "bg-emerald-700" : "bg-sky-700"}`}>
                            {userInitials}
                          </div>
                        )}
                        <span className="absolute bottom-0.5 right-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${
                              isDoctor ? "bg-emerald-100 text-emerald-800 border border-emerald-300" : "bg-sky-100 text-sky-800 border border-sky-300"
                            }`}
                          >
                            {isDoctor ? "Verified Doctor" : "Registered Patient"}
                          </span>
                        </div>
                        <h4 className="mt-1 font-extrabold text-ink text-base truncate">{displayName}</h4>
                        <p className="text-xs text-ink/60 truncate">{user.email}</p>
                      </div>
                    </div>

                    {/* Role specific info */}
                    <div className="my-3 rounded-2xl bg-sea/50 p-3 text-xs border border-ink/5">
                      {isDoctor ? (
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-ink/60">Specialty:</span>
                            <span className="font-bold text-ink">{user.specialization || "General Physician"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-ink/60">Location:</span>
                            <span className="font-bold text-ink">{user.city || "Ahmedabad"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-ink/60">Active Patient Appointments:</span>
                            <span className="font-bold text-pine">{userApptCount}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-ink/60">Account Type:</span>
                            <span className="font-bold text-ink">Patient Portal</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-ink/60">Total Appointments:</span>
                            <span className="font-bold text-pine">{userApptCount} active</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Links */}
                    <div className="space-y-1.5 pt-1">
                      <Link
                        to="/dashboard"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold text-ink hover:bg-sea transition"
                      >
                        <span className="flex items-center gap-2">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="7" height="7" />
                            <rect x="14" y="3" width="7" height="7" />
                            <rect x="14" y="14" width="7" height="7" />
                            <rect x="3" y="14" width="7" height="7" />
                          </svg>
                          Go to Dashboard
                        </span>
                        <span className="text-[10px] text-ink/40">➔</span>
                      </Link>

                      <Link
                        to="/doctors"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold text-ink hover:bg-sea transition"
                      >
                        <span className="flex items-center gap-2">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                          Explore Doctors & Slots
                        </span>
                        <span className="text-[10px] text-ink/40">➔</span>
                      </Link>

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-bold text-coral hover:bg-coral/10 transition mt-2 border-t border-ink/5 pt-2"
                      >
                        <span className="flex items-center gap-2">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                          </svg>
                          Log out of CarePulse
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <NavLink
                  to="/login?role=patient"
                  className="rounded-full bg-sky-50 border border-sky-200 px-3 py-1.5 text-xs font-bold text-sky-800 hover:bg-sky-100 transition flex items-center gap-1.5 shadow-2xs"
                >
                  <span>👤</span> Patient Login
                </NavLink>
                <NavLink
                  to="/login?role=doctor"
                  className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition flex items-center gap-1.5 shadow-2xs"
                >
                  <span>🩺</span> Doctor Login
                </NavLink>
                <Link to="/register" className="btn !py-1.5 !px-3.5 text-xs font-bold shadow-sm ml-1">
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden rounded-lg p-2 text-ink hover:bg-sea"
            aria-label="Menu"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d={mobileMenuOpen ? "M5 5l14 14M19 5L5 19" : "M4 7h16M4 12h16M4 17h16"} />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="border-t border-ink/10 bg-white px-5 py-4 md:hidden animate-in slide-in-from-top duration-200">
            {user ? (
              <div className="mb-4 rounded-2xl bg-sea/60 p-4 border border-ink/10">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-ink text-white grid place-items-center font-bold">
                    {user.image ? (
                      <img
                        src={normalizeImageUrl(user.image)}
                        alt={displayName}
                        className="h-full w-full object-cover object-top"
                      />
                    ) : (
                      userInitials
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-ink truncate">{displayName}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase ${
                          isDoctor ? "bg-emerald-600 text-white" : "bg-sky-600 text-white"
                        }`}
                      >
                        {isDoctor ? "Doctor" : "Patient"}
                      </span>
                    </div>
                    <p className="text-xs text-ink/60 truncate">{user.email}</p>
                  </div>
                </div>
              </div>
            ) : null}

            <nav className="flex flex-col gap-1">
              <NavLink to="/" end className={linkStyle} onClick={() => setMobileMenuOpen(false)}>
                Home
              </NavLink>
              <NavLink to="/diseases" className={linkStyle} onClick={() => setMobileMenuOpen(false)}>
                Diseases
              </NavLink>
              <NavLink to="/doctors" className={linkStyle} onClick={() => setMobileMenuOpen(false)}>
                Doctors
              </NavLink>
              {user && (
                <NavLink to="/dashboard" className={linkStyle} onClick={() => setMobileMenuOpen(false)}>
                  Dashboard
                </NavLink>
              )}
            </nav>

            <div className="mt-4 pt-3 border-t border-ink/10">
              {user ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="btn !bg-coral !py-2.5 w-full text-center text-xs font-bold"
                >
                  Log out ({displayName})
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <NavLink
                    to="/login?role=patient"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn !bg-sky-50 !text-sky-800 border border-sky-200 !py-2 text-center text-xs font-bold"
                  >
                    👤 Patient Login
                  </NavLink>
                  <NavLink
                    to="/login?role=doctor"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn !bg-emerald-50 !text-emerald-800 border border-emerald-200 !py-2 text-center text-xs font-bold"
                  >
                    🩺 Doctor Login
                  </NavLink>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* TOP-RIGHT FLOATING NOTIFICATION POP-UP */}
      {user && showNotificationPopup && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed top-20 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] max-w-sm rounded-3xl bg-white/95 backdrop-blur-md p-4 shadow-2xl border border-ink/10 ring-1 ring-black/5 transition-all duration-300"
        >
          <div className="flex items-start gap-3">
            {/* Role Icon Circle */}
            <div
              className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl text-lg shadow-sm ${
                isDoctor ? "bg-emerald-100 text-emerald-800 ring-2 ring-emerald-300" : "bg-sky-100 text-sky-800 ring-2 ring-sky-300"
              }`}
            >
              {isDoctor ? "🩺" : "👤"}
            </div>

            {/* Notification Text */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-ink/50">
                  Active Login Session
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${
                    isDoctor ? "bg-emerald-600 text-white" : "bg-sky-600 text-white"
                  }`}
                >
                  {isDoctor ? "Doctor Account" : "User / Patient"}
                </span>
              </div>

              <h4 className="mt-1 text-sm font-extrabold text-ink leading-tight">
                Logged in as <span className={isDoctor ? "text-emerald-700" : "text-sky-700"}>{displayName}</span>
              </h4>

              <p className="mt-1 text-xs text-ink/70">
                {isDoctor
                  ? `Clinical specialist (${user.specialization || "General Physician"}) • Ready to receive appointments.`
                  : "Patient account • Browse doctors and manage your consultations."}
              </p>

              {/* Action Buttons in Notification */}
              <div className="mt-3 flex items-center gap-2">
                <Link
                  to="/dashboard"
                  onClick={dismissNotification}
                  className="rounded-xl bg-ink px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-pine transition"
                >
                  Open Dashboard
                </Link>
                <button
                  type="button"
                  onClick={dismissNotification}
                  className="rounded-xl bg-sea px-3 py-1.5 text-xs font-semibold text-ink hover:bg-sea/80 transition"
                >
                  Got it
                </button>
              </div>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={dismissNotification}
              className="text-ink/40 hover:text-ink transition p-1 rounded-md"
              title="Dismiss notification"
              aria-label="Dismiss notification"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </aside>
      )}
    </>
  );
}
