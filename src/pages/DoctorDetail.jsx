import { useState, useMemo, useRef } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { SLOTS, hourOf } from "../data/doctors.js";
import { normalizeImageUrl } from "../services/api.js";

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

const iso = (d) => d.toLocaleDateString("en-CA");

export default function DoctorDetail() {
  const { id } = useParams();
  const { doctors, user, book, isTaken, reviews, addOrUpdateReview, deleteReview, updateProfile } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();

  const d = doctors.find((x) => String(x.id) === String(id) || String(x.apiId) === String(id));
  const days = Array.from({ length: 7 }, (_, i) => {
    const t = new Date();
    t.setDate(t.getDate() + i);
    return t;
  });

  const [date, setDate] = useState(iso(days[0]));
  const [slot, setSlot] = useState("");
  const [reason, setReason] = useState("");
  const [msg, setMsg] = useState(null);

  // Doctor Profile Edit (PATCH) State
  const [isEditingDoc, setIsEditingDoc] = useState(false);
  const [isSavingDoc, setIsSavingDoc] = useState(false);
  const [docSaveMsg, setDocSaveMsg] = useState("");
  const docFileRef = useRef(null);

  const [docForm, setDocForm] = useState({
    name: d?.name || "",
    email: d?.email || "",
    mobile: d?.mobile || "",
    gender: d?.gender || "male",
    specialization: d?.specialization || "General Physician (MBBS)",
    qualification: d?.qualification || "MBBS",
    experience: d?.experience || 2,
    fee: d?.fee || 450,
    registration_number: d?.registration_number || d?.license || "",
    clinic_name: d?.clinic_name || "",
    clinic_address: d?.clinic_address || d?.city || "Vastral",
    about: d?.about || "",
    image: d?.image || ""
  });

  const handleOpenDocEdit = () => {
    if (!d) return;
    setDocForm({
      name: d.name || "",
      email: d.email || "",
      mobile: d.mobile || "",
      gender: d.gender || "male",
      specialization: d.specialization || "General Physician (MBBS)",
      qualification: d.qualification || "MBBS",
      experience: d.experience || 2,
      fee: d.fee || 450,
      registration_number: d.registration_number || d.license || "",
      clinic_name: d.clinic_name || "",
      clinic_address: d.clinic_address || d.city || "Vastral",
      about: d.about || "",
      image: d.image || ""
    });
    setDocSaveMsg("");
    setIsEditingDoc(true);
  };

  const handleDocImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      alert("Please choose an image under 3MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setDocForm((prev) => ({ ...prev, image: reader.result, imageFile: file }));
    };
    reader.readAsDataURL(file);
  };

  const handleSaveDocProfile = async (e) => {
    e.preventDefault();
    setIsSavingDoc(true);
    setDocSaveMsg("");

    const formattedName = !docForm.name.startsWith("Dr") ? `Dr. ${docForm.name}` : docForm.name;

    try {
      const res = await updateProfile({
        ...docForm,
        name: formattedName,
        fee: Number(docForm.fee) || 450,
        experience: Number(docForm.experience) || 2
      });

      if (res.ok) {
        setDocSaveMsg("✓ Doctor details updated successfully via live PATCH API!");
        setTimeout(() => {
          setIsEditingDoc(false);
          setDocSaveMsg("");
        }, 1200);
      } else {
        setDocSaveMsg(res.error || "Failed to update doctor profile.");
      }
    } catch (err) {
      setDocSaveMsg(err.message || "Failed to update doctor profile.");
    } finally {
      setIsSavingDoc(false);
    }
  };

  // Rating & Review State
  const doctorReviews = useMemo(
    () => (reviews || []).filter((r) => r.doctorId === String(id)),
    [reviews, id]
  );

  const userReview = useMemo(
    () =>
      user
        ? doctorReviews.find((r) => r.userId === user.id || r.userEmail === user.email)
        : null,
    [doctorReviews, user]
  );

  const [isEditingRating, setIsEditingRating] = useState(false);
  const [selectedStars, setSelectedStars] = useState(5);
  const [hoverStars, setHoverStars] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewFeedback, setReviewFeedback] = useState(null);

  if (!d) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-16">
        <p className="text-lg">Doctor not found.</p>
        <Link to="/doctors" className="mt-3 inline-block font-semibold text-pine hover:underline">
          Back to doctors
        </Link>
      </div>
    );
  }

  const off = (s) => isTaken(d.id, date, s) || (date === iso(days[0]) && hourOf(s) <= new Date().getHours());

  const submit = (e) => {
    e.preventDefault();
    if (!user) return nav("/login", { state: { from: loc } });
    if (user.role !== "patient") return setMsg({ e: "Log in with a patient account to book an appointment." });
    if (!slot) return setMsg({ e: "Choose a time slot first." });
    const r = book(d, date, slot, reason);
    r.ok
      ? (setMsg({ ok: `Booked for ${date} at ${slot}. Track it in your dashboard.` }), setSlot(""), setReason(""))
      : setMsg({ e: r.error });
  };

  const handleStartEdit = () => {
    if (userReview) {
      setSelectedStars(userReview.rating);
      setReviewComment(userReview.comment || "");
    } else {
      setSelectedStars(5);
      setReviewComment("");
    }
    setIsEditingRating(true);
    setReviewFeedback(null);
  };

  const handleCancelEdit = () => {
    setIsEditingRating(false);
    setReviewFeedback(null);
  };

  const handleSaveRating = (e) => {
    e.preventDefault();
    if (!user) return nav("/login", { state: { from: loc } });
    if (user.role !== "patient") {
      setReviewFeedback({ type: "error", text: "Only registered patient accounts can rate doctors." });
      return;
    }

    const res = addOrUpdateReview({
      doctorId: d.id,
      rating: selectedStars,
      comment: reviewComment
    });

    if (res.ok) {
      setReviewFeedback({
        type: "success",
        text: res.isEdit ? "Your rating was successfully updated!" : "Thank you! Your rating has been recorded."
      });
      setIsEditingRating(false);
    } else {
      setReviewFeedback({ type: "error", text: res.error || "Failed to save rating." });
    }
  };

  const handleDeleteRating = () => {
    if (!userReview) return;
    if (window.confirm("Are you sure you want to remove your rating?")) {
      deleteReview(userReview.id);
      setIsEditingRating(false);
      setReviewComment("");
      setSelectedStars(5);
      setReviewFeedback({ type: "success", text: "Your review has been removed." });
    }
  };

  const ini = (d?.name || "").replace(/^Dr\.\s*/i, "").trim().split(/\s+/).filter(Boolean).map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "DR";

  // Calculate breakdown for 5, 4, 3, 2, 1 stars
  const totalReviews = doctorReviews.length;
  const starCounts = [5, 4, 3, 2, 1].map((s) => ({
    stars: s,
    count: doctorReviews.filter((r) => Math.round(Number(r.rating)) === s).length
  }));

  const starLabels = {
    1: "Poor (1/5)",
    2: "Fair (2/5)",
    3: "Good (3/5)",
    4: "Very Good (4/5)",
    5: "Excellent (5/5)"
  };

  const activeStarCount = hoverStars || selectedStars;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link to="/doctors" className="inline-flex items-center gap-1.5 font-semibold text-pine hover:underline">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to all doctors
        </Link>

        {user?.role === "doctor" && (
          <button
            type="button"
            onClick={handleOpenDocEdit}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 text-xs font-bold shadow-sm transition cursor-pointer"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Edit Doctor Profile (PATCH API)
          </button>
        )}
      </div>

      {/* Doctor Account Banner */}
      {user?.role === "doctor" && (
        <div className="mt-4 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-700 text-white font-bold text-lg">
              🩺
            </span>
            <div>
              <p className="text-xs font-bold text-emerald-950">Doctor Profile Mode</p>
              <p className="text-[11px] text-emerald-800">
                You are currently viewing this doctor profile. You can edit clinic details, qualification, experience, and fee using live PATCH API.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleOpenDocEdit}
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-1.5 text-xs font-bold shadow-xs transition cursor-pointer"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Edit Details
            </button>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-900 hover:bg-emerald-50 transition"
            >
              Dashboard →
            </Link>
          </div>
        </div>
      )}

      {/* Top Grid: Doctor Info & Appointment Booking */}
      <div className="mt-6 grid gap-8 lg:grid-cols-5">
        {/* Doctor Information Card */}
        <section className="rounded-3xl bg-white p-5 sm:p-7 md:p-8 lg:col-span-3 border border-ink/10 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            {/* Doctor Photo (Strictly sized to prevent overflow blowout) */}
            <div
              className="relative shrink-0 overflow-hidden rounded-2xl md:rounded-3xl bg-sea shadow-md ring-4 ring-pine/20 flex items-center justify-center self-start sm:self-center"
              style={{
                width: "112px",
                height: "112px",
                minWidth: "112px",
                minHeight: "112px",
                maxWidth: "112px",
                maxHeight: "112px"
              }}
            >
              {d.image ? (
                <img
                  src={normalizeImageUrl(d.image)}
                  alt={d.name}
                  className="w-full h-full object-cover object-top"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => {
                    e.target.style.display = "none";
                    if (e.target.nextSibling) e.target.nextSibling.style.display = "grid";
                  }}
                />
              ) : null}
              <span
                className="grid h-full w-full place-items-center bg-ink font-display text-3xl font-bold text-white"
                style={{ display: d.image ? "none" : "grid" }}
              >
                {ini}
              </span>
              <span className="absolute bottom-1 right-1 grid h-7 w-7 place-items-center rounded-full bg-pine text-white ring-2 ring-white shadow">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-block rounded-full bg-pine/15 px-3 py-1 text-xs font-bold text-pine uppercase tracking-wider">
                  {d.specialization}
                </span>
                {d.isApiDoctor && (
                  <span className="inline-block rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-300">
                    Live Verified
                  </span>
                )}
                {user?.role === "doctor" && (
                  <button
                    type="button"
                    onClick={handleOpenDocEdit}
                    className="inline-flex items-center gap-1 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-0.5 text-[11px] font-bold transition cursor-pointer"
                  >
                    ✏️ Edit
                  </button>
                )}
              </div>
              <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-ink break-words">{d.name}</h1>
              <p className="mt-1 text-sm font-medium text-ink/60">
                {d.qualification || "MBBS"} {d.registration_number ? `• Registration #${d.registration_number}` : ""}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <a
                  href="#reviews"
                  className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700 border border-amber-200 hover:bg-amber-100 transition"
                >
                  ★ {d.rating} Rating {totalReviews > 0 && <span className="font-normal text-amber-900/80">({totalReviews} reviews)</span>}
                </a>
                <span className="text-xs text-ink/60">• Verified Clinical Specialist</span>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-ink/10 pt-6">
            <h2 className="text-lg font-bold text-ink">About {d.name}</h2>
            <p className="mt-2 text-base text-ink/80 leading-relaxed">{d.about}</p>
          </div>

          <dl className="mt-8 grid gap-3 sm:grid-cols-2">
            {[
              ["Experience", `${d.experience} years clinical practice`],
              ["Consultation fee", `₹${d.fee} (pay upon visit)`],
              ["Clinic Name", d.clinic_name || "Primary Care Clinic"],
              ["Clinic Location", d.clinic_address || d.city || "Vastral, Ahmedabad"],
              ["Medical Registration", d.registration_number ? `Reg #${d.registration_number}` : (d.license || "MCI Certified")],
              ["Contact Mobile", d.mobile ? `+91 ${d.mobile}` : "Available on Booking"],
              ["Email Address", d.email || "consult@carepulse.com"],
              ["Weekly Availability", "Mon - Sun, 10:00 AM - 07:00 PM"]
            ].map(([k, v]) => (
              <div key={k} className="rounded-2xl bg-sea/50 p-4 border border-ink/5">
                <dt className="text-xs font-bold uppercase tracking-wider text-ink/50">{k}</dt>
                <dd className="mt-1 font-semibold text-ink text-sm truncate">{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Right Column: Doctor Management Panel OR Slot Booking Form */}
        <div className="lg:col-span-2 space-y-6">
          {user?.role === "doctor" && (
            <div className="rounded-3xl bg-emerald-900 p-6 text-white shadow-xl border border-emerald-700">
              <div className="flex items-center justify-between border-b border-white/20 pb-4">
                <div>
                  <span className="text-xs uppercase font-bold text-emerald-300 tracking-wider">Doctor Portal Mode</span>
                  <h2 className="text-xl font-bold mt-0.5">Profile Management</h2>
                </div>
                <span className="rounded-full bg-emerald-800 px-2.5 py-0.5 text-[10px] font-bold text-emerald-200 border border-emerald-600">
                  Live API
                </span>
              </div>

              <p className="mt-4 text-xs text-emerald-100/90 leading-relaxed">
                This is your public doctor profile as seen by patients. Any edits you make here will immediately PATCH the backend API.
              </p>

              <div className="mt-4 space-y-2.5">
                <button
                  type="button"
                  onClick={handleOpenDocEdit}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-white py-3 text-xs font-extrabold text-emerald-950 shadow-md transition hover:bg-emerald-50 cursor-pointer"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  Edit Doctor Profile (PATCH API)
                </button>

                <Link
                  to="/dashboard"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-emerald-800/90 hover:bg-emerald-800 py-2.5 text-xs font-bold text-white transition border border-emerald-700"
                >
                  Go to Doctor Dashboard →
                </Link>
              </div>

              <div className="mt-4 rounded-2xl bg-black/20 p-3 border border-white/10">
                <span className="text-[10px] font-mono text-emerald-300 block uppercase font-bold">API Endpoint:</span>
                <code className="text-[11px] font-mono text-white/90 break-all block mt-0.5">
                  PATCH /doctor/profile/{d.apiId || d.id || 1}/
                </code>
              </div>
            </div>
          )}

          {/* Slot Booking Form */}
          <form onSubmit={submit} className="h-fit rounded-3xl bg-ink p-6 text-white shadow-xl border border-white/10">
            <div className="flex items-center justify-between border-b border-white/15 pb-4">
              <div>
                <span className="text-xs uppercase font-bold text-coral tracking-wider">Direct Scheduling</span>
                <h2 className="text-2xl font-bold mt-0.5">Book Appointment</h2>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                ₹{d.fee}
              </span>
            </div>

          <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-white/70">1. Select a Day</p>
          <div className="mt-2 flex gap-2 overflow-x-auto pb-2">
            {days.map((t) => (
              <button
                type="button"
                key={iso(t)}
                onClick={() => {
                  setDate(iso(t));
                  setSlot("");
                }}
                className={`shrink-0 rounded-xl px-3 py-2 text-xs font-semibold transition ${
                  date === iso(t) ? "bg-coral text-white shadow" : "bg-white/10 hover:bg-white/20 text-white/80"
                }`}
              >
                {t.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
              </button>
            ))}
          </div>

          <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-white/70">2. Choose a Time Slot</p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {SLOTS.map((s) => (
              <button
                type="button"
                key={s}
                disabled={off(s)}
                onClick={() => setSlot(s)}
                className={`rounded-xl py-2.5 text-xs font-semibold transition ${
                  slot === s
                    ? "bg-coral text-white shadow"
                    : "bg-white/10 hover:bg-white/20 text-white/90"
                } disabled:cursor-not-allowed disabled:line-through disabled:opacity-25`}
              >
                {s}
              </button>
            ))}
          </div>

          <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-white/70">3. Reason for Visit (Optional)</p>
          <textarea
            className="mt-2 w-full rounded-xl bg-white/10 p-3 text-xs placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-coral text-white border border-white/10"
            rows="3"
            placeholder="Describe any symptoms, fever duration, or questions..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />

          {msg?.e && (
            <p role="alert" className="mt-3 rounded-xl bg-coral/30 border border-coral/40 p-3 text-xs text-white">
              {msg.e}
            </p>
          )}
          {msg?.ok && (
            <p role="status" className="mt-3 rounded-xl bg-pine border border-pine/40 p-3 text-xs text-white">
              {msg.ok}
            </p>
          )}

          <button className="mt-5 w-full rounded-full bg-coral py-3 font-bold text-sm text-white shadow-lg transition hover:bg-white hover:text-ink">
            {user ? "Confirm Appointment" : "Log in to book"}
          </button>
          <p className="mt-3 text-center text-xs text-white/60">
            Pay ₹{d.fee} directly upon consultation at the clinic.
          </p>
        </form>
      </div>
    </div>

      {/* PATIENT RATINGS & REVIEWS SECTION */}
      <section id="reviews" className="mt-16 rounded-3xl bg-white p-6 md:p-10 border border-ink/10 shadow-sm scroll-mt-24">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-ink/10 pb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-pine">Patient Feedback</span>
            <h2 className="mt-1 text-2xl md:text-3xl font-extrabold text-ink">Ratings & Reviews</h2>
            <p className="mt-1 text-xs md:text-sm text-ink/70">
              Verified clinical reviews from patients consulted by {d.name}.
            </p>
          </div>

          {/* Average Rating Highlight Card */}
          <div className="flex items-center gap-4 rounded-2xl bg-amber-50/80 p-4 border border-amber-200">
            <div className="text-center">
              <span className="text-3xl font-black text-amber-900 block leading-none">
                ★ {d.rating}
              </span>
              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wide mt-1 block">
                Out of 5.0
              </span>
            </div>

            <div className="h-10 w-[1px] bg-amber-300" />

            <div>
              <div className="flex text-amber-500 text-sm">
                {"★★★★★".slice(0, Math.round(d.rating))}
              </div>
              <p className="text-xs font-semibold text-amber-950 mt-0.5">
                {totalReviews} verified {totalReviews === 1 ? "review" : "reviews"}
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Rating / Edit Rating Box */}
        <div className="mt-8 rounded-3xl bg-sea/40 p-6 md:p-8 border border-ink/10">
          {!user ? (
            /* Case 1: Not Logged In */
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-center sm:text-left">
              <div>
                <h3 className="font-bold text-ink text-base">Have you consulted {d.name}?</h3>
                <p className="text-xs text-ink/70 mt-1">
                  Log in as a patient to submit your 1-5 star rating and clinical review.
                </p>
              </div>
              <Link
                to="/login"
                state={{ from: loc }}
                className="btn shrink-0 !py-2.5 !px-6 text-xs font-bold shadow-xs"
              >
                Log in to Rate Doctor
              </Link>
            </div>
          ) : user.role === "doctor" ? (
            /* Case 2: Logged in as Doctor */
            <div className="rounded-2xl bg-white p-4 text-xs font-medium text-ink/70 border border-ink/5 flex items-center gap-2">
              <span>🩺</span>
              <span>
                You are currently logged in with a Doctor account. Only patient accounts are eligible to submit ratings.
              </span>
            </div>
          ) : userReview && !isEditingRating ? (
            /* Case 3: Patient Already Rated -> Show Current Rating with Edit Option */
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-300 flex items-center gap-1">
                    ✓ Your Submitted Rating
                  </span>
                  <span className="text-xs text-ink/50">
                    {userReview.updatedAt ? "Updated" : "Posted"} on{" "}
                    {new Date(userReview.updatedAt || userReview.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric"
                    })}
                  </span>
                </div>

                {/* Edit & Delete Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleStartEdit}
                    className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-1.5 text-xs font-bold text-white hover:bg-pine transition shadow-xs"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                    Edit My Rating
                  </button>

                  <button
                    type="button"
                    onClick={handleDeleteRating}
                    className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-coral border border-coral/30 hover:bg-coral/10 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Display Current User's Review Details */}
              <div className="rounded-2xl bg-white p-5 border border-ink/10 shadow-xs">
                <div className="flex items-center gap-2">
                  <div className="flex text-amber-400 text-lg">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star}>{star <= userReview.rating ? "★" : "☆"}</span>
                    ))}
                  </div>
                  <span className="text-xs font-bold text-ink/80">
                    {starLabels[userReview.rating] || `${userReview.rating}/5`}
                  </span>
                </div>

                {userReview.comment ? (
                  <p className="mt-2.5 text-sm text-ink/80 leading-relaxed italic">
                    "{userReview.comment}"
                  </p>
                ) : (
                  <p className="mt-2 text-xs text-ink/50 italic">No written comment provided.</p>
                )}
              </div>

              {reviewFeedback && (
                <p
                  className={`rounded-xl p-3 text-xs font-semibold ${
                    reviewFeedback.type === "success"
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-coral/15 text-coral border border-coral/30"
                  }`}
                >
                  {reviewFeedback.text}
                </p>
              )}
            </div>
          ) : (
            /* Case 4: Form to Give or Edit Rating */
            <form onSubmit={handleSaveRating} className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-ink text-base md:text-lg">
                    {userReview ? `Edit Your Rating for ${d.name}` : `Rate Your Experience with ${d.name}`}
                  </h3>
                  <p className="text-xs text-ink/70 mt-0.5">
                    Click a star to select your score (1 = Poor, 5 = Excellent).
                  </p>
                </div>

                {userReview && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="text-xs font-bold text-ink/50 hover:text-ink"
                  >
                    Cancel
                  </button>
                )}
              </div>

              {/* Star Rating Selector */}
              <div>
                <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Doctor rating">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = star <= activeStarCount;
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setSelectedStars(star)}
                        onMouseEnter={() => setHoverStars(star)}
                        onMouseLeave={() => setHoverStars(0)}
                        className="p-1 transition transform hover:scale-125 focus:outline-none"
                        aria-label={`${star} star`}
                      >
                        <svg
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          fill={isFilled ? "#F59E0B" : "none"}
                          stroke={isFilled ? "#D97706" : "#A0AEC0"}
                          strokeWidth="1.5"
                          className="transition-colors duration-150"
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      </button>
                    );
                  })}
                  <span className="ml-3 text-xs font-bold text-ink/75 bg-white px-3 py-1 rounded-full border border-ink/10 shadow-xs">
                    {starLabels[activeStarCount] || `${activeStarCount} Stars`}
                  </span>
                </div>
              </div>

              {/* Review Comment Textarea */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink/70 mb-1.5">
                  Your Review / Consultation Experience
                </label>
                <textarea
                  rows="3"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share details about the doctor's communication, diagnosis accuracy, prescription clarity, and clinic hygiene..."
                  className="w-full rounded-2xl border border-ink/15 bg-white p-3.5 text-xs text-ink placeholder:text-ink/40 focus:border-pine focus:outline-none shadow-xs"
                />
              </div>

              {/* Feedback Alert */}
              {reviewFeedback && (
                <p
                  className={`rounded-xl p-3 text-xs font-semibold ${
                    reviewFeedback.type === "success"
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-coral/15 text-coral border border-coral/30"
                  }`}
                >
                  {reviewFeedback.text}
                </p>
              )}

              {/* Form Buttons */}
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="submit"
                  className="btn !py-2.5 !px-6 text-xs font-bold shadow-sm"
                >
                  {userReview ? "Update Rating & Review" : "Submit Rating & Review"}
                </button>

                {isEditingRating && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="rounded-full bg-white px-4 py-2.5 text-xs font-bold text-ink/70 hover:bg-ink/5 border border-ink/10 transition"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          )}
        </div>

        {/* Reviews List & Distribution */}
        <div className="mt-12 grid gap-8 lg:grid-cols-12">
          {/* Left Column: Star Rating Distribution Breakdown */}
          <div className="lg:col-span-4 rounded-2xl bg-sea/30 p-5 border border-ink/5 h-fit">
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink/70">
              Rating Breakdown
            </h4>
            <div className="mt-3 space-y-2">
              {starCounts.map(({ stars, count }) => {
                const pct = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
                return (
                  <div key={stars} className="flex items-center gap-2 text-xs">
                    <span className="w-12 font-bold text-ink/70 flex items-center gap-1">
                      {stars} <span className="text-amber-500">★</span>
                    </span>
                    <div className="flex-1 h-2 rounded-full bg-ink/10 overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-8 text-right font-medium text-ink/50 text-[11px]">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Verified Patient Reviews List */}
          <div className="lg:col-span-8 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink/70">
              Recent Patient Reviews ({totalReviews})
            </h4>

            {doctorReviews.length === 0 ? (
              <div className="rounded-2xl bg-white p-8 text-center border border-dashed border-ink/20">
                <span className="text-3xl">⭐</span>
                <p className="mt-2 text-sm font-bold text-ink">No reviews yet for {d.name}</p>
                <p className="mt-1 text-xs text-ink/60">
                  Be the first patient to share your consultation experience!
                </p>
              </div>
            ) : (
              doctorReviews.map((r) => {
                const isCurrentUserReview = user && (r.userId === user.id || r.userEmail === user.email);
                const reviewerInitials = (r.userName || "P")
                  .trim()
                  .split(/\s+/)
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase();

                return (
                  <article
                    key={r.id}
                    className={`rounded-2xl p-5 border transition ${
                      isCurrentUserReview
                        ? "bg-emerald-50/40 border-emerald-300 shadow-xs"
                        : "bg-white border-ink/10 shadow-xs"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-ink to-pine text-white font-bold text-xs grid place-items-center">
                          {reviewerInitials}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="font-bold text-ink text-sm">{r.userName}</h5>
                            {isCurrentUserReview && (
                              <span className="rounded-full bg-emerald-600 px-2 py-0.2 text-[9px] font-extrabold uppercase tracking-wider text-white">
                                You
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-ink/50">
                            {new Date(r.updatedAt || r.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric"
                            })}
                            {r.updatedAt && <span className="ml-1 text-[10px]">(edited)</span>}
                          </span>
                        </div>
                      </div>

                      {/* Stars badge */}
                      <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
                        <span className="text-amber-500 text-xs">{"★★★★★".slice(0, Math.round(r.rating))}</span>
                        <span className="text-[11px] font-bold text-amber-900">{r.rating}.0</span>
                      </div>
                    </div>

                    {r.comment && (
                      <p className="mt-3 text-xs md:text-sm text-ink/80 leading-relaxed">
                        {r.comment}
                      </p>
                    )}

                    {isCurrentUserReview && (
                      <div className="mt-3 pt-2 border-t border-ink/5 flex justify-end">
                        <button
                          type="button"
                          onClick={handleStartEdit}
                          className="text-xs font-bold text-pine hover:underline inline-flex items-center gap-1"
                        >
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                          </svg>
                          Edit your review
                        </button>
                      </div>
                    )}
                  </article>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* Doctor Profile Edit (PATCH) Modal */}
      {isEditingDoc && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 sm:p-4 backdrop-blur-sm overflow-y-auto"
          onClick={() => setIsEditingDoc(false)}
        >
          <div
            className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-5 sm:p-7 md:p-8 shadow-2xl border border-ink/10 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-ink/10 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  Doctor Profile Management
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-ink mt-0.5">
                  Edit Doctor Details & Clinic
                </h2>
                {/* <code className="text-[11px] font-mono text-ink/60 block mt-1">
                  API: PATCH /doctor/profile/{d.apiId || d.id || 1}/
                </code> */}
              </div>
              <button
                type="button"
                onClick={() => setIsEditingDoc(false)}
                className="grid h-8 w-8 place-items-center rounded-full bg-ink/10 text-ink hover:bg-ink hover:text-white transition cursor-pointer shrink-0"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveDocProfile} className="mt-5 space-y-4">
              {/* Photo Change / Upload */}
              <div className="rounded-2xl border border-ink/10 bg-sea/40 p-4">
                <label className="text-xs font-bold uppercase tracking-wider text-ink/70 block mb-2">
                  Doctor Profile Photo
                </label>
                <div className="flex items-center gap-4">
                  <div
                    className="relative shrink-0 overflow-hidden rounded-2xl bg-white ring-2 ring-emerald-600/30 shadow-sm flex items-center justify-center"
                    style={{ width: "72px", height: "72px", minWidth: "72px", minHeight: "72px" }}
                  >
                    {docForm.image ? (
                      <img
                        src={normalizeImageUrl(docForm.image)}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <span className="text-2xl text-ink/40">👨‍⚕️</span>
                    )}
                  </div>

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <input
                      ref={docFileRef}
                      type="file"
                      accept="image/*"
                      onChange={handleDocImageUpload}
                      className="hidden"
                      id="doc-edit-photo"
                    />
                    <label
                      htmlFor="doc-edit-photo"
                      className="inline-flex items-center gap-1.5 cursor-pointer rounded-full bg-ink px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      {docForm.image ? "Change Photo" : "Upload Photo"}
                    </label>

                    {docForm.image && (
                      <button
                        type="button"
                        onClick={() => setDocForm((prev) => ({ ...prev, image: "" }))}
                        className="ml-3 text-xs font-semibold text-coral hover:underline cursor-pointer"
                      >
                        Remove Photo
                      </button>
                    )}
                    <p className="text-[11px] text-ink/50">PNG, JPG or WEBP (Max 3MB)</p>
                  </div>
                </div>
              </div>

              {/* Doctor Name & Mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-ink/70 block mb-1">
                    Doctor Name
                  </label>
                  <input
                    className="input text-sm w-full"
                    value={docForm.name}
                    onChange={(e) => setDocForm({ ...docForm, name: e.target.value })}
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
                    value={docForm.mobile}
                    onChange={(e) => setDocForm({ ...docForm, mobile: e.target.value })}
                    placeholder="e.g. 9313786545"
                    required
                  />
                </div>
              </div>

              {/* Email & Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-ink/70 block mb-1">
                    Email Address
                  </label>
                  <input
                    className="input text-sm w-full"
                    type="email"
                    value={docForm.email}
                    onChange={(e) => setDocForm({ ...docForm, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-ink/70 block mb-1">
                    Gender
                  </label>
                  <select
                    className="input text-sm w-full"
                    value={docForm.gender}
                    onChange={(e) => setDocForm({ ...docForm, gender: e.target.value })}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Specialization & Qualification */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-ink/70 block mb-1">
                    Specialization
                  </label>
                  <select
                    className="input text-sm w-full"
                    value={docForm.specialization}
                    onChange={(e) => setDocForm({ ...docForm, specialization: e.target.value })}
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
                    Qualification / Degree
                  </label>
                  <input
                    className="input text-sm w-full"
                    value={docForm.qualification}
                    onChange={(e) => setDocForm({ ...docForm, qualification: e.target.value })}
                    placeholder="e.g. MBBS, MD"
                    required
                  />
                </div>
              </div>

              {/* Clinic Name & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-ink/70 block mb-1">
                    Clinic / Hospital Name
                  </label>
                  <input
                    className="input text-sm w-full"
                    value={docForm.clinic_name}
                    onChange={(e) => setDocForm({ ...docForm, clinic_name: e.target.value })}
                    placeholder="e.g. Akash Care Clinic"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-ink/70 block mb-1">
                    Clinic Address / Location
                  </label>
                  <input
                    className="input text-sm w-full"
                    value={docForm.clinic_address}
                    onChange={(e) => setDocForm({ ...docForm, clinic_address: e.target.value })}
                    placeholder="e.g. Vastral"
                  />
                </div>
              </div>

              {/* Consultation Fee & Experience */}
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
                    value={docForm.fee}
                    onChange={(e) => setDocForm({ ...docForm, fee: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-ink/70 block mb-1">
                    Clinical Experience (Years)
                  </label>
                  <input
                    className="input text-sm w-full"
                    type="number"
                    min="1"
                    max="60"
                    value={docForm.experience}
                    onChange={(e) => setDocForm({ ...docForm, experience: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Registration Number */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-ink/70 block mb-1">
                  Medical Registration / License Number
                </label>
                <input
                  className="input text-sm w-full"
                  value={docForm.registration_number}
                  onChange={(e) => setDocForm({ ...docForm, registration_number: e.target.value })}
                  placeholder="e.g. 2332322"
                />
              </div>

              {/* About Bio */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-ink/70 block mb-1">
                  Practice Bio & Specialty Overview
                </label>
                <textarea
                  className="input text-sm w-full"
                  rows="3"
                  value={docForm.about}
                  onChange={(e) => setDocForm({ ...docForm, about: e.target.value })}
                  placeholder="Share details about your clinical specialty, treatment focus, and approach..."
                />
              </div>

              {docSaveMsg && (
                <p
                  role="status"
                  className={`rounded-xl p-3 text-xs font-bold text-center shadow ${
                    docSaveMsg.includes("✓") || docSaveMsg.includes("success")
                      ? "bg-emerald-700 text-white"
                      : "bg-coral/20 text-ink border border-coral/30"
                  }`}
                >
                  {docSaveMsg}
                </p>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-ink/10">
                <button
                  type="button"
                  onClick={() => setIsEditingDoc(false)}
                  className="rounded-full px-5 py-2.5 text-xs font-bold text-ink/70 hover:bg-sea transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingDoc}
                  className="rounded-full bg-emerald-700 hover:bg-emerald-800 px-6 py-2.5 text-xs font-bold text-white shadow transition cursor-pointer disabled:opacity-60 flex items-center gap-1.5"
                >
                  {isSavingDoc && (
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  )}
                  {isSavingDoc ? "Saving to API..." : "Save Doctor Details (PATCH)"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
