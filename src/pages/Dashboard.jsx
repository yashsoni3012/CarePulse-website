import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { hourOf } from "../data/doctors.js";
import { normalizeImageUrl } from "../services/api.js";

const tone = {
  Booked: "bg-amber-100 text-amber-800 border-amber-200",
  Confirmed: "bg-pine/15 text-pine border-pine/20",
  Completed: "bg-ink/10 text-ink border-ink/20",
  Cancelled: "bg-coral/20 text-coral border-coral/30"
};

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

export default function Dashboard() {
  const { user, appts, setStatus, updateProfile, refreshApiData } = useAuth();
  const doc = user?.role === "doctor";
  const fileInputRef = useRef(null);

  // Edit Profile Modal State
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const [editForm, setEditForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    mobile: user?.mobile || "",
    gender: user?.gender || "male",
    specialization: user?.specialization || "General Physician (MBBS)",
    qualification: user?.qualification || "MBBS",
    city: user?.clinic_address || user?.city || "Vastral",
    fee: user?.fee || 450,
    experience: user?.experience || 2,
    registration_number: user?.registration_number || user?.license || "",
    clinic_name: user?.clinic_name || "",
    clinic_address: user?.clinic_address || "Vastral",
    about: user?.about || "",
    image: user?.image || ""
  });

  const mine = appts
    .filter((a) => {
      if (doc) {
        return (
          String(a.doctorId) === String(user?.id) ||
          String(a.doctorId) === String(user?.apiId) ||
          (user?.email && a.doctorEmail && a.doctorEmail.toLowerCase() === user.email.toLowerCase()) ||
          (user?.name && a.doctorName && a.doctorName.toLowerCase().includes(user.name.toLowerCase()))
        );
      }
      return (
        String(a.patientId) === String(user?.id) ||
        (user?.email && a.patientEmail && a.patientEmail.toLowerCase() === user.email.toLowerCase())
      );
    })
    .sort((a, b) => a.date.localeCompare(b.date) || hourOf(a.slot) - hourOf(b.slot));

  const n = (s) => mine.filter((a) => s.includes(a.status)).length;

  const Btn = ({ id, s, label }) => (
    <button
      onClick={() => setStatus(id, s)}
      className="rounded-full border border-ink/20 px-3 py-1 text-xs font-semibold hover:bg-ink hover:text-white transition cursor-pointer"
    >
      {label}
    </button>
  );

  const handleOpenEdit = () => {
    setEditForm({
      name: user?.name || "",
      email: user?.email || "",
      mobile: user?.mobile || "",
      gender: user?.gender || "male",
      specialization: user?.specialization || "General Physician (MBBS)",
      qualification: user?.qualification || "MBBS",
      city: user?.clinic_address || user?.city || "Vastral",
      fee: user?.fee || 450,
      experience: user?.experience || 2,
      registration_number: user?.registration_number || user?.license || "",
      clinic_name: user?.clinic_name || "",
      clinic_address: user?.clinic_address || "Vastral",
      about: user?.about || "",
      image: user?.image || ""
    });
    setSaveMsg("");
    setIsEditing(true);
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshApiData();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      alert("Please choose an image under 3MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setEditForm((prev) => ({ ...prev, image: reader.result, imageFile: file }));
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMsg("");

    const formattedName =
      doc && !editForm.name.startsWith("Dr") ? `Dr. ${editForm.name}` : editForm.name;

    try {
      const res = await updateProfile({
        ...editForm,
        name: formattedName,
        fee: Number(editForm.fee) || 450,
        experience: Number(editForm.experience) || 2
      });

      if (res.ok) {
        setSaveMsg("✓ Profile details saved successfully.");
        setTimeout(() => {
          setIsEditing(false);
          setSaveMsg("");
        }, 1200);
      } else {
        setSaveMsg(res.error || "Failed to update profile.");
      }
    } catch (err) {
      setSaveMsg(err.message || "An error occurred while updating profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const ini =
    (user?.name || (doc ? "DR" : "US"))
      .replace(/^Dr\.\s*/i, "")
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || (doc ? "DR" : "U");

  const liveEndpoint = doc
    ? "https://sudhanshutask.pythonanywhere.com/doctor/profile/1/"
    : "https://sudhanshutask.pythonanywhere.com/user/profile/1/";

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Live Profile Header Box */}
      <div className="rounded-3xl bg-white p-5 sm:p-7 md:p-8 shadow-sm border border-ink/10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 min-w-0 flex-1">
          {/* Doctor / User Profile Avatar (Explicitly sized to prevent overflow blowout) */}
          <div
            className="relative shrink-0 overflow-hidden rounded-2xl md:rounded-3xl bg-sea ring-4 ring-pine/20 shadow-md flex items-center justify-center self-start sm:self-center"
            style={{
              width: "96px",
              height: "96px",
              minWidth: "96px",
              minHeight: "96px",
              maxWidth: "96px",
              maxHeight: "96px"
            }}
          >
            {user?.image ? (
              <img
                src={normalizeImageUrl(user.image)}
                alt={user.name}
                className="w-full h-full object-cover object-top"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => {
                  e.target.style.display = "none";
                  if (e.target.nextSibling) e.target.nextSibling.style.display = "grid";
                }}
              />
            ) : null}
            <span
              className="grid h-full w-full place-items-center bg-ink font-display text-2xl font-bold text-white"
              style={{ display: user?.image ? "none" : "grid" }}
            >
              {ini}
            </span>
            {doc && (
              <span className="absolute bottom-1 right-1 grid h-5 w-5 place-items-center rounded-full bg-pine text-white ring-2 ring-white">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
            )}
          </div>

          {/* Profile Name & Primary Details */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-ink break-words">
                {doc ? "" : "Hello, "}
                {user?.name}
              </h1>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${
                  doc
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    : "bg-sky-100 text-sky-800 border border-sky-300"
                }`}
              >
                {doc ? "Doctor Portal" : "Patient Portal"}
              </span>
              {/* <span className="rounded-full bg-pine/15 px-2 py-0.5 text-[10px] font-bold text-pine uppercase flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live API
              </span> */}
            </div>

            {/* Profile Info Details */}
            <div className="mt-2 text-sm text-ink/75 space-y-1">
              {doc ? (
                <>
                  <p className="font-semibold text-ink break-words">
                    {user?.specialization || "General Physician (MBBS)"}
                    {user?.clinic_name ? ` • 🏥 ${user.clinic_name}` : ""}
                    {user?.clinic_address ? ` (${user.clinic_address})` : user?.city ? ` (${user.city})` : ""}
                  </p>
                  <p className="text-xs text-ink/60 flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span>
                      {user?.registration_number
                        ? `Medical Reg: #${user.registration_number}`
                        : user?.license
                        ? `Licence: ${user.license}`
                        : "Verified Practitioner"}
                    </span>
                    {user?.mobile && <span>• 📱 +91 {user.mobile}</span>}
                    {user?.fee && <span>• 💳 Fee: ₹{user.fee}</span>}
                    {user?.experience && <span>• ⏳ {user.experience} yrs exp</span>}
                  </p>
                </>
              ) : (
                <>
                  <p className="font-medium text-ink/80 break-words">
                    📧 {user?.email}
                    {user?.mobile ? ` • 📱 +91 ${user.mobile}` : ""}
                    {user?.gender ? ` • Gender: ${user.gender}` : ""}
                  </p>
                  {/* <p className="text-xs text-ink/60">
                    Patient Profile synchronized with live authentication records.
                  </p> */}
                </>
              )}

              {/* Endpoint Link Badge */}
              {/* <div className="pt-1.5">
                <span className="inline-flex max-w-full flex-wrap items-center gap-1.5 rounded-lg bg-sea px-2.5 py-1 text-[11px] font-mono text-ink/70 border border-ink/5">
                  <span className="font-bold text-pine">API:</span>
                  <a
                    href={liveEndpoint}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline text-ink hover:text-pine break-all"
                    title="Open live endpoint in browser"
                  >
                    {liveEndpoint}
                  </a>
                </span>
              </div> */}
            </div>

            {doc && user?.about && (
              <p className="mt-2 text-xs text-ink/80 italic max-w-xl line-clamp-2">"{user.about}"</p>
            )}
          </div>
        </div>

        {/* Edit & Action Buttons */}
        <div className="flex flex-wrap sm:flex-nowrap lg:flex-col gap-2.5 shrink-0 w-full lg:w-auto">
          <button
            onClick={handleOpenEdit}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold text-white shadow-sm transition cursor-pointer ${
              doc ? "bg-emerald-700 hover:bg-emerald-800" : "bg-sky-700 hover:bg-sky-800"
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            {doc ? "Edit Doctor Profile & Clinic" : "Edit Patient Profile"}
          </button>

          <div className="flex w-full sm:w-auto gap-2">
            {doc ? (
              <Link
                to={`/doctors/${user?.id || 1}`}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full border border-ink/20 px-4 py-2.5 text-xs font-semibold text-ink hover:bg-sea transition"
              >
                View Public Card
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>
            ) : (
              <Link
                to="/doctors"
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full border border-ink/20 px-4 py-2.5 text-xs font-semibold text-ink hover:bg-sea transition"
              >
                Browse Doctors
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>
            )}

            <button
              type="button"
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              title="Refresh latest data from API"
              className="inline-flex items-center justify-center gap-1 rounded-full border border-ink/10 px-3.5 py-2 text-xs font-semibold text-ink/70 hover:bg-sea hover:text-ink transition cursor-pointer disabled:opacity-50"
            >
              <svg
                className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <polyline points="23 4 23 10 17 10" />
                <polyline points="1 20 1 14 7 14" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
              <span>{isRefreshing ? "..." : "Sync"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Doctor-Specific Details Card: Clinic, Qualifications & PATCH Trigger */}
      {doc && (
        <div className="mt-6 rounded-3xl bg-white p-5 sm:p-7 border border-ink/10 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-ink/10 gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-pine">Doctor Practice & Clinic Details</span>
              <h2 className="text-xl font-bold text-ink">Clinical Profile Overview</h2>
              {/* <p className="text-xs text-ink/60">Live synced with endpoint: <code className="font-mono">GET & PATCH /doctor/profile/1/</code></p> */}
            </div>
            <button
              type="button"
              onClick={handleOpenEdit}
              className="inline-flex items-center gap-1.5 rounded-full border border-pine/30 bg-pine/10 px-4 py-2 text-xs font-bold text-pine hover:bg-pine hover:text-white transition cursor-pointer w-fit"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Edit Doctor Details
            </button>
          </div>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="rounded-2xl bg-sea/40 p-4 border border-ink/5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-ink/50 block">🏥 Clinic Name</span>
              <p className="mt-1 font-bold text-ink text-sm truncate">{user?.clinic_name || "Akash Care Clinic"}</p>
            </div>
            <div className="rounded-2xl bg-sea/40 p-4 border border-ink/5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-ink/50 block">📍 Clinic Address</span>
              <p className="mt-1 font-bold text-ink text-sm truncate">{user?.clinic_address || user?.city || "Vastral, Ahmedabad"}</p>
            </div>
            <div className="rounded-2xl bg-sea/40 p-4 border border-ink/5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-ink/50 block">🩺 Specialization</span>
              <p className="mt-1 font-bold text-ink text-sm truncate">{user?.specialization || "General Physician (MBBS)"}</p>
            </div>
            <div className="rounded-2xl bg-sea/40 p-4 border border-ink/5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-ink/50 block">🎓 Qualification</span>
              <p className="mt-1 font-bold text-ink text-sm truncate">{user?.qualification || "MBBS"}</p>
            </div>
            <div className="rounded-2xl bg-sea/40 p-4 border border-ink/5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-ink/50 block">⏳ Experience</span>
              <p className="mt-1 font-bold text-ink text-sm">{user?.experience || 2} Years Clinical Practice</p>
            </div>
            <div className="rounded-2xl bg-sea/40 p-4 border border-ink/5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-ink/50 block">📜 Registration Number</span>
              <p className="mt-1 font-bold text-ink text-sm font-mono">{user?.registration_number || user?.license || "2332322"}</p>
            </div>
            <div className="rounded-2xl bg-sea/40 p-4 border border-ink/5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-ink/50 block">💳 Consultation Fee</span>
              <p className="mt-1 font-bold text-ink text-sm text-pine">₹{user?.fee || 450}</p>
            </div>
            <div className="rounded-2xl bg-sea/40 p-4 border border-ink/5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-ink/50 block">📱 Contact Mobile</span>
              <p className="mt-1 font-bold text-ink text-sm">+91 {user?.mobile || "9313786545"}</p>
            </div>
          </div>

          {user?.about && (
            <div className="mt-4 rounded-2xl bg-white p-4 border border-ink/10">
              <span className="text-[11px] font-bold uppercase tracking-wider text-ink/50 block mb-1">Clinic Practice Bio</span>
              <p className="text-xs text-ink/80 leading-relaxed italic">{user.about}</p>
            </div>
          )}
        </div>
      )}

      {/* Appointment Stats Cards */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-center">
        {[
          ["Upcoming", n(["Booked", "Confirmed"]), "text-pine"],
          ["Completed", n(["Completed"]), "text-ink"],
          ["Cancelled", n(["Cancelled"]), "text-coral"]
        ].map(([k, v, color]) => (
          <div key={k} className="rounded-3xl bg-white p-4 sm:p-5 shadow-sm border border-ink/10">
            <p className={`font-display text-2xl sm:text-3xl font-extrabold ${color}`}>{v}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-ink/60">{k}</p>
          </div>
        ))}
      </div>

      {/* Appointments List */}
      <h2 className="mt-8 md:mt-10 text-xl sm:text-2xl font-bold text-ink">
        {doc ? "Patient Appointments & Consultations" : "My Scheduled Consultations"}
      </h2>

      {mine.length === 0 ? (
        <div className="mt-4 rounded-3xl bg-white p-8 sm:p-10 text-center border border-ink/10 shadow-sm">
          <p className="text-sm text-ink/70">
            {doc
              ? "No patient appointments booked yet. Patients can find your profile in the Doctors directory to schedule consultation slots."
              : "You have no upcoming consultations. Browse our verified doctors to book your first slot."}
          </p>
          {!doc && (
            <Link to="/doctors" className="btn mt-4 inline-block !py-2 text-xs">
              Find a Doctor
            </Link>
          )}
        </div>
      ) : (
        <ul className="mt-4 space-y-3">
          {mine.map((a) => (
            <li
              key={a.id}
              className="flex flex-col gap-3 rounded-2xl bg-white p-4 sm:p-5 shadow-sm border border-ink/10 md:flex-row md:items-center md:justify-between transition hover:shadow-md"
            >
              <div className="min-w-0">
                <p className="font-bold text-ink text-base break-words">
                  {doc ? `Patient: ${a.patientName}` : a.doctorName}
                  <span className="ml-2 inline-block rounded-md bg-sea px-2 py-0.5 text-xs font-semibold text-ink/70">
                    {doc ? (a.patientMobile ? `Tel: +91 ${a.patientMobile}` : a.patientEmail) : a.specialization}
                  </span>
                </p>
                <p className="mt-1 text-xs text-ink/70 break-words">
                  📅 <strong>{a.date}</strong> at <strong>{a.slot}</strong>
                  {a.clinicName ? ` • Clinic: ${a.clinicName}` : ""}
                  {a.reason ? ` • Note: ${a.reason}` : ""}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <span className={`rounded-full px-3 py-1 text-xs font-bold border ${tone[a.status] || "bg-sea text-ink"}`}>
                  {a.status}
                </span>
                {doc && a.status === "Booked" && <Btn id={a.id} s="Confirmed" label="Confirm" />}
                {doc && ["Booked", "Confirmed"].includes(a.status) && (
                  <Btn id={a.id} s="Completed" label="Mark Completed" />
                )}
                {["Booked", "Confirmed"].includes(a.status) && <Btn id={a.id} s="Cancelled" label="Cancel Slot" />}
                {!doc && (
                  <Link
                    to={`/doctors/${a.doctorId}#reviews`}
                    className="rounded-full bg-amber-50 border border-amber-300 px-3 py-1 text-xs font-bold text-amber-800 hover:bg-amber-100 transition inline-flex items-center gap-1"
                  >
                    ★ Rate Doctor
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Profile Edit Modal (Doctor & Patient) */}
      {isEditing && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 sm:p-4 backdrop-blur-sm overflow-y-auto"
          onClick={() => setIsEditing(false)}
        >
          <div
            className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-5 sm:p-7 md:p-8 shadow-2xl border border-ink/10 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-ink/10 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-pine">
                  {doc ? "Doctor Profile Settings" : "Patient Profile Settings"}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-ink mt-0.5">
                  {doc ? "Edit Doctor Profile & Clinic" : "Edit Patient Profile"}
                </h2>
                {/* <code className="text-[11px] font-mono text-ink/60 block mt-1">
                  API: PATCH {doc ? "/doctor/profile/1/" : "/user/profile/1/"}
                </code> */}
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="grid h-8 w-8 place-items-center rounded-full bg-ink/10 text-ink hover:bg-ink hover:text-white transition cursor-pointer shrink-0"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="mt-5 space-y-4">
              {/* Photo Change / Upload */}
              <div className="rounded-2xl border border-ink/10 bg-sea/40 p-4">
                <label className="text-xs font-bold uppercase tracking-wider text-ink/70 block mb-2">
                  Profile Photo
                </label>
                <div className="flex items-center gap-4">
                  <div
                    className="relative shrink-0 overflow-hidden rounded-2xl bg-white ring-2 ring-pine/30 shadow-sm flex items-center justify-center"
                    style={{ width: "72px", height: "72px", minWidth: "72px", minHeight: "72px" }}
                  >
                    {editForm.image ? (
                      <img
                        src={normalizeImageUrl(editForm.image)}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <span className="text-2xl text-ink/40">{doc ? "👨‍⚕️" : "👤"}</span>
                    )}
                  </div>

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="edit-profile-photo"
                    />
                    <label
                      htmlFor="edit-profile-photo"
                      className="inline-flex items-center gap-1.5 cursor-pointer rounded-full bg-ink px-4 py-2 text-xs font-bold text-white hover:bg-pine transition"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      {editForm.image ? "Change Photo" : "Upload New Photo"}
                    </label>

                    {editForm.image && (
                      <button
                        type="button"
                        onClick={() => setEditForm((prev) => ({ ...prev, image: "" }))}
                        className="ml-3 text-xs font-semibold text-coral hover:underline cursor-pointer"
                      >
                        Remove Photo
                      </button>
                    )}
                    <p className="text-[11px] text-ink/50">PNG, JPG or WEBP (Max 3MB)</p>
                  </div>
                </div>
              </div>

              {/* Common Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-ink/70 block mb-1">
                    {doc ? "Doctor Name" : "Full Name"}
                  </label>
                  <input
                    className="input text-sm w-full"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-ink/70 block mb-1">
                    Mobile Number
                  </label>
                  <input
                    className="input text-sm w-full"
                    type="tel"
                    value={editForm.mobile}
                    onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })}
                    placeholder="e.g. 9313786545"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-ink/70 block mb-1">
                    Email Address
                  </label>
                  <input
                    className="input text-sm w-full"
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-ink/70 block mb-1">
                    Gender
                  </label>
                  <select
                    className="input text-sm w-full"
                    value={editForm.gender}
                    onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Doctor-Specific Fields */}
              {doc && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-ink/70 block mb-1">
                        Specialization
                      </label>
                      <select
                        className="input text-sm w-full"
                        value={editForm.specialization}
                        onChange={(e) => setEditForm({ ...editForm, specialization: e.target.value })}
                      >
                        {SPECS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-ink/70 block mb-1">
                        Degree / Qualification
                      </label>
                      <input
                        className="input text-sm w-full"
                        value={editForm.qualification}
                        onChange={(e) => setEditForm({ ...editForm, qualification: e.target.value })}
                        placeholder="e.g. MBBS, MD"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-ink/70 block mb-1">
                        Clinic / Hospital Name
                      </label>
                      <input
                        className="input text-sm w-full"
                        value={editForm.clinic_name}
                        onChange={(e) => setEditForm({ ...editForm, clinic_name: e.target.value })}
                        placeholder="e.g. Akash Care Clinic"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-ink/70 block mb-1">
                        Clinic Location / Address
                      </label>
                      <input
                        className="input text-sm w-full"
                        value={editForm.clinic_address}
                        onChange={(e) => setEditForm({ ...editForm, clinic_address: e.target.value })}
                        placeholder="e.g. Vastral"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-ink/70 block mb-1">
                        Consultation Fee (₹)
                      </label>
                      <input
                        className="input text-sm w-full"
                        type="number"
                        min="100"
                        step="50"
                        value={editForm.fee}
                        onChange={(e) => setEditForm({ ...editForm, fee: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-ink/70 block mb-1">
                        Experience (Years)
                      </label>
                      <input
                        className="input text-sm w-full"
                        type="number"
                        min="1"
                        max="60"
                        value={editForm.experience}
                        onChange={(e) => setEditForm({ ...editForm, experience: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-ink/70 block mb-1">
                      Registration Number
                    </label>
                    <input
                      className="input text-sm w-full"
                      value={editForm.registration_number}
                      onChange={(e) => setEditForm({ ...editForm, registration_number: e.target.value })}
                      placeholder="e.g. 2332322"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-ink/70 block mb-1">
                      About / Clinic Practice Bio
                    </label>
                    <textarea
                      className="input text-sm w-full"
                      rows="3"
                      value={editForm.about}
                      onChange={(e) => setEditForm({ ...editForm, about: e.target.value })}
                      placeholder="Share your clinic specialties, clinical approach, and treatment focus..."
                    />
                  </div>
                </>
              )}

              {saveMsg && (
                <p
                  role="status"
                  className={`rounded-xl p-3 text-xs font-bold text-center shadow ${
                    saveMsg.includes("✓") || saveMsg.includes("success")
                      ? "bg-pine text-white"
                      : "bg-coral/20 text-ink border border-coral/30"
                  }`}
                >
                  {saveMsg}
                </p>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-ink/10">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-full px-5 py-2.5 text-xs font-bold text-ink/70 hover:bg-sea transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className={`rounded-full px-6 py-2.5 text-xs font-bold text-white shadow transition cursor-pointer disabled:opacity-60 flex items-center gap-1.5 ${
                    doc ? "bg-emerald-600 hover:bg-emerald-700" : "bg-sky-600 hover:bg-sky-700"
                  }`}
                >
                  {isSaving && (
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  )}
                  {isSaving ? "Saving..." : "Save Profile Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
