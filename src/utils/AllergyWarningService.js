/**
 * Service to simulate allergy warnings for different locations
 */

// Common allergens that might be present in different locations
const COMMON_ALLERGENS = [
  'Pollen',
  'Grass',
  'Tree pollen',
  'Dust mites',
  'Mold spores',
  'Pet dander',
  'Ragweed',
  'Birch pollen'
];

// Severity levels
const SEVERITY_LEVELS = ['Low', 'Moderate', 'High', 'Very High'];

// Weather conditions that might affect allergies
const WEATHER_CONDITIONS = [
  'due to recent rainfall',
  'due to high humidity',
  'due to dry conditions',
  'due to strong winds',
  'due to seasonal changes',
  'during this time of year',
  'because of nearby vegetation'
];

/**
 * Generate a random allergy warning for a location
 * @param {string} location - The name of the location
 * @returns {Object} An object containing allergy warning information
 */
export function generateAllergyWarning(location) {
  // Random chance (40%) of having an allergy warning
  if (Math.random() > 0.4) {
    return null;
  }

  // Randomly select 1-3 allergens
  const numAllergens = Math.floor(Math.random() * 3) + 1;
  const allergens = [];
  
  for (let i = 0; i < numAllergens; i++) {
    const allergen = COMMON_ALLERGENS[Math.floor(Math.random() * COMMON_ALLERGENS.length)];
    if (!allergens.includes(allergen)) {
      allergens.push(allergen);
    }
  }

  // Generate warnings for each allergen
  const warnings = allergens.map(allergen => {
    const severity = SEVERITY_LEVELS[Math.floor(Math.random() * SEVERITY_LEVELS.length)];
    const condition = WEATHER_CONDITIONS[Math.floor(Math.random() * WEATHER_CONDITIONS.length)];
    
    return {
      allergen,
      severity,
      condition
    };
  });

  return {
    location,
    warnings,
    timestamp: new Date().toISOString()
  };
}

/**
 * Check if user allergies match any of the warning allergens
 * @param {Array} userAllergies - List of user's allergies
 * @param {Object} allergyWarning - Allergy warning object
 * @returns {Array} Matched allergies with severity
 */
export function checkUserAllergies(userAllergies, allergyWarning) {
  if (!allergyWarning || !userAllergies || userAllergies.length === 0) {
    return [];
  }

  const matches = [];

  userAllergies.forEach(userAllergy => {
    // Simple string matching - in a real app, would use more sophisticated matching
    allergyWarning.warnings.forEach(warning => {
      if (warning.allergen.toLowerCase().includes(userAllergy.name.toLowerCase()) ||
          userAllergy.name.toLowerCase().includes(warning.allergen.toLowerCase())) {
        matches.push({
          userAllergy,
          warningAllergen: warning.allergen,
          severity: warning.severity
        });
      }
    });
  });

  return matches;
}

/**
 * Format allergy warnings into a human-readable message
 * @param {Object} allergyWarning - Allergy warning object
 * @returns {string} Formatted message
 */
export function formatAllergyWarning(allergyWarning) {
  if (!allergyWarning) {
    return null;
  }

  const { location, warnings } = allergyWarning;
  
  if (warnings.length === 1) {
    const warning = warnings[0];
    return `${location} currently has ${warning.severity.toLowerCase()} levels of ${warning.allergen} ${warning.condition}.`;
  } else {
    const warningTexts = warnings.map(w => `${w.severity.toLowerCase()} ${w.allergen}`);
    const lastWarning = warningTexts.pop();
    
    return `${location} currently has ${warningTexts.join(', ')} and ${lastWarning} ${warnings[0].condition}.`;
  }
}
