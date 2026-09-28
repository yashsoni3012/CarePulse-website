// Media metadata (images, visual infographic galleries, and video guides) for all conditions
export const diseaseMedia = {
  fever: {
    image: "/images/fever_care.jpg",
    badge: "Featured Guide",
    gallery: [
      { title: "Temperature Monitoring", desc: "Track temperature readings twice daily using a clean digital thermometer.", url: "/images/fever_care.jpg" },
      { title: "Adequate Hydration", desc: "Replenish essential electrolytes with water, ORS, and warm soups.", url: "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80" },
      { title: "Lukewarm Compress", desc: "Use lukewarm water compresses on forehead and neck to ease fever discomfort safely.", url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80" }
    ],
    video: {
      title: "Doctor Explains: Understanding Fever & Safe Home Care",
      duration: "3:15",
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      poster: "/images/doctor_video.jpg",
      doctor: "Dr. Aarav Mehta, MD Medicine",
      summary: "Learn what triggers a fever, safe home care techniques, temperature thresholds, and when to see a specialist.",
      chapters: [
        { time: "0:00", title: "What causes body temperature to rise" },
        { time: "0:48", title: "Effective hydration and rest methods" },
        { time: "1:35", title: "Paracetamol dosage and caution" },
        { time: "2:25", title: "Emergency signs in adults and kids" }
      ]
    }
  },
  "common-cold": {
    image: "/images/respiratory_care.jpg",
    badge: "Seasonal Watch",
    gallery: [
      { title: "Airway & Sinus Relief", desc: "Steam inhalation and saline gargling soothe irritated mucosal tissue.", url: "/images/respiratory_care.jpg" },
      { title: "Nutrient-Rich Warm Fluids", desc: "Honey, ginger, and warm herbal broths boost recovery and ease cough.", url: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80" },
      { title: "Transmission Prevention", desc: "Cover sneezes and disinfect high-touch surfaces to protect your home.", url: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80" }
    ],
    video: {
      title: "Common Cold: Recovery Timeline & Essential Care",
      duration: "2:45",
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      poster: "/images/doctor_video.jpg",
      doctor: "Dr. Nisha Trivedi, Pulmonologist",
      summary: "Understand the natural progression of a viral head cold, supportive therapies, and warning signs.",
      chapters: [
        { time: "0:00", title: "Typical 7-10 day symptom arc" },
        { time: "0:55", title: "Steam and gargle routines" },
        { time: "1:50", title: "When a cold turns into bronchitis" }
      ]
    }
  },
  influenza: {
    image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80",
    badge: "Viral Infection",
    gallery: [
      { title: "Flu Virus Protection", desc: "Yearly vaccination remains the most reliable barrier against severe influenza.", url: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80" },
      { title: "Complete Bed Rest", desc: "Muscle pain and fatigue require at least 48 to 72 hours of complete rest.", url: "/images/fever_care.jpg" },
      { title: "Room Air Ventilation", desc: "Keep windows cracked to cycle fresh airflow and lower viral particle count.", url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80" }
    ],
    video: {
      title: "Flu Management: Fast Relief & High-Risk Precautions",
      duration: "3:30",
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      poster: "/images/doctor_video.jpg",
      doctor: "Dr. Aarav Mehta, General Physician",
      summary: "How to differentiate the flu from a common cold and protect vulnerable family members.",
      chapters: [
        { time: "0:00", title: "Sudden onset of high fever and chills" },
        { time: "1:05", title: "Antiviral window (first 48 hours)" },
        { time: "2:15", title: "Post-viral recovery timeline" }
      ]
    }
  },
  dengue: {
    image: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=800&q=80",
    badge: "Mosquito-Borne",
    gallery: [
      { title: "Mosquito Breeding Control", desc: "Empty water coolers, flower pots, and plastic containers weekly.", url: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=800&q=80" },
      { title: "Intensive Fluid Therapy", desc: "Drink coconut water, papaya leaf extracts, and ORS to maintain hydration.", url: "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80" },
      { title: "Platelet Count Tracking", desc: "Regular CBC blood tests monitor critical platelet levels during the fever cycle.", url: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80" }
    ],
    video: {
      title: "Dengue Fever: Critical Days, Platelets & Hydration",
      duration: "4:10",
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      poster: "/images/doctor_video.jpg",
      doctor: "Dr. Sneha Patel, Pediatrician & Physician",
      summary: "A comprehensive guide on managing dengue fever, tracking platelets, and spotting the critical phase.",
      chapters: [
        { time: "0:00", title: "The 3 phases of dengue infection" },
        { time: "1:15", title: "The danger of aspirin and NSAIDs" },
        { time: "2:30", title: "Spotting bleeding gums and shock signs" }
      ]
    }
  },
  typhoid: {
    image: "https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=800&q=80",
    badge: "Water & Food Care",
    gallery: [
      { title: "Boiled & Filtered Water", desc: "Consuming strictly boiled or reverse-osmosis purified water prevents bacterial spread.", url: "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80" },
      { title: "Soft Bland Diet", desc: "Khichdi, boiled potatoes, and stewed apples support healing intestines.", url: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80" },
      { title: "Completing Antibiotics", desc: "Always finish the full 14-day course of prescribed antibiotics.", url: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=800&q=80" }
    ],
    video: {
      title: "Typhoid Fever: Safe Diet, Antibiotics & Relapse Prevention",
      duration: "3:05",
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      poster: "/images/doctor_video.jpg",
      doctor: "Dr. Aarav Mehta, General Physician",
      summary: "Understand how Salmonella typhi affects the digestive tract and how to avoid relapse.",
      chapters: [
        { time: "0:00", title: "Step-ladder fever pattern" },
        { time: "1:00", title: "Food hygiene and safe cooking" },
        { time: "2:05", title: "Widal and blood culture tests" }
      ]
    }
  },
  migraine: {
    image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80",
    badge: "Neurology",
    gallery: [
      { title: "Dark Quiet Room", desc: "Eliminating blue light and loud auditory stimuli relaxes cranial nerve sensitivity.", url: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80" },
      { title: "Cold Gel Compress", desc: "Placing an ice gel pack across temples constricts dilated cerebral vessels.", url: "/images/fever_care.jpg" },
      { title: "Trigger Diary", desc: "Logging meals, sleep hours, and stress helps pinpoint migraine triggers.", url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80" }
    ],
    video: {
      title: "Migraine Relief: Taming Attacks & Trigger Management",
      duration: "3:40",
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      poster: "/images/doctor_video.jpg",
      doctor: "Dr. Imran Qureshi, Neurologist",
      summary: "Learn how migraines develop, practical fast-acting steps for acute attacks, and long-term prevention.",
      chapters: [
        { time: "0:00", title: "Aura vs non-aura migraines" },
        { time: "0:50", title: "Early intervention window" },
        { time: "2:10", title: "Lifestyle tweaks that cut attack frequency" }
      ]
    }
  },
  asthma: {
    image: "/images/respiratory_care.jpg",
    badge: "Pulmonology",
    gallery: [
      { title: "Inhaler & Spacer Technique", desc: "Proper inhaler technique ensures medication reaches deep bronchial branches.", url: "/images/respiratory_care.jpg" },
      { title: "Air Quality Tracking", desc: "Monitor particulate AQI levels before planning outdoor physical activity.", url: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=800&q=80" },
      { title: "Dust & Smoke Elimination", desc: "Use HEPA air purifiers and wash bed linens weekly in hot water.", url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80" }
    ],
    video: {
      title: "Living Well with Asthma: Daily Control & Inhaler Guide",
      duration: "3:55",
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      poster: "/images/doctor_video.jpg",
      doctor: "Dr. Nisha Trivedi, Pulmonologist",
      summary: "Understand controller vs reliever inhalers, recognizing early airway narrowing, and asthma action plans.",
      chapters: [
        { time: "0:00", title: "What happens during an asthma flare" },
        { time: "1:10", title: "Using your spacer correctly" },
        { time: "2:30", title: "Emergency signs: wheeze vs silence" }
      ]
    }
  },
  diabetes: {
    image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80",
    badge: "Chronic Care",
    gallery: [
      { title: "Glucometer Tracking", desc: "Regular fasting and post-prandial blood sugar tracking keeps you in range.", url: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80" },
      { title: "Balanced Fiber Diet", desc: "Fill half your plate with leafy greens, whole pulses, and low-glycemic vegetables.", url: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80" },
      { title: "Daily 30-Min Walk", desc: "Brisk aerobic activity improves insulin sensitivity naturally.", url: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80" }
    ],
    video: {
      title: "Mastering Type 2 Diabetes: Diet, Activity & Sugar Control",
      duration: "4:00",
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      poster: "/images/doctor_video.jpg",
      doctor: "Dr. Aarav Mehta, General Physician",
      summary: "A practical guide to keeping HbA1c below target through daily movement, carb awareness, and routine checks.",
      chapters: [
        { time: "0:00", title: "Demystifying insulin resistance" },
        { time: "1:15", title: "Smart meal pairing and portion control" },
        { time: "2:45", title: "Foot care and routine organ screenings" }
      ]
    }
  },
  hypertension: {
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80",
    badge: "Cardiology",
    gallery: [
      { title: "Blood Pressure Cuff", desc: "Check resting BP seated quietly for 5 minutes before reading.", url: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80" },
      { title: "Sodium Reduction", desc: "Lowering sodium intake below 2,000 mg/day relaxes arterial walls.", url: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80" },
      { title: "Stress Relief & Breathing", desc: "Deep diaphragmatic breathing lowers sympathetic tone within minutes.", url: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80" }
    ],
    video: {
      title: "High Blood Pressure: Silent Risks & Proven Management",
      duration: "3:20",
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      poster: "/images/doctor_video.jpg",
      doctor: "Dr. Rohan Shah, Cardiologist",
      summary: "Why blood pressure matters, how to monitor accurately at home, and key dietary changes that yield results.",
      chapters: [
        { time: "0:00", title: "Understanding systolic and diastolic values" },
        { time: "1:00", title: "DASH diet principles and potassium" },
        { time: "2:20", title: "When high readings require emergency care" }
      ]
    }
  },
  "skin-allergy": {
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
    badge: "Dermatology",
    gallery: [
      { title: "Gentle Barrier Care", desc: "Fragrance-free ceramide moisturisers restore weakened dermal barriers.", url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80" },
      { title: "Allergen Avoidance", desc: "Wear loose 100% cotton garments and rinse skin after dust exposure.", url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80" },
      { title: "Cool Compresses", desc: "Chilled clean washcloths calm inflammatory histamine flares without scratching.", url: "/images/fever_care.jpg" }
    ],
    video: {
      title: "Skin Allergies & Hives: Rapid Relief & Trigger Discovery",
      duration: "2:55",
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      poster: "/images/doctor_video.jpg",
      doctor: "Dr. Kavya Desai, Dermatologist",
      summary: "Diagnosing contact dermatitis, safe antihistamine use, and restoring skin integrity.",
      chapters: [
        { time: "0:00", title: "Allergy vs sensitive skin irritations" },
        { time: "0:50", title: "Moisturising right after lukewarm bathing" },
        { time: "1:55", title: "Facial swelling and anaphylaxis warnings" }
      ]
    }
  },
  gastroenteritis: {
    image: "https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=800&q=80",
    badge: "Digestive Care",
    gallery: [
      { title: "Electrolyte Replenishment", desc: "Sip oral rehydration salts (ORS) in small, frequent mouthfuls.", url: "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80" },
      { title: "BRAT Recovery Diet", desc: "Bananas, rice, applesauce, and toast are easily tolerated by inflamed bowels.", url: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80" },
      { title: "Disinfection & Hand Soap", desc: "Norovirus spreads easily; wash hands thoroughly after bathroom use.", url: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80" }
    ],
    video: {
      title: "Stomach Flu: Rehydration Protocol & Safe Recovery",
      duration: "3:10",
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      poster: "/images/doctor_video.jpg",
      doctor: "Dr. Aarav Mehta, General Physician",
      summary: "How to prevent dehydration during acute vomiting and diarrhoea, plus foods to reintroduce gently.",
      chapters: [
        { time: "0:00", title: "Recognizing early dehydration signs" },
        { time: "1:05", title: "The correct way to sip ORS" },
        { time: "2:15", title: "When to seek intravenous fluids" }
      ]
    }
  },
  chickenpox: {
    image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80",
    badge: "Pediatric Care",
    gallery: [
      { title: "Calamine Soothing Care", desc: "Dabbing calamine lotion relieves itching without breaking blister skin.", url: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80" },
      { title: "Nail Trimming", desc: "Keep child's nails short and clean to prevent secondary bacterial infection.", url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80" },
      { title: "Home Isolation", desc: "Stay home until all blisters have fully crusted over into dry scabs.", url: "/images/fever_care.jpg" }
    ],
    video: {
      title: "Chickenpox in Children: Soothing the Itch & Safety Rules",
      duration: "3:00",
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      poster: "/images/doctor_video.jpg",
      doctor: "Dr. Sneha Patel, Pediatrician",
      summary: "Caring for children with chickenpox, fever medication precautions (avoiding aspirin), and healing blisters.",
      chapters: [
        { time: "0:00", title: "Spotting the itchy blister crop" },
        { time: "0:50", title: "Oatmeal baths and calamine relief" },
        { time: "2:00", title: "Crucial rule: Never give aspirin to children" }
      ]
    }
  },
  malaria: {
    image: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=800&q=80",
    badge: "Tropical Medicine",
    gallery: [
      { title: "Treated Mosquito Nets", desc: "Sleeping under long-lasting insecticide nets blocks nighttime Anopheles bites.", url: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=800&q=80" },
      { title: "Rapid Blood Smear Test", desc: "Microscopic blood film checks confirm parasite strain for targeted meds.", url: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80" },
      { title: "Prompt Antimalarial Course", desc: "Take artemisinin combination therapy (ACT) exactly as prescribed.", url: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=800&q=80" }
    ],
    video: {
      title: "Malaria: Parasite Cycles, Chills & Rapid Treatment",
      duration: "3:35",
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      poster: "/images/doctor_video.jpg",
      doctor: "Dr. Aarav Mehta, General Physician",
      summary: "Understanding the cyclical fever and shivering chills of malaria, prompt testing, and prevention.",
      chapters: [
        { time: "0:00", title: "The Anopheles transmission cycle" },
        { time: "1:10", title: "Cold, hot, and sweating stages" },
        { time: "2:20", title: "Why early blood testing prevents complications" }
      ]
    }
  },
  pneumonia: {
    image: "/images/respiratory_care.jpg",
    badge: "Chest Health",
    gallery: [
      { title: "Deep Breathing & Rest", desc: "Elevate your chest with pillows to expand lower lung capacity.", url: "/images/respiratory_care.jpg" },
      { title: "Pulse Oximeter Checks", desc: "Monitor oxygen saturation; readings below 94% need immediate clinical check.", url: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80" },
      { title: "Finish Full Prescriptions", desc: "Never stop antibiotic or antiviral courses early even if fever breaks.", url: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=800&q=80" }
    ],
    video: {
      title: "Pneumonia Warning Signs, Oxygen Levels & Recovery",
      duration: "3:45",
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      poster: "/images/doctor_video.jpg",
      doctor: "Dr. Nisha Trivedi, Pulmonologist",
      summary: "How pneumonia differs from bronchitis, monitoring blood oxygen, and essential rest guidelines.",
      chapters: [
        { time: "0:00", title: "Fluid build-up in lung alveoli" },
        { time: "1:00", title: "How to properly check pulse oximeter numbers" },
        { time: "2:25", title: "Emergency hospital criteria" }
      ]
    }
  },
  acidity: {
    image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80",
    badge: "Gastroenterology",
    gallery: [
      { title: "Elevated Sleeping Position", desc: "Raising the head of your bed 6 inches prevents nighttime stomach acid backflow.", url: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80" },
      { title: "Smaller Frequent Meals", desc: "Avoid oversized dinners and remain upright for at least 2 hours post meal.", url: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80" },
      { title: "Trigger Food Reductions", desc: "Cut deep-fried snacks, excess coffee, carbonated sodas, and citrus juice.", url: "https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=800&q=80" }
    ],
    video: {
      title: "Acid Reflux (GERD): Calming Heartburn & Healing the Gut",
      duration: "3:00",
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      poster: "/images/doctor_video.jpg",
      doctor: "Dr. Aarav Mehta, General Physician",
      summary: "Understand acid reflux mechanisms, dietary changes that offer lasting relief, and antacid guidelines.",
      chapters: [
        { time: "0:00", title: "The lower esophageal sphincter barrier" },
        { time: "0:55", title: "Meal timing and nighttime acid prevention" },
        { time: "2:05", title: "When heartburn mimics cardiac discomfort" }
      ]
    }
  },
  anemia: {
    image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80",
    badge: "Hematology & Nutrition",
    gallery: [
      { title: "Iron-Rich Nutrition", desc: "Spinach, lentils, beets, dates, and pomegranates help build hemoglobin stores.", url: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80" },
      { title: "Vitamin C Synergy", desc: "Pairing iron foods with lemon or oranges boosts plant-iron absorption by 3x.", url: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80" },
      { title: "Complete Blood Count", desc: "Routine CBC checks monitor serum ferritin, RBC indices, and hemoglobin.", url: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80" }
    ],
    video: {
      title: "Overcoming Anemia: Hemoglobin Boosters & Energy Recovery",
      duration: "3:25",
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      poster: "/images/doctor_video.jpg",
      doctor: "Dr. Aarav Mehta, General Physician",
      summary: "Why iron deficiency causes deep fatigue and brain fog, and how to effectively restore iron reserves.",
      chapters: [
        { time: "0:00", title: "How red blood cells carry oxygen" },
        { time: "1:00", title: "Foods that block vs boost iron absorption" },
        { time: "2:15", title: "Taking iron supplements without stomach ache" }
      ]
    }
  }
};
