export const API_BASE_URL = "https://sudhanshutask.pythonanywhere.com";

/**
 * Normalizes image paths returned from the PythonAnywhere Django API.
 * Converts relative `/media/...` paths to absolute URLs.
 */
export function normalizeImageUrl(imgUrl) {
  if (!imgUrl) return "";
  if (typeof imgUrl !== "string") return "";
  if (imgUrl.startsWith("http://") || imgUrl.startsWith("https://") || imgUrl.startsWith("data:")) {
    return imgUrl;
  }
  const cleanPath = imgUrl.startsWith("/") ? imgUrl : `/${imgUrl}`;
  return `${API_BASE_URL}${cleanPath}`;
}

/**
 * Formats doctor object from Django API to CarePulse standard schema.
 */
export function formatDoctorFromApi(d) {
  if (!d) return null;
  const rawName = (d.name || "").trim();
  const formattedName = rawName.toLowerCase().startsWith("dr")
    ? rawName.replace(/^dr[.\s]*/i, "Dr. ")
    : `Dr. ${rawName ? rawName.charAt(0).toUpperCase() + rawName.slice(1) : "Physician"}`;

  const specRaw = (d.specialization || "General Physician").trim();
  const specFormatted =
    specRaw.toLowerCase() === "mbbs"
      ? "General Physician (MBBS)"
      : specRaw.charAt(0).toUpperCase() + specRaw.slice(1);

  const clinicName = d.clinic_name
    ? d.clinic_name.toLowerCase().includes("clinic") || d.clinic_name.toLowerCase().includes("hospital")
      ? d.clinic_name.charAt(0).toUpperCase() + d.clinic_name.slice(1)
      : `${d.clinic_name.charAt(0).toUpperCase() + d.clinic_name.slice(1)} Care Clinic`
    : "Primary Care Clinic";

  const clinicAddress = d.clinic_address
    ? d.clinic_address.charAt(0).toUpperCase() + d.clinic_address.slice(1)
    : "Ahmedabad";

  const qualification = (d.qualification || "MBBS").toUpperCase();
  const experienceYears = Number(d.experience) || 2;
  const fee = Number(d.fee) || 450;

  return {
    id: String(d.id),
    apiId: d.id,
    name: formattedName,
    rawName: d.name,
    email: (d.email || "").toLowerCase(),
    mobile: d.mobile || "",
    gender: d.gender || "male",
    image: normalizeImageUrl(d.image),
    specialization: specFormatted,
    qualification,
    education: `${qualification}${d.registration_number ? ` • Reg #${d.registration_number}` : ""}`,
    experience: experienceYears,
    registration_number: d.registration_number || "",
    license: d.registration_number ? `MCI/SMC #${d.registration_number}` : "Verified Medical Practitioner",
    clinic_name: clinicName,
    clinic_address: clinicAddress,
    city: clinicAddress,
    fee,
    rating: 4.9,
    reviewCount: 1,
    about:
      d.about ||
      `${formattedName} (${qualification}) is a certified specialist in ${specFormatted} with ${experienceYears} years of clinical experience. Consulting at ${clinicName}, ${clinicAddress}. Known for thorough patient diagnostics, preventive care and holistic treatments.`,
    isApiDoctor: true,
    role: "doctor"
  };
}

/**
 * Formats user/patient object from Django API to CarePulse standard schema.
 */
export function formatUserFromApi(u) {
  if (!u) return null;
  const rawName = (u.name || "").trim();
  const formattedName = rawName ? rawName.charAt(0).toUpperCase() + rawName.slice(1) : "Patient";

  return {
    id: u.id,
    name: formattedName,
    rawName: u.name,
    email: (u.email || "").toLowerCase(),
    mobile: u.mobile || "",
    gender: u.gender || "unspecified",
    image: normalizeImageUrl(u.image),
    role: "patient",
    isApiUser: true
  };
}

/**
 * Fetch all doctors from `https://sudhanshutask.pythonanywhere.com/doctors/`
 */
export async function fetchDoctorsApi() {
  try {
    const res = await fetch(`${API_BASE_URL}/doctors/`, {
      method: "GET",
      headers: { Accept: "application/json" }
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    return data.map(formatDoctorFromApi);
  } catch (err) {
    console.warn("Error fetching doctors from API:", err);
    return [];
  }
}

/**
 * Fetch all users from `https://sudhanshutask.pythonanywhere.com/users/`
 */
export async function fetchUsersApi() {
  try {
    const res = await fetch(`${API_BASE_URL}/users/`, {
      method: "GET",
      headers: { Accept: "application/json" }
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    return data.map(formatUserFromApi);
  } catch (err) {
    console.warn("Error fetching users from API:", err);
    return [];
  }
}

/**
 * Doctor Login via `https://sudhanshutask.pythonanywhere.com/doctor/login/`
 */
export async function loginDoctorApi(email, password) {
  try {
    const res = await fetch(`${API_BASE_URL}/doctor/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({ email: email.trim().toLowerCase(), password: password.trim() })
    });

    const data = await res.json();

    if (res.ok && data?.doctor) {
      return {
        ok: true,
        message: data.message || "Doctor login successful",
        doctor: formatDoctorFromApi(data.doctor),
        raw: data.doctor
      };
    }

    const errorMsg =
      data?.message ||
      data?.detail ||
      (Array.isArray(data?.email) && data.email[0]) ||
      (Array.isArray(data?.password) && data.password[0]) ||
      "Invalid doctor credentials. Please check your email and password.";

    return { ok: false, error: errorMsg };
  } catch (err) {
    return {
      ok: false,
      error: `Network error connecting to doctor authentication server: ${err.message}`
    };
  }
}

/**
 * User / Patient Login via `https://sudhanshutask.pythonanywhere.com/login/`
 */
export async function loginUserApi(email, password) {
  try {
    const res = await fetch(`${API_BASE_URL}/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({ email: email.trim().toLowerCase(), password: password.trim() })
    });

    const data = await res.json();

    if (res.ok && data?.user) {
      return {
        ok: true,
        message: data.message || "Patient login successful",
        user: formatUserFromApi(data.user),
        raw: data.user
      };
    }

    const errorMsg =
      data?.message ||
      data?.detail ||
      (Array.isArray(data?.email) && data.email[0]) ||
      (Array.isArray(data?.password) && data.password[0]) ||
      "Invalid patient credentials. Please check your email and password.";

    return { ok: false, error: errorMsg };
  } catch (err) {
    return {
      ok: false,
      error: `Network error connecting to user authentication server: ${err.message}`
    };
  }
}

/**
 * Register Doctor via `POST https://sudhanshutask.pythonanywhere.com/doctors/`
 */
export async function registerDoctorApi(doctorPayload) {
  try {
    const res = await fetch(`${API_BASE_URL}/doctors/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        name: doctorPayload.name,
        email: doctorPayload.email.toLowerCase(),
        password: doctorPayload.password,
        mobile: doctorPayload.mobile || "9000000000",
        gender: doctorPayload.gender || "male",
        specialization: doctorPayload.specialization || "mbbs",
        qualification: doctorPayload.qualification || "mbbs",
        experience: Number(doctorPayload.experience) || 2,
        registration_number: doctorPayload.registration_number || doctorPayload.license || "1001",
        clinic_name: doctorPayload.clinic_name || doctorPayload.name || "Clinic",
        clinic_address: doctorPayload.clinic_address || doctorPayload.city || "Ahmedabad",
        image: doctorPayload.image || null
      })
    });

    const data = await res.json();
    if (res.ok && data) {
      return { ok: true, doctor: formatDoctorFromApi(data) };
    }

    const firstErr =
      data?.detail ||
      Object.entries(data || {})
        .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
        .join("; ") ||
      "Failed to register doctor with backend API.";

    return { ok: false, error: firstErr };
  } catch (err) {
    return { ok: false, error: `Doctor registration failed: ${err.message}` };
  }
}

/**
 * Register User / Patient via `POST https://sudhanshutask.pythonanywhere.com/users/`
 */
export async function registerUserApi(userPayload) {
  try {
    const res = await fetch(`${API_BASE_URL}/users/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        name: userPayload.name,
        email: userPayload.email.toLowerCase(),
        password: userPayload.password,
        mobile: userPayload.mobile || "9000000000",
        gender: userPayload.gender || "male",
        image: userPayload.image || null
      })
    });

    const data = await res.json();
    if (res.ok && data) {
      return { ok: true, user: formatUserFromApi(data) };
    }

    const firstErr =
      data?.detail ||
      Object.entries(data || {})
        .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
        .join("; ") ||
      "Failed to register patient with backend API.";

    return { ok: false, error: firstErr };
  } catch (err) {
    return { ok: false, error: `Patient registration failed: ${err.message}` };
  }
}

/**
 * Fetch Doctor Profile via `GET https://sudhanshutask.pythonanywhere.com/doctor/profile/{id}/`
 */
export async function fetchDoctorProfileApi(id = 1) {
  try {
    const res = await fetch(`${API_BASE_URL}/doctor/profile/${id}/`, {
      method: "GET",
      headers: { Accept: "application/json" }
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return { ok: true, doctor: formatDoctorFromApi(data), raw: data };
  } catch (err) {
    console.warn(`Error fetching doctor profile (${id}):`, err);
    return { ok: false, error: err.message };
  }
}

/**
 * Update Doctor Profile via `PATCH https://sudhanshutask.pythonanywhere.com/doctor/profile/{id}/`
 */
export async function updateDoctorProfileApi(id = 1, patchData = {}) {
  try {
    const cleanId = String(id).replace(/\D/g, "") || "1";
    const cleanPayload = {};
    if (patchData.name !== undefined && patchData.name !== null) {
      cleanPayload.name = patchData.name.replace(/^Dr\.\s*/i, "").trim();
    }
    if (patchData.email !== undefined && patchData.email !== null) {
      cleanPayload.email = patchData.email.trim().toLowerCase();
    }
    if (patchData.mobile !== undefined && patchData.mobile !== null) {
      cleanPayload.mobile = String(patchData.mobile).trim();
    }
    if (patchData.gender !== undefined && patchData.gender !== null) {
      cleanPayload.gender = patchData.gender;
    }
    if (patchData.specialization !== undefined && patchData.specialization !== null) {
      cleanPayload.specialization = patchData.specialization;
    }
    if (patchData.qualification !== undefined && patchData.qualification !== null) {
      cleanPayload.qualification = patchData.qualification;
    }
    if (patchData.experience !== undefined && patchData.experience !== null) {
      cleanPayload.experience = Number(patchData.experience) || 2;
    }
    if (patchData.registration_number !== undefined && patchData.registration_number !== null) {
      cleanPayload.registration_number = String(patchData.registration_number).trim();
    }
    if (patchData.clinic_name !== undefined && patchData.clinic_name !== null) {
      cleanPayload.clinic_name = patchData.clinic_name.trim();
    }
    if (patchData.clinic_address !== undefined && patchData.clinic_address !== null) {
      cleanPayload.clinic_address = patchData.clinic_address.trim();
    }

    let res;
    if (patchData.imageFile instanceof File) {
      const formData = new FormData();
      for (const [k, v] of Object.entries(cleanPayload)) {
        formData.append(k, v);
      }
      formData.append("image", patchData.imageFile);

      res = await fetch(`${API_BASE_URL}/doctor/profile/${cleanId}/`, {
        method: "PATCH",
        headers: { Accept: "application/json" },
        body: formData
      });
    } else {
      res = await fetch(`${API_BASE_URL}/doctor/profile/${cleanId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(cleanPayload)
      });
    }

    const data = await res.json();
    if (res.ok && data) {
      return { ok: true, doctor: formatDoctorFromApi(data), raw: data };
    }

    const firstErr =
      data?.detail ||
      data?.message ||
      (typeof data === "object"
        ? Object.entries(data)
            .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
            .join("; ")
        : null) ||
      `Failed to update doctor profile (HTTP ${res.status})`;

    return { ok: false, error: firstErr };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

/**
 * Fetch User Profile via `GET https://sudhanshutask.pythonanywhere.com/user/profile/{id}/`
 */
export async function fetchUserProfileApi(id = 1) {
  try {
    const cleanId = String(id).replace(/\D/g, "") || "1";
    const res = await fetch(`${API_BASE_URL}/user/profile/${cleanId}/`, {
      method: "GET",
      headers: { Accept: "application/json" }
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return { ok: true, user: formatUserFromApi(data), raw: data };
  } catch (err) {
    console.warn(`Error fetching user profile (${id}):`, err);
    return { ok: false, error: err.message };
  }
}

/**
 * Update User Profile via `PATCH https://sudhanshutask.pythonanywhere.com/user/profile/{id}/`
 */
export async function updateUserProfileApi(id = 1, patchData = {}) {
  try {
    const cleanId = String(id).replace(/\D/g, "") || "1";
    const cleanPayload = {};
    if (patchData.name !== undefined && patchData.name !== null) {
      cleanPayload.name = patchData.name.trim();
    }
    if (patchData.email !== undefined && patchData.email !== null) {
      cleanPayload.email = patchData.email.trim().toLowerCase();
    }
    if (patchData.mobile !== undefined && patchData.mobile !== null) {
      cleanPayload.mobile = String(patchData.mobile).trim();
    }
    if (patchData.gender !== undefined && patchData.gender !== null) {
      cleanPayload.gender = patchData.gender;
    }

    let res;
    if (patchData.imageFile instanceof File) {
      const formData = new FormData();
      for (const [k, v] of Object.entries(cleanPayload)) {
        formData.append(k, v);
      }
      formData.append("image", patchData.imageFile);

      res = await fetch(`${API_BASE_URL}/user/profile/${cleanId}/`, {
        method: "PATCH",
        headers: { Accept: "application/json" },
        body: formData
      });
    } else {
      res = await fetch(`${API_BASE_URL}/user/profile/${cleanId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(cleanPayload)
      });
    }

    const data = await res.json();
    if (res.ok && data) {
      return { ok: true, user: formatUserFromApi(data), raw: data };
    }

    const firstErr =
      data?.detail ||
      data?.message ||
      (typeof data === "object"
        ? Object.entries(data)
            .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
            .join("; ")
        : null) ||
      `Failed to update user profile (HTTP ${res.status})`;

    return { ok: false, error: firstErr };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

