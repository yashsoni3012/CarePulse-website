import { createContext, useContext, useMemo, useState } from "react";
import { seedDoctors, seedReviews } from "../data/doctors.js";

// Demo backend: everything lives in localStorage.
const K = { u: "cp_users", s: "cp_session", a: "cp_appts", m: "cp_messages", r: "cp_reviews" };
const read = (k, d = null) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

const DEFAULT_USERS = [
  {
    id: 101,
    name: "Dr. Aarav Mehta",
    email: "doctor@carepulse.com",
    password: "password123",
    role: "doctor",
    specialization: "General Physician",
    license: "MCI-48291",
    experience: 12,
    fee: 500,
    city: "Ahmedabad",
    about: "Treats fevers, infections, diabetes and everyday health concerns with a focus on clear, practical advice.",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 102,
    name: "Yash Patel",
    email: "patient@carepulse.com",
    password: "password123",
    role: "patient",
    image: ""
  }
];

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => {
    const existing = read(K.u, []);
    const hasDoc = existing.some((u) => u.email === "doctor@carepulse.com");
    const hasPat = existing.some((u) => u.email === "patient@carepulse.com");
    let next = [...existing];
    if (!hasDoc) next.push(DEFAULT_USERS[0]);
    if (!hasPat) next.push(DEFAULT_USERS[1]);
    if (!hasDoc || !hasPat) save(K.u, next);
    return next;
  });

  const [user, setUser] = useState(() => read(K.s));
  const [appts, setAppts] = useState(() => read(K.a, []));

  // Reviews & ratings stored in localStorage
  const [reviews, setReviews] = useState(() => {
    const existing = read(K.r);
    if (existing && Array.isArray(existing) && existing.length > 0) return existing;
    save(K.r, seedReviews);
    return seedReviews;
  });

  const start = (u) => { const { password, ...safe } = u; save(K.s, safe); setUser(safe); };

  const register = (data) => {
    if (users.some((u) => u.email === data.email.toLowerCase()))
      return { ok: false, error: "An account with this email already exists. Log in instead." };
    const u = { ...data, email: data.email.toLowerCase(), id: Date.now() };
    const next = [...users, u]; save(K.u, next); setUsers(next); start(u);
    return { ok: true };
  };

  const login = ({ email, password, role }) => {
    const u = users.find((x) => x.email === email.toLowerCase() && x.password === password && x.role === role);
    if (!u) return { ok: false, error: `No ${role} account matches these details. Check your email, password and role.` };
    start(u); return { ok: true };
  };

  const loginDemo = (role) => {
    const targetEmail = role === "doctor" ? "doctor@carepulse.com" : "patient@carepulse.com";
    let target = users.find((x) => x.email === targetEmail && x.role === role);
    if (!target) {
      target = role === "doctor" ? DEFAULT_USERS[0] : DEFAULT_USERS[1];
      const next = [...users.filter((x) => x.email !== targetEmail), target];
      save(K.u, next);
      setUsers(next);
    }
    start(target);
    return { ok: true, user: target };
  };

  const logout = () => { localStorage.removeItem(K.s); setUser(null); };

  const updateProfile = (data) => {
    if (!user) return { ok: false, error: "Not logged in" };
    const nextUsers = users.map((u) => (u.id === user.id ? { ...u, ...data } : u));
    save(K.u, nextUsers);
    setUsers(nextUsers);
    const updatedUser = { ...user, ...data };
    save(K.s, updatedUser);
    setUser(updatedUser);
    return { ok: true, user: updatedUser };
  };

  // Add or edit doctor rating & review
  const addOrUpdateReview = ({ doctorId, rating, comment }) => {
    if (!user) return { ok: false, error: "Please log in to submit a rating." };
    const numRating = Math.max(1, Math.min(5, Number(rating) || 5));
    const cleanComment = (comment || "").trim();
    const docIdStr = String(doctorId);

    const existingIndex = reviews.findIndex(
      (r) => r.doctorId === docIdStr && (r.userId === user.id || r.userEmail === user.email)
    );

    let nextReviews;
    const isEdit = existingIndex >= 0;

    if (isEdit) {
      nextReviews = reviews.map((r, i) =>
        i === existingIndex
          ? {
              ...r,
              rating: numRating,
              comment: cleanComment,
              userName: user.name || r.userName,
              updatedAt: new Date().toISOString()
            }
          : r
      );
    } else {
      const newReview = {
        id: "rev_" + Date.now(),
        doctorId: docIdStr,
        userId: user.id,
        userName: user.name || "Verified Patient",
        userEmail: user.email,
        rating: numRating,
        comment: cleanComment,
        createdAt: new Date().toISOString()
      };
      nextReviews = [newReview, ...reviews];
    }

    save(K.r, nextReviews);
    setReviews(nextReviews);
    return { ok: true, isEdit };
  };

  const deleteReview = (reviewId) => {
    const nextReviews = reviews.filter((r) => r.id !== reviewId);
    save(K.r, nextReviews);
    setReviews(nextReviews);
    return { ok: true };
  };

  // Dynamically calculate average rating and review counts for each doctor
  const doctors = useMemo(() => {
    const allDocs = [
      ...seedDoctors,
      ...users
        .filter((u) => u && u.role === "doctor")
        .map((u) => ({
          id: String(u.id),
          name: u.name?.startsWith("Dr") ? u.name : `Dr. ${u.name || "Doctor"}`,
          specialization: u.specialization || "General Physician",
          experience: Number(u.experience) || 1,
          fee: Number(u.fee) || 500,
          city: u.city || "Ahmedabad",
          rating: 4.8,
          education: u.license ? `Licence no. ${u.license}` : "Qualified practitioner",
          about:
            u.about ||
            `${u.name || "Doctor"} is a dedicated ${u.specialization || "General Physician"} practicing in ${
              u.city || "Ahmedabad"
            }.`,
          image:
            u.image ||
            "https://images.unsplash.com/photo-1594824813596-f6b0f192eb96?auto=format&fit=crop&w=600&q=80",
          registered: true
        }))
    ];

    return allDocs.map((d) => {
      const docReviews = reviews.filter((r) => r.doctorId === String(d.id));
      const total = docReviews.length;
      const avg =
        total > 0
          ? Number((docReviews.reduce((sum, r) => sum + Number(r.rating || 5), 0) / total).toFixed(1))
          : Number(d.rating || 4.8);

      return {
        ...d,
        rating: avg,
        reviewCount: total
      };
    });
  }, [users, reviews]);

  const isTaken = (doctorId, date, slot) =>
    appts.some((a) => a.doctorId === doctorId && a.date === date && a.slot === slot && a.status !== "Cancelled");

  const book = (d, date, slot, reason) => {
    if (isTaken(d.id, date, slot)) return { ok: false, error: "That slot was just taken. Pick another." };
    const a = {
      id: Date.now(),
      doctorId: d.id,
      doctorName: d.name,
      specialization: d.specialization,
      patientId: user.id,
      patientName: user.name,
      patientEmail: user.email,
      date,
      slot,
      reason,
      status: "Booked"
    };
    const next = [...appts, a];
    save(K.a, next);
    setAppts(next);
    return { ok: true };
  };

  const setStatus = (id, status) => {
    const next = appts.map((a) => (a.id === id ? { ...a, status } : a));
    save(K.a, next);
    setAppts(next);
  };

  const sendMessage = (m) => save(K.m, [...read(K.m, []), { ...m, at: Date.now() }]);

  return (
    <Ctx.Provider
      value={{
        user,
        doctors,
        appts,
        reviews,
        addOrUpdateReview,
        deleteReview,
        register,
        login,
        loginDemo,
        logout,
        updateProfile,
        book,
        isTaken,
        setStatus,
        sendMessage
      }}
    >
      {children}
    </Ctx.Provider>
  );
}
