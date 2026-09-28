const e = (causes, duration, contagious) => ({ causes, duration, contagious });
export const extras = {
  fever: e(["Viral or bacterial infection", "Heat exhaustion", "Reaction to a vaccine"], "1 to 5 days", "Depends on the cause"),
  "common-cold": e(["Rhinoviruses and related viruses", "Close contact with an infected person", "Touching contaminated surfaces"], "7 to 10 days", "Yes"),
  influenza: e(["Influenza virus", "Droplets from coughs and sneezes", "Crowded indoor spaces"], "1 to 2 weeks", "Yes"),
  dengue: e(["Bite of the Aedes mosquito", "Water stored in open containers", "Living in a monsoon-affected area"], "About 1 week", "Not person to person"),
  typhoid: e(["Salmonella Typhi bacteria", "Unsafe drinking water", "Food handled with unwashed hands"], "2 to 4 weeks untreated", "Yes, via food and water"),
  migraine: e(["Stress and poor sleep", "Skipped meals", "Bright light, strong smells or hormonal changes"], "4 to 72 hours per attack", "No"),
  asthma: e(["Allergens such as dust and pollen", "Smoke and air pollution", "Cold air or exercise"], "Long term, controlled with treatment", "No"),
  diabetes: e(["Body resists insulin", "Excess weight and low activity", "Family history"], "Lifelong, manageable", "No"),
  hypertension: e(["Too much salt", "Stress and inactivity", "Family history and age"], "Lifelong, manageable", "No"),
  "skin-allergy": e(["Food, dust or pollen", "Metals, soaps or cosmetics", "Insect bites"], "Days to weeks", "No"),
  gastroenteritis: e(["Contaminated food or water", "Viruses such as norovirus", "Poor hand hygiene"], "2 to 5 days", "Yes"),
  chickenpox: e(["Varicella-zoster virus", "Contact with blisters or droplets", "No prior vaccination"], "About 1 to 2 weeks", "Yes, very"),
  malaria: e(["Bite of an infected Anopheles mosquito", "Stagnant water nearby", "Travel to affected areas"], "1 to 2 weeks with treatment", "Not person to person"),
  pneumonia: e(["Bacteria or viruses in the lungs", "Weak immunity", "Smoking or a recent cold or flu"], "1 to 3 weeks", "Sometimes"),
  acidity: e(["Large or late meals", "Spicy, oily food and caffeine", "Excess weight and stress"], "Hours, recurs without changes", "No"),
  anemia: e(["Low iron in the diet", "Blood loss", "Low vitamin B12 or folate"], "Weeks to months of treatment", "No"),
};
