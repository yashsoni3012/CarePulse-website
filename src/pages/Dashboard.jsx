import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { hourOf } from "../data/doctors.js";

const tone = {
  Booked: "bg-amber-100 text-amber-800 border-amber-200",
  Confirmed: "bg-pine/15 text-pine border-pine/20",
  Completed: "bg-ink/10 text-ink border-ink/20",
  Cancelled: "bg-coral/20 text-coral border-coral/30"
};

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

export default function Dashboard() {
  const { user, appts, setStatus, updateProfile } = useAuth();
  const doc = user?.role === "doctor";
  const fileInputRef = useRef(null);

  // Edit Profile Modal State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || "",
    specialization: user?.specialization || "General Physician",
    city: user?.city || "",
    fee: user?.fee || 500,
    experience: user?.experience || 5,
    license: user?.license || "",
    about: user?.about || "",
    image: user?.image || ""
  });
  const [saveMsg, setSaveMsg] = useState("");

  const mine = appts
    .filter((a) => (doc ? a.doctorId === String(user.id) : a.patientId === user.id))
    .sort((a, b) => a.date.localeCompare(b.date) || hourOf(a.slot) - hourOf(b.slot));

  const n = (s) => mine.filter((a) => s.includes(a.status)).length;

  const Btn = ({ id, s, label }) => (
    <button
      onClick={() => setStatus(id, s)}
      className="rounded-full border border-ink/20 px-3 py-1 text-xs font-semibold hover:bg-ink hover:text-white transition"
    >
      {label}
    </button>
  );

  const handleOpenEdit = () => {
    setEditForm({
      name: user?.name || "",
      specialization: user?.specialization || "General Physician",
      city: user?.city || "",
      fee: user?.fee || 500,
      experience: user?.experience || 5,
      license: user?.license || "",
      about: user?.about || "",
      image: user?.image || ""
    });
    setSaveMsg("");
    setIsEditing(true);
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
      setEditForm((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const formattedName = doc && !editForm.name.startsWith("Dr") ? `Dr. ${editForm.name}` : editForm.name;
    const res = updateProfile({
      ...editForm,
      name: formattedName,
      fee: Number(editForm.fee) || 500,
      experience: Number(editForm.experience) || 1
    });

    if (res.ok) {
      setSaveMsg("Profile details and image saved successfully!");
      setTimeout(() => {
        setIsEditing(false);
        setSaveMsg("");
      }, 1000);
    }
  };

  const ini = (user?.name || "").replace(/^Dr\.\s*/i, "").trim().split(/\s+/).filter(Boolean).map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "DR";

  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      {/* Profile Header Box */}
      <div className="rounded-3xl bg-white p-6 md:p-8 shadow-sm border border-ink/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          {/* Doctor / User Profile Avatar */}
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-sea ring-4 ring-pine/20 shadow-md">
            {user?.image ? (
              <img src={user.image} alt={user.name} className="h-full w-full object-cover" />
            ) : (
              <span className="grid h-full w-full place-items-center bg-ink font-display text-2xl font-bold text-white">
                {ini}
              </span>
            )}
            {doc && (
              <span className="absolute bottom-1 right-1 grid h-5 w-5 place-items-center rounded-full bg-pine text-white ring-2 ring-white">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-extrabold text-ink">
                {doc ? "" : "Hello, "}
                {user?.name}
              </h1>
              <span className="rounded-full bg-pine/15 px-2.5 py-0.5 text-xs font-bold text-pine uppercase">
                {user?.role}
              </span>
            </div>

            <p className="mt-1 text-sm text-ink/70">
              {doc
                ? `${user?.specialization || "General Physician"} • ${user?.city || "Ahmedabad"} • Licence: ${user?.license || "Registered"} • Fee: ₹${user?.fee || 500}`
                : "Your personal appointments and health records"}
            </p>

            {doc && user?.about && (
              <p className="mt-2 text-xs text-ink/80 italic max-w-xl">"{user.about}"</p>
            )}
          </div>
        </div>

        {/* Edit Profile Action */}
        <div className="flex flex-col sm:flex-row gap-2 shrink-0">
          {doc && (
            <button
              onClick={handleOpenEdit}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-pine transition"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Edit Doctor Profile &amp; Photo
            </button>
          )}

          {doc && (
            <Link
              to={`/doctors/${user.id}`}
              className="inline-flex items-center justify-center gap-1.5 rounded-full border border-ink/20 px-4 py-2.5 text-xs font-semibold text-ink hover:bg-sea transition"
            >
              View Public Profile
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          )}
        </div>
      </div>

      {/* Appointment Stats */}
      <div className="mt-8 grid grid-cols-3 gap-4 text-center">
        {[
          ["Upcoming", n(["Booked", "Confirmed"]), "text-pine"],
          ["Completed", n(["Completed"]), "text-ink"],
          ["Cancelled", n(["Cancelled"]), "text-coral"]
        ].map(([k, v, color]) => (
          <div key={k} className="rounded-3xl bg-white p-5 shadow-sm border border-ink/10">
            <p className={`font-display text-3xl font-extrabold ${color}`}>{v}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-ink/60">{k}</p>
          </div>
        ))}
      </div>

      {/* Appointments List */}
      <h2 className="mt-10 text-2xl font-bold text-ink">
        {doc ? "Patient Appointments" : "My Scheduled Appointments"}
      </h2>

      {mine.length === 0 ? (
        <div className="mt-4 rounded-3xl bg-white p-10 text-center border border-ink/10 shadow-sm">
          <p className="text-sm text-ink/70">
            {doc
              ? "No patient appointments yet. Patients can find your profile in the Doctors directory to book free slots."
              : "You have no appointments yet. Browse our verified doctors to book your first slot."}
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
              className="flex flex-col gap-3 rounded-2xl bg-white p-5 shadow-sm border border-ink/10 md:flex-row md:items-center md:justify-between transition hover:shadow-md"
            >
              <div>
                <p className="font-bold text-ink text-base">
                  {doc ? a.patientName : a.doctorName}
                  <span className="ml-2 rounded-md bg-sea px-2 py-0.5 text-xs font-semibold text-ink/70">
                    {doc ? a.patientEmail : a.specialization}
                  </span>
                </p>
                <p className="mt-1 text-xs text-ink/70">
                  📅 <strong>{a.date}</strong> at <strong>{a.slot}</strong>
                  {a.reason ? ` • Note: ${a.reason}` : ""}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
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

      {/* Edit Doctor Profile Modal */}
      {isEditing && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setIsEditing(false)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 md:p-8 shadow-2xl border border-ink/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-ink/10 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-pine">Doctor Profile Settings</span>
                <h2 className="text-2xl font-bold text-ink mt-0.5">Edit Profile &amp; Image</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="grid h-8 w-8 place-items-center rounded-full bg-ink/10 text-ink hover:bg-ink hover:text-white transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="mt-6 space-y-4">
              {/* Doctor Image Change / Upload */}
              <div className="rounded-2xl border border-ink/10 bg-sea/40 p-4">
                <label className="text-xs font-bold uppercase tracking-wider text-ink/70 block mb-2">
                  Doctor Profile Picture
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-white ring-2 ring-pine/30 shadow-sm flex items-center justify-center">
                    {editForm.image ? (
                      <img src={editForm.image} alt="Doctor preview" className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-2xl text-ink/40">👨‍⚕️</span>
                    )}
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="edit-doctor-photo"
                    />
                    <label
                      htmlFor="edit-doctor-photo"
                      className="inline-flex items-center gap-1.5 cursor-pointer rounded-full bg-ink px-4 py-2 text-xs font-bold text-white hover:bg-pine transition"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      {editForm.image ? "Upload Different Photo" : "Upload Doctor Photo"}
                    </label>

                    {editForm.image && (
                      <button
                        type="button"
                        onClick={() => setEditForm((prev) => ({ ...prev, image: "" }))}
                        className="ml-3 text-xs font-semibold text-coral hover:underline"
                      >
                        Remove Photo
                      </button>
                    )}
                    <p className="text-[11px] text-ink/50">Stored securely in your browser's local storage.</p>
                  </div>
                </div>
              </div>

              {/* Doctor Details */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-ink/70 block mb-1">Doctor Name</label>
                <input
                  className="input text-sm"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-ink/70 block mb-1">Specialization</label>
                  <select
                    className="input text-sm cursor-pointer"
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
                  <label className="text-xs font-bold uppercase tracking-wider text-ink/70 block mb-1">City</label>
                  <input
                    className="input text-sm"
                    value={editForm.city}
                    onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-ink/70 block mb-1">Consultation Fee (₹)</label>
                  <input
                    className="input text-sm"
                    type="number"
                    min="100"
                    step="50"
                    value={editForm.fee}
                    onChange={(e) => setEditForm({ ...editForm, fee: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-ink/70 block mb-1">Experience (Years)</label>
                  <input
                    className="input text-sm"
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
                <label className="text-xs font-bold uppercase tracking-wider text-ink/70 block mb-1">Medical Licence Number</label>
                <input
                  className="input text-sm"
                  value={editForm.license}
                  onChange={(e) => setEditForm({ ...editForm, license: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-ink/70 block mb-1">About / Clinic Description</label>
                <textarea
                  className="input text-sm"
                  rows="3"
                  value={editForm.about}
                  onChange={(e) => setEditForm({ ...editForm, about: e.target.value })}
                  placeholder="Share your clinic specialties, clinical approach, and treatment focus..."
                />
              </div>

              {saveMsg && (
                <p role="status" className="rounded-xl bg-pine p-3 text-xs font-bold text-white text-center shadow">
                  ✓ {saveMsg}
                </p>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-ink/10">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-full px-5 py-2.5 text-xs font-bold text-ink/70 hover:bg-sea transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-coral px-6 py-2.5 text-xs font-bold text-white shadow hover:bg-ink transition"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
