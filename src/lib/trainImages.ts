// SimRail train images mapping
// Images sourced from https://wiki.simrail.eu/en/Vehicles/Poland/Overview

export interface TrainImageMapping {
  [key: string]: string;
}

// Main locomotive images mapping
export const trainImages: TrainImageMapping = {
  // EU07/EP07 Series (4E)
  'EU07': 'https://wiki.simrail.eu/vehicle/eu07-005.jpg',
  'EP07': 'https://wiki.simrail.eu/vehicle/eu07-005.jpg',
  '4E': 'https://wiki.simrail.eu/vehicle/eu07-005.jpg',
  
  // EP08 Series (102E)
  'EP08': 'https://wiki.simrail.eu/vehicle/ep08-001.jpg',
  '102E': 'https://wiki.simrail.eu/vehicle/ep08-001.jpg',
  
  // ET22 Series (201E) - Cargo Pack DLC
  'ET22': 'https://wiki.simrail.eu/vehicle/poland/trains/elec-loco/et22/et22_main.jpg',
  '201E': 'https://wiki.simrail.eu/vehicle/poland/trains/elec-loco/et22/et22_main.jpg',
  
  // ET25 E6ACTa Dragon2
  'ET25': 'https://wiki.simrail.eu/vehicle/poland/trains/elec-loco/et25/et25_main.jpg',
  'E6ACTa': 'https://wiki.simrail.eu/vehicle/poland/trains/elec-loco/et25/et25_main.jpg',
  'Dragon2': 'https://wiki.simrail.eu/vehicle/poland/trains/elec-loco/et25/et25_main.jpg',
  
  // EU43 E186 Traxx
  'EU43': 'https://wiki.simrail.eu/vehicle/poland/trains/elec-loco/traxx/traxx_main.jpg',
  'E186': 'https://wiki.simrail.eu/vehicle/poland/trains/elec-loco/traxx/traxx_main.jpg',
  'Traxx': 'https://wiki.simrail.eu/vehicle/poland/trains/elec-loco/traxx/traxx_main.jpg',
  
  // ED250 Pendolino
  'ED250': 'https://wiki.simrail.eu/vehicle/poland/trains/emu/pendolino/pendolino_main.jpg',
  'Pendolino': 'https://wiki.simrail.eu/vehicle/poland/trains/emu/pendolino/pendolino_main.jpg',
  
  // EN57/EN71 Kibel
  'EN57': 'https://wiki.simrail.eu/vehicle/poland/trains/emu/kibel/kibel_main.jpg',
  'EN71': 'https://wiki.simrail.eu/vehicle/poland/trains/emu/kibel/kibel_main.jpg',
  'Kibel': 'https://wiki.simrail.eu/vehicle/poland/trains/emu/kibel/kibel_main.jpg',
  
  // EN76/EN96 Elf
  'EN76': 'https://wiki.simrail.eu/vehicle/poland/trains/emu/elf/elf_main.jpg',
  'EN96': 'https://wiki.simrail.eu/vehicle/poland/trains/emu/elf/elf_main.jpg',
  'Elf': 'https://wiki.simrail.eu/vehicle/poland/trains/emu/elf/elf_main.jpg',
  
  // Ty2 BR 52 (Steam)
  'Ty2': 'https://wiki.simrail.eu/vehicle/poland/trains/steam/ty2/ty2_main.jpg',
  'BR52': 'https://wiki.simrail.eu/vehicle/poland/trains/steam/ty2/ty2_main.jpg',
};

// Fallback images for unknown train types
export const fallbackImages = {
  electric: 'https://wiki.simrail.eu/vehicle/eu07-005.jpg',
  emu: 'https://wiki.simrail.eu/vehicle/poland/trains/emu/kibel/kibel_main.jpg',
  steam: 'https://wiki.simrail.eu/vehicle/poland/trains/steam/ty2/ty2_main.jpg',
  default: 'https://wiki.simrail.eu/vehicles_logo.png'
};

/**
 * Get train image URL based on train number or type
 * @param trainNumber - Full train number (e.g., "EU07-005", "EP08-001")
 * @param trainType - Train type if available
 * @returns Image URL for the train
 */
export function getTrainImage(trainNumber: string, trainType?: string): string {
  if (!trainNumber && !trainType) {
    return fallbackImages.default;
  }

  // Extract locomotive type from train number
  const extractedType = extractLocomotiveType(trainNumber);
  
  // Check direct mapping first
  if (trainType && trainImages[trainType]) {
    return trainImages[trainType];
  }
  
  if (extractedType && trainImages[extractedType]) {
    return trainImages[extractedType];
  }
  
  // Check for partial matches
  for (const [key, image] of Object.entries(trainImages)) {
    if (trainNumber.includes(key) || (trainType && trainType.includes(key))) {
      return image;
    }
  }
  
  return fallbackImages.default;
}

/**
 * Extract locomotive type from train number
 * @param trainNumber - Train number (e.g., "EU07-005")
 * @returns Locomotive type (e.g., "EU07")
 */
function extractLocomotiveType(trainNumber: string): string | null {
  if (!trainNumber) return null;
  
  // Common patterns for locomotive identification
  const patterns = [
    /^(EU07|EP07|EP08|ET22|ET25|EU43|ED250|EN57|EN71|EN76|EN96|Ty2)/i,
    /^(4E|102E|201E|E6ACTa|E186)/i,
  ];
  
  for (const pattern of patterns) {
    const match = trainNumber.match(pattern);
    if (match) {
      return match[1].toUpperCase();
    }
  }
  
  return null;
}

/**
 * Get train type description
 * @param trainType - Train type
 * @returns Human readable description
 */
export function getTrainTypeDescription(trainType: string): string {
  const descriptions: { [key: string]: string } = {
    'EU07': 'Elektrická lokomotiva pro osobní a nákladní dopravu',
    'EP07': 'Elektrická lokomotiva pro rychlé osobní vlaky', 
    'EP08': 'Elektrická lokomotiva pro rychlé osobní vlaky (140 km/h)',
    'ET22': 'Těžká nákladní elektrická lokomotiva',
    'ET25': 'Moderní elektrická lokomotiva Dragon2',
    'EU43': 'Elektrická lokomotiva Traxx',
    'ED250': 'Vysokorychlostní vlak Pendolino',
    'EN57': 'Elektrická jednotka pro regionální dopravu',
    'EN71': 'Elektrická jednotka pro regionální dopravu',
    'EN76': 'Moderní elektrická jednotka Elf',
    'EN96': 'Moderní elektrická jednotka Elf',
    'Ty2': 'Parní lokomotiva BR 52',
  };
  
  return descriptions[trainType] || 'Neznámý typ vozidla';
}

export default {
  trainImages,
  fallbackImages,
  getTrainImage,
  getTrainTypeDescription
};