export const SLOTS = ["10:00 AM", "11:00 AM", "12:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"];
export const hourOf = (s) => (parseInt(s) % 12) + (s.includes("PM") ? 12 : 0);
const mk = (id, name, specialization, experience, fee, city, rating, education, about, image) => ({
  id,
  name,
  specialization,
  experience,
  fee,
  city,
  rating,
  education,
  about,
  image
});

export const seedDoctors = [
  mk(
    "d1",
    "Dr. Aarav Mehta",
    "General Physician",
    12,
    500,
    "Ahmedabad",
    4.8,
    "MBBS, MD Medicine",
    "Treats fevers, infections, diabetes and everyday health concerns with a focus on clear, practical advice.",
    "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80"
  ),
  mk(
    "d2",
    "Dr. Sneha Patel",
    "Pediatrician",
    9,
    600,
    "Surat",
    4.9,
    "MBBS, DCH",
    "Cares for newborns and children, including vaccination schedules, fevers and growth checks.",
    "https://images.unsplash.com/photo-1594824813596-f6b0f192eb96?auto=format&fit=crop&w=600&q=80"
  ),
  mk(
    "d3",
    "Dr. Rohan Shah",
    "Cardiologist",
    15,
    900,
    "Vadodara",
    4.7,
    "MBBS, DM Cardiology",
    "Manages blood pressure, chest pain and long-term heart health.",
    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80"
  ),
  mk(
    "d4",
    "Dr. Kavya Desai",
    "Dermatologist",
    7,
    700,
    "Rajkot",
    4.6,
    "MBBS, MD Dermatology",
    "Treats skin allergies, acne, eczema and hair problems.",
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80"
  ),
  mk(
    "d5",
    "Dr. Imran Qureshi",
    "Neurologist",
    11,
    1000,
    "Ahmedabad",
    4.8,
    "MBBS, DM Neurology",
    "Diagnoses and treats migraine, seizures and nerve conditions.",
    "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80"
  ),
  mk(
    "d6",
    "Dr. Nisha Trivedi",
    "Pulmonologist",
    10,
    800,
    "Gandhinagar",
    4.7,
    "MBBS, MD Pulmonary Medicine",
    "Helps with asthma, chronic cough and breathing difficulty.",
    "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&w=600&q=80"
  ),
];

export const seedReviews = [
  {
    id: "r1",
    doctorId: "d1",
    userId: 901,
    userName: "Meera Trivedi",
    rating: 5,
    comment: "Dr. Aarav is extremely patient and listens carefully to all symptoms. His prescription worked within two days for my viral fever.",
    createdAt: "2026-09-20T10:30:00Z"
  },
  {
    id: "r2",
    doctorId: "d1",
    userId: 902,
    userName: "Amit Joshi",
    rating: 5,
    comment: "Very polite clinician. Explained the dietary precautions clearly without unnecessary tests.",
    createdAt: "2026-09-22T14:15:00Z"
  },
  {
    id: "r3",
    doctorId: "d2",
    userId: 903,
    userName: "Pooja Vora",
    rating: 5,
    comment: "Great pediatrician! Handled our toddler so gently during vaccination. Highly recommend to parents in Surat.",
    createdAt: "2026-09-21T09:00:00Z"
  },
  {
    id: "r4",
    doctorId: "d3",
    userId: 904,
    userName: "Dinesh Patel",
    rating: 5,
    comment: "Very knowledgeable cardiologist. Calmed my anxiety regarding ECG variations and guided lifestyle changes.",
    createdAt: "2026-09-18T16:45:00Z"
  },
  {
    id: "r5",
    doctorId: "d4",
    userId: 905,
    userName: "Kinjal Shah",
    rating: 4,
    comment: "Good dermatologist. Helped clear severe dermatitis flare-ups. Clinic waiting time was slightly long but doctor was great.",
    createdAt: "2026-09-24T11:20:00Z"
  },
  {
    id: "r6",
    doctorId: "d5",
    userId: 906,
    userName: "Farhan Pathan",
    rating: 5,
    comment: "Dr. Imran accurately diagnosed my chronic cluster headache and prescribed an effective regimen.",
    createdAt: "2026-09-25T17:10:00Z"
  },
  {
    id: "r7",
    doctorId: "d6",
    userId: 907,
    userName: "Bhavna Raval",
    rating: 5,
    comment: "Helped immensely with persistent seasonal wheezing. Very comforting and experienced specialist.",
    createdAt: "2026-09-19T12:00:00Z"
  }
];

