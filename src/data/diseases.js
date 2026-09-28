import { extras } from "./extras.js";
import { diseaseMedia } from "./diseaseMedia.js";
export const categories = ["All", "Fever and infection", "Respiratory", "Digestive", "Nerve and pain", "Chronic care", "Skin and allergy"];
const base = [
  { slug: "fever", name: "Fever", category: "Fever and infection", summary: "A body temperature above about 38°C (100.4°F), usually a sign the body is fighting an infection.",
    symptoms: ["Warm skin and sweating", "Chills and shivering", "Headache and body ache", "Weakness and loss of appetite"],
    precautions: ["Drink water, ORS or soup often", "Rest and wear light clothing", "Sponge with lukewarm water, not cold", "Take paracetamol only as the label directs", "Wash hands and avoid sharing utensils"],
    doctor: ["Fever above 39.5°C or lasting over 3 days", "Stiff neck, rash or confusion", "Fever in a baby under 3 months"] },
  { slug: "common-cold", name: "Common cold", category: "Respiratory", summary: "A mild viral infection of the nose and throat that usually clears in a week.",
    symptoms: ["Runny or blocked nose", "Sneezing", "Sore throat", "Mild cough"],
    precautions: ["Rest and drink warm fluids", "Gargle with warm salt water", "Cover your mouth when you sneeze", "Wash hands often", "Dispose of used tissues safely"],
    doctor: ["Symptoms beyond 10 days", "Breathing difficulty", "High fever with chest pain"] },
  { slug: "influenza", name: "Influenza (flu)", category: "Respiratory", summary: "A contagious viral illness that hits harder and faster than a cold.",
    symptoms: ["Sudden high fever", "Dry cough", "Muscle pain and fatigue", "Sore throat"],
    precautions: ["Stay home until fever is gone for 24 hours", "Get the yearly flu vaccine", "Wear a mask around others while ill", "Drink plenty of fluids", "Ventilate rooms"],
    doctor: ["You are pregnant, elderly or have a chronic illness", "Shortness of breath", "Symptoms return worse after improving"] },
  { slug: "dengue", name: "Dengue", category: "Fever and infection", summary: "A mosquito-borne infection common in the monsoon and post-monsoon months.",
    symptoms: ["High fever with severe headache", "Pain behind the eyes", "Joint and muscle pain", "Skin rash"],
    precautions: ["Remove standing water from coolers, pots and tyres", "Use repellent and full-sleeve clothes", "Sleep under a net", "Drink fluids and rest", "Avoid aspirin and ibuprofen"],
    doctor: ["Any fever in a dengue-affected area", "Bleeding gums or black stools", "Severe stomach pain or repeated vomiting"] },
  { slug: "typhoid", name: "Typhoid", category: "Digestive", summary: "A bacterial infection spread through contaminated food and water.",
    symptoms: ["Fever that rises day by day", "Stomach pain", "Constipation or diarrhoea", "Weakness"],
    precautions: ["Drink boiled or filtered water", "Eat freshly cooked food", "Wash hands before eating", "Avoid raw street salads", "Ask your doctor about the typhoid vaccine"],
    doctor: ["Fever lasting more than 3 days", "Severe stomach pain", "Blood in stool"] },
  { slug: "migraine", name: "Migraine", category: "Nerve and pain", summary: "A recurring, throbbing headache, often on one side, that may come with nausea.",
    symptoms: ["Throbbing pain on one side", "Sensitivity to light and sound", "Nausea", "Visual flashes before the pain"],
    precautions: ["Rest in a dark, quiet room", "Keep a regular sleep and meal schedule", "Note your triggers in a diary", "Stay hydrated", "Limit screen time and caffeine"],
    doctor: ["Sudden, worst-ever headache", "Weakness or speech trouble", "Headaches that keep getting more frequent"] },
];

const x = (slug, name, category, specialist, summary, symptoms, precautions, doctor) => ({ slug, name, category, specialist, summary, symptoms, precautions, doctor });
const extra = [
  x("asthma", "Asthma", "Respiratory", "Pulmonologist", "A long-term condition where the airways narrow and swell, making breathing hard.", ["Wheezing", "Shortness of breath", "Chest tightness", "Night or early-morning cough"], ["Keep your inhaler with you", "Avoid dust, smoke and strong smells", "Follow your doctor's action plan", "Get the flu vaccine"], ["Inhaler is not helping", "Difficulty speaking in full sentences", "Lips or nails turn bluish"]),
  x("diabetes", "Type 2 diabetes", "Chronic care", "General Physician", "A condition where the body cannot use sugar properly, leading to high blood sugar.", ["Frequent urination and thirst", "Tiredness", "Blurred vision", "Slow-healing wounds"], ["Limit sugary drinks and refined flour", "Walk for 30 minutes daily", "Check blood sugar as advised", "Take medicines on time", "Look after your feet"], ["Blood sugar stays high", "Sudden weight loss", "Tingling or numbness in feet"]),
  x("hypertension", "High blood pressure", "Chronic care", "Cardiologist", "Blood pressure that stays too high and strains the heart and blood vessels.", ["Often no symptoms", "Morning headache", "Dizziness", "Nosebleeds in severe cases"], ["Reduce salt", "Exercise regularly", "Keep a healthy weight", "Avoid tobacco and limit alcohol", "Check pressure at home"], ["Chest pain", "Severe headache with blurred vision", "Readings above 180/120"]),
  x("skin-allergy", "Skin allergy", "Skin and allergy", "Dermatologist", "Itchy, red or swollen skin caused by contact with a trigger such as food, dust or metals.", ["Itching and redness", "Raised rashes (hives)", "Dry, flaky patches", "Swelling of lips or eyelids"], ["Find and avoid the trigger", "Use mild, fragrance-free soap", "Moisturise after bathing", "Do not scratch", "Wear soft cotton clothes"], ["Swelling of face or throat (go to emergency)", "Rash spreading fast", "No improvement in a week"]),
  x("gastroenteritis", "Stomach flu (gastroenteritis)", "Digestive", "General Physician", "An infection of the gut causing loose motions and vomiting, often from unsafe food or water.", ["Loose motions", "Vomiting", "Stomach cramps", "Mild fever"], ["Sip ORS after every loose motion", "Eat light foods like rice and banana", "Wash hands with soap", "Drink only safe water", "Rest"], ["Signs of dehydration", "Blood in stool", "Symptoms beyond 3 days"]),
  x("chickenpox", "Chickenpox", "Fever and infection", "Pediatrician", "A very contagious viral illness that causes itchy blisters, common in children.", ["Itchy blister-like rash", "Fever", "Tiredness", "Loss of appetite"], ["Keep the child home until blisters crust", "Trim nails to prevent scratching", "Use calamine lotion", "Avoid aspirin", "Ask about the vaccine"], ["Rash near the eyes", "Fever above 39°C", "Infected, pus-filled blisters"]),
  x("malaria", "Malaria", "Fever and infection", "General Physician", "A mosquito-borne parasite infection that causes cycles of fever and chills.", ["Fever with shaking chills", "Heavy sweating", "Headache", "Nausea and vomiting"], ["Sleep under a treated net", "Use mosquito repellent", "Remove standing water", "Wear full sleeves at dusk", "Get tested early when feverish"], ["Fever after mosquito exposure", "Confusion or seizures", "Yellow eyes or skin"]),
  x("pneumonia", "Pneumonia", "Respiratory", "Pulmonologist", "An infection that inflames the air sacs in the lungs and can fill them with fluid.", ["Cough with phlegm", "Fever and chills", "Chest pain when breathing", "Fast breathing"], ["Finish prescribed antibiotics", "Rest and drink fluids", "Ask about pneumococcal and flu vaccines", "Avoid smoking", "Wash hands often"], ["Breathing difficulty", "Bluish lips", "Symptoms in infants or older adults"]),
  x("acidity", "Acidity (acid reflux)", "Digestive", "General Physician", "A burning feeling in the chest or throat when stomach acid flows back up.", ["Burning in the chest", "Sour taste in the mouth", "Bloating", "Burping after meals"], ["Eat smaller meals", "Do not lie down for 2 hours after eating", "Limit spicy, fried food and caffeine", "Raise the head of your bed", "Do not smoke"], ["Trouble swallowing", "Black stools", "Weight loss without reason"]),
  x("anemia", "Anemia", "Chronic care", "General Physician", "Too few healthy red blood cells, leaving the body short of oxygen.", ["Tiredness", "Pale skin", "Dizziness", "Fast heartbeat"], ["Eat iron-rich foods like spinach and lentils", "Pair iron with vitamin C", "Avoid tea with meals", "Ask about supplements", "Get a blood test"], ["Breathlessness at rest", "Fainting", "Heavy periods"]),
];
const spec = { migraine: "Neurologist" };
export const diseases = [...base, ...extra].map((d) => ({
  specialist: spec[d.slug] || "General Physician",
  ...extras[d.slug],
  ...d,
  image: diseaseMedia[d.slug]?.image || "/images/fever_care.jpg",
  badge: diseaseMedia[d.slug]?.badge || d.category,
  gallery: diseaseMedia[d.slug]?.gallery || [],
  video: diseaseMedia[d.slug]?.video || null,
}));
export const catColor = { "Fever and infection": "#F0644F", Respiratory: "#2B7FBF", Digestive: "#C58A1B", "Nerve and pain": "#7A5AC8", "Chronic care": "#0F7C7A", "Skin and allergy": "#D2568A" };
