import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  API_BASE_URL,
  normalizeImageUrl,
  fetchDoctorsApi,
  fetchUsersApi,
  fetchDoctorProfileApi,
  updateDoctorProfileApi,
  fetchUserProfileApi,
  updateUserProfileApi,
  loginDoctorApi,
  loginUserApi,
  registerDoctorApi,
  registerUserApi,
  formatDoctorFromApi,
  formatUserFromApi
} from "../services/api.js";

// Storage keys
const K = {
  u: "cp_users",
  s: "cp_session",
  a: "cp_appts",
  m: "cp_messages",
  r: "cp_reviews",
  apiD: "cp_api_doctors",
  apiU: "cp_api_users"
};

const read = (k, d = null) => {
  try {
    return JSON.parse(localStorage.getItem(k)) ?? d;
  } catch {
    return d;
  }
};
const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

// Fallback initial representations of the real PythonAnywhere API records
const DEFAULT_API_USERS = [
  {
    id: 1,
    apiId: 1,
    name: "Dr. Akash",
    rawName: "akash",
    email: "akash@gmail.com",
    password: "12345",
    role: "doctor",
    mobile: "9313786545",
    gender: "male",
    specialization: "General Physician (MBBS)",
    qualification: "MBBS",
    experience: 2,
    registration_number: "2332322",
    license: "MCI/SMC #2332322",
    clinic_name: "Akash Care Clinic",
    clinic_address: "Vastral",
    city: "Vastral",
    fee: 450,
    rating: 4.9,
    about: "Dr. Akash (MBBS) treats acute fevers, respiratory infections, blood sugar, and hypertension with 2 years of clinical practice in Vastral.",
    image: "https://sudhanshutask.pythonanywhere.com/media/doctors/Screenshot_2025-07-17_102731.png",
    isApiDoctor: true
  },
  {
    id: 1,
    apiId: 1,
    name: "Susma",
    rawName: "susma",
    email: "susma@gmail.com",
    password: "12345",
    role: "patient",
    mobile: "9112784800",
    gender: "male",
    image: "https://sudhanshutask.pythonanywhere.com/media/users/bombay_ortho_1.png",
    isApiUser: true
  }
];

export function AuthProvider({ children }) {
  // Live API doctors state: strictly doctors from https://sudhanshutask.pythonanywhere.com/doctors/
  const [apiDoctors, setApiDoctors] = useState(() => {
    const cached = read(K.apiD, []);
    if (cached && Array.isArray(cached) && cached.length > 0) {
      // Purge any fake static doctors that had 'd1'..'d6' or 'doctor@carepulse.com'
      const valid = cached.filter(
        (d) => !String(d.id).startsWith("d") && d.email !== "doctor@carepulse.com"
      );
      if (valid.length > 0) return valid;
    }
    return [DEFAULT_API_USERS[0]];
  });

  const [apiUsers, setApiUsers] = useState(() => {
    const cached = read(K.apiU, []);
    if (cached && Array.isArray(cached) && cached.length > 0) {
      const valid = cached.filter((u) => u.email !== "patient@carepulse.com");
      if (valid.length > 0) return valid;
    }
    return [DEFAULT_API_USERS[1]];
  });

  const [isLoadingApi, setIsLoadingApi] = useState(false);

  // Local accounts & active session (purged of fake static demo doctors)
  const [users, setUsers] = useState(() => {
    const existing = read(K.u, []);
    const cleaned = existing.filter(
      (u) =>
        u.email !== "doctor@carepulse.com" &&
        u.email !== "patient@carepulse.com" &&
        !String(u.id).startsWith("d")
    );
    const hasAkash = cleaned.some((u) => u.email === "akash@gmail.com");
    const hasSusma = cleaned.some((u) => u.email === "susma@gmail.com");
    let next = [...cleaned];
    if (!hasAkash) next.push(DEFAULT_API_USERS[0]);
    if (!hasSusma) next.push(DEFAULT_API_USERS[1]);
    save(K.u, next);
    return next;
  });

  const [user, setUser] = useState(() => {
    const s = read(K.s);
    if (s && (s.email === "doctor@carepulse.com" || s.email === "patient@carepulse.com" || String(s.id).startsWith("d"))) {
      localStorage.removeItem(K.s);
      return null;
    }
    return s;
  });

  const [appts, setAppts] = useState(() => read(K.a, []));

  // Reviews for real API doctors
  const [reviews, setReviews] = useState(() => {
    const existing = read(K.r, []);
    const valid = Array.isArray(existing)
      ? existing.filter((r) => !String(r.doctorId).startsWith("d"))
      : [];

    const hasAkashReview = valid.some((r) => String(r.doctorId) === "1");
    if (!hasAkashReview) {
      valid.unshift({
        id: "r_akash_1",
        doctorId: "1",
        userId: 1,
        userName: "Susma",
        userEmail: "susma@gmail.com",
        rating: 5,
        comment: "Dr. Akash provided very thorough consultation at Vastral clinic. Explained the treatment clearly and followed up on recovery.",
        createdAt: "2026-09-28T11:00:00Z"
      });
    }
    save(K.r, valid);
    return valid;
  });

  // Fetch doctors and users from PythonAnywhere Django API on mount
  const refreshApiData = async () => {
    setIsLoadingApi(true);
    try {
      const [fetchedDocs, fetchedUsers] = await Promise.all([
        fetchDoctorsApi(),
        fetchUsersApi()
      ]);

      if (fetchedDocs && fetchedDocs.length > 0) {
        setApiDoctors(fetchedDocs);
        save(K.apiD, fetchedDocs);
      }
      if (fetchedUsers && fetchedUsers.length > 0) {
        setApiUsers(fetchedUsers);
        save(K.apiU, fetchedUsers);
      }
    } catch (e) {
      console.warn("Failed fetching from Django API:", e);
    } finally {
      setIsLoadingApi(false);
    }
  };

  useEffect(() => {
    refreshApiData();

    // If an active session exists, sync with the live profile API
    if (user) {
      if (user.role === "doctor") {
        fetchDoctorProfileApi(user.apiId || user.id || 1).then((res) => {
          if (res.ok && res.doctor) {
            setUser((prev) => {
              const merged = { ...prev, ...res.doctor, role: "doctor" };
              save(K.s, merged);
              return merged;
            });
          }
        });
      } else {
        fetchUserProfileApi(user.apiId || user.id || 1).then((res) => {
          if (res.ok && res.user) {
            setUser((prev) => {
              const merged = { ...prev, ...res.user, role: "patient" };
              save(K.s, merged);
              return merged;
            });
          }
        });
      }
    }
  }, []);

  const start = (u) => {
    const { password, ...safe } = u;
    save(K.s, safe);
    setUser(safe);
  };

  const register = async (data) => {
    const cleanEmail = (data.email || "").toLowerCase().trim();
    const cleanRole = data.role || "patient";

    if (cleanRole === "doctor") {
      // 1. Register with Django API
      const apiRes = await registerDoctorApi({
        ...data,
        email: cleanEmail
      });

      let docUser;
      if (apiRes.ok && apiRes.doctor) {
        docUser = {
          ...apiRes.doctor,
          password: data.password,
          role: "doctor"
        };
      } else {
        docUser = {
          ...data,
          id: Date.now(),
          email: cleanEmail,
          role: "doctor",
          name: data.name.startsWith("Dr") ? data.name : `Dr. ${data.name}`,
          specialization: data.specialization || "General Physician (MBBS)",
          qualification: data.qualification || "MBBS",
          experience: Number(data.experience) || 2,
          fee: Number(data.fee) || 450,
          city: data.clinic_address || data.city || "Vastral",
          clinic_name: data.clinic_name || "Care Clinic",
          clinic_address: data.clinic_address || "Vastral",
          license: data.license || data.registration_number || "MCI-Registered",
          image: data.image || "",
          isApiDoctor: true
        };
      }

      setApiDoctors((prev) => {
        const updated = [docUser, ...prev.filter((d) => d.email !== cleanEmail)];
        save(K.apiD, updated);
        return updated;
      });

      const next = [docUser, ...users.filter((u) => u.email !== cleanEmail)];
      save(K.u, next);
      setUsers(next);
      start(docUser);
      return { ok: true, user: docUser };
    } else {
      // 1. Register patient with Django API
      const apiRes = await registerUserApi({
        ...data,
        email: cleanEmail
      });

      let patientUser;
      if (apiRes.ok && apiRes.user) {
        patientUser = {
          ...apiRes.user,
          password: data.password,
          role: "patient"
        };
      } else {
        patientUser = {
          ...data,
          id: Date.now(),
          email: cleanEmail,
          role: "patient",
          mobile: data.mobile || "",
          gender: data.gender || "male",
          image: data.image || ""
        };
      }

      setApiUsers((prev) => {
        const updated = [patientUser, ...prev.filter((u) => u.email !== cleanEmail)];
        save(K.apiU, updated);
        return updated;
      });

      const next = [patientUser, ...users.filter((u) => u.email !== cleanEmail)];
      save(K.u, next);
      setUsers(next);
      start(patientUser);
      return { ok: true, user: patientUser };
    }
  };

  const login = async ({ email, password, role }) => {
    const cleanEmail = (email || "").toLowerCase().trim();
    const cleanPass = (password || "").trim();

    if (role === "doctor") {
      // 1. Real Django API doctor login
      const apiRes = await loginDoctorApi(cleanEmail, cleanPass);
      if (apiRes.ok && apiRes.doctor) {
        const loggedDoc = {
          ...apiRes.doctor,
          role: "doctor"
        };
        start(loggedDoc);
        setUsers((prev) => {
          const next = [loggedDoc, ...prev.filter((u) => u.email !== cleanEmail)];
          save(K.u, next);
          return next;
        });
        return { ok: true, user: loggedDoc };
      }

      // 2. Local fallback for API accounts
      const localDoc = users.find(
        (x) => x.email === cleanEmail && x.password === cleanPass && x.role === "doctor"
      );
      if (localDoc) {
        start(localDoc);
        return { ok: true, user: localDoc };
      }

      return {
        ok: false,
        error: apiRes.error || "No doctor account matches these credentials."
      };
    } else {
      // 1. Real Django API user login
      const apiRes = await loginUserApi(cleanEmail, cleanPass);
      if (apiRes.ok && apiRes.user) {
        const loggedUser = {
          ...apiRes.user,
          role: "patient"
        };
        start(loggedUser);
        setUsers((prev) => {
          const next = [loggedUser, ...prev.filter((u) => u.email !== cleanEmail)];
          save(K.u, next);
          return next;
        });
        return { ok: true, user: loggedUser };
      }

      // 2. Local fallback for API accounts
      const localPat = users.find(
        (x) => x.email === cleanEmail && x.password === cleanPass && x.role === "patient"
      );
      if (localPat) {
        start(localPat);
        return { ok: true, user: localPat };
      }

      return {
        ok: false,
        error: apiRes.error || "No patient account matches these credentials."
      };
    }
  };

  // Instant 1-Click Demo Logins for API accounts
  const loginDemo = async (target) => {
    if (target === "akash" || target === "doctor" || target === "doctor_api") {
      return await login({ email: "akash@gmail.com", password: "12345", role: "doctor" });
    }
    if (target === "susma" || target === "patient" || target === "user_api") {
      return await login({ email: "susma@gmail.com", password: "12345", role: "patient" });
    }
    return { ok: false, error: "Unknown demo target." };
  };

  const logout = () => {
    localStorage.removeItem(K.s);
    setUser(null);
  };

  const updateProfile = async (data) => {
    if (!user) return { ok: false, error: "Not logged in" };

    let apiUpdated = null;
    const targetId = user.apiId
      ? Number(user.apiId)
      : Number(String(user.id).replace(/\D/g, "")) || 1;

    if (user.role === "doctor") {
      const res = await updateDoctorProfileApi(targetId, data);
      if (!res.ok) {
        return { ok: false, error: res.error || "Failed to update doctor profile on API server." };
      }
      apiUpdated = res.doctor;
    } else {
      const res = await updateUserProfileApi(targetId, data);
      if (!res.ok) {
        return { ok: false, error: res.error || "Failed to update user profile on API server." };
      }
      apiUpdated = res.user;
    }

    const updatedUser = { ...user, ...data, ...(apiUpdated || {}) };
    const nextUsers = users.map((u) => (String(u.id) === String(user.id) ? { ...u, ...updatedUser } : u));
    save(K.u, nextUsers);
    setUsers(nextUsers);
    save(K.s, updatedUser);
    setUser(updatedUser);

    if (user.role === "doctor") {
      setApiDoctors((prev) => {
        const next = prev.map((d) =>
          String(d.id) === String(user.id) || String(d.id) === String(targetId)
            ? { ...d, ...updatedUser }
            : d
        );
        save(K.apiD, next);
        return next;
      });
    } else {
      setApiUsers((prev) => {
        const next = prev.map((u) =>
          String(u.id) === String(user.id) || String(u.id) === String(targetId)
            ? { ...u, ...updatedUser }
            : u
        );
        save(K.apiU, next);
        return next;
      });
    }

    return { ok: true, user: updatedUser, raw: apiUpdated };
  };

  // Add or edit doctor rating & review
  const addOrUpdateReview = ({ doctorId, rating, comment }) => {
    if (!user) return { ok: false, error: "Please log in to submit a rating." };
    const numRating = Math.max(1, Math.min(5, Number(rating) || 5));
    const cleanComment = (comment || "").trim();
    const docIdStr = String(doctorId);

    const existingIndex = reviews.findIndex(
      (r) => String(r.doctorId) === docIdStr && (r.userId === user.id || r.userEmail === user.email)
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

  // STRICTLY only existing doctors from PythonAnywhere API
  const doctors = useMemo(() => {
    return apiDoctors.map((d) => {
      const docReviews = reviews.filter((r) => String(r.doctorId) === String(d.id));
      const total = docReviews.length;
      const avg =
        total > 0
          ? Number((docReviews.reduce((sum, r) => sum + Number(r.rating || 5), 0) / total).toFixed(1))
          : Number(d.rating || 4.9);

      return {
        ...d,
        rating: avg,
        reviewCount: total
      };
    });
  }, [apiDoctors, reviews]);

  const isTaken = (doctorId, date, slot) =>
    appts.some((a) => String(a.doctorId) === String(doctorId) && a.date === date && a.slot === slot && a.status !== "Cancelled");

  const book = (d, date, slot, reason) => {
    if (isTaken(d.id, date, slot)) return { ok: false, error: "That slot was just taken. Pick another." };
    const a = {
      id: Date.now(),
      doctorId: String(d.id),
      doctorName: d.name,
      doctorEmail: d.email || "",
      specialization: d.specialization,
      clinicName: d.clinic_name || "",
      patientId: user.id,
      patientName: user.name,
      patientEmail: user.email,
      patientMobile: user.mobile || "",
      date,
      slot,
      reason,
      status: "Booked"
    };
    const next = [...appts, a];
    save(K.a, next);
    setAppts(next);
    return { ok: true, appt: a };
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
        apiDoctors,
        apiUsers,
        isLoadingApi,
        refreshApiData,
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
