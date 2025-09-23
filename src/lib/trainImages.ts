// SimRail train images mapping
// Images sourced from https://wiki.simrail.eu/en/Vehicles/Poland/Overview

export interface TrainImageMapping {
  [key: string]: string;
}

export interface TrainDetails {
  name: string;
  image: string;
  railwayUndertaking: string;
  locoNumber: string;
  uicNumber?: string;
  interior?: string;
  radioDevice?: string;
  registrations: string;
  luaSpawncode: string[];
  description: string;
}

export interface TrainDetailsMapping {
  [key: string]: TrainDetails;
}

// Main locomotive images mapping
export const trainImages: TrainImageMapping = {
  // EU07/EP07 Series (4E) - Specific variants
  'EU07-005': 'https://wiki.simrail.eu/vehicle/eu07-005.png',
  'EU07-068': 'https://wiki.simrail.eu/vehicle/eu07-068.jpg',
  'EU07-070': 'https://wiki.simrail.eu/vehicle/eu07-070.png',
  'EU07-085': 'https://wiki.simrail.eu/vehicle/eu07-085.jpg',
  'EU07-092': 'https://wiki.simrail.eu/vehicle/eu07-092.jpg',
  'EU07-096': 'https://wiki.simrail.eu/vehicle/eu07-096.jpg',
  'EP07-135': 'https://wiki.simrail.eu/vehicle/ep07-135.jpg',
  'EU07-153': 'https://wiki.simrail.eu/vehicle/eu07-153.png',
  'EU07-193': 'https://wiki.simrail.eu/vehicle/eu07-193.png',
  'EP07-174': 'https://wiki.simrail.eu/vehicle/ep07-174.jpg',
  'EU07-241': 'https://wiki.simrail.eu/vehicle/eu07-241.jpg',
  
  // EU07/EP07 Series (4E) - General types
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

// Detailed train information database
export const trainDetails: TrainDetailsMapping = {
  'EU07-005': {
    name: 'EU07-005',
    image: 'https://wiki.simrail.eu/vehicle/eu07-005.jpg',
    railwayUndertaking: 'PKP Intercity',
    locoNumber: 'EU07-005',
    uicNumber: '91 51 5 140 176-6 PL-PKPIC',
    interior: 'white cabin',
    radioDevice: 'old radio device',
    registrations: 'PL',
    luaSpawncode: ['4E/EU07-005', 'LocomotiveNames.EU07_005'],
    description: 'PKP Intercity elektrická lokomotiva s bílou kabinou a starým rádiem'
  },
  'EU07-068': {
    name: 'EU07-068',
    image: 'https://wiki.simrail.eu/vehicle/eu07-068.jpg',
    railwayUndertaking: 'CargoUnit',
    locoNumber: 'EU07-068',
    uicNumber: '91 51 5 140 190-7 PL-ID',
    interior: 'white cabin',
    radioDevice: 'new radio device',
    registrations: 'PL',
    luaSpawncode: ['4E/EU07-068', 'LocomotiveNames.EU07_068'],
    description: 'CargoUnit elektrická lokomotiva s bílou kabinou a novým rádiem'
  },
  'EU07-070': {
    name: 'EU07-070',
    image: 'https://wiki.simrail.eu/vehicle/eu07-070.png',
    railwayUndertaking: 'PUK Kolprem',
    locoNumber: 'EU07-070',
    uicNumber: '91 51 5 140 192-3 PL-KLP',
    interior: 'white cabin',
    radioDevice: 'new radio device',
    registrations: 'PL',
    luaSpawncode: ['4E/EU07-070', 'LocomotiveNames.EU07_070'],
    description: 'PUK Kolprem elektrická lokomotiva s bílou kabinou a novým rádiem'
  },
  'EU07-085': {
    name: 'EU07-085',
    image: 'https://wiki.simrail.eu/vehicle/eu07-085.jpg',
    railwayUndertaking: 'PKP Intercity',
    locoNumber: 'EU07-085',
    uicNumber: '91 51 5 140 196-4 PL-PKPIC',
    interior: 'green cabin',
    radioDevice: 'old radio device',
    registrations: 'PL',
    luaSpawncode: ['4E/EU07-085', 'LocomotiveNames.EU07_085'],
    description: 'PKP Intercity elektrická lokomotiva se zelenou kabinou a starým rádiem'
  },
  'EU07-092': {
    name: 'EU07-092',
    image: 'https://wiki.simrail.eu/vehicle/eu07-092.jpg',
    railwayUndertaking: 'PKP Intercity',
    locoNumber: 'EU07-092',
    uicNumber: '91 51 5 140 199-8 PL-PKPIC',
    interior: 'white cabin',
    radioDevice: 'new radio device',
    registrations: 'PL',
    luaSpawncode: ['4E/EU07-092', 'LocomotiveNames.EU07_092'],
    description: 'PKP Intercity elektrická lokomotiva s bílou kabinou a novým rádiem'
  },
  'EU07-096': {
    name: 'EU07-096',
    image: 'https://wiki.simrail.eu/vehicle/eu07-096.jpg',
    railwayUndertaking: 'PKP Cargo',
    locoNumber: 'EU07-096',
    uicNumber: '91 51 5 140 049-5 PL-PKPC',
    interior: 'green cabin',
    radioDevice: 'old radio device',
    registrations: 'PL',
    luaSpawncode: ['4E/EU07-096', 'LocomotiveNames.EU07_096'],
    description: 'PKP Cargo elektrická lokomotiva se zelenou kabinou a starým rádiem'
  },
  'EP07-135': {
    name: 'EP07-135',
    image: 'https://wiki.simrail.eu/vehicle/ep07-135.jpg',
    railwayUndertaking: 'PKP Intercity',
    locoNumber: 'EP07-135',
    uicNumber: '91 51 1 140 125-2 PL-PKPIC',
    interior: 'green cabin',
    radioDevice: 'old radio device',
    registrations: 'PL',
    luaSpawncode: ['4E/EP07-135', 'LocomotiveNames.EP07_135'],
    description: 'PKP Intercity elektrická lokomotiva EP07 se zelenou kabinou a starým rádiem'
  },
  'EU07-153': {
    name: 'EU07-153',
    image: 'https://wiki.simrail.eu/vehicle/eu07-153.png',
    railwayUndertaking: 'PUK Kolprem',
    locoNumber: 'EU07-153',
    uicNumber: '91 51 5 140 214-5 PL-KLP',
    interior: 'white cabin',
    radioDevice: 'new radio device',
    registrations: 'PL',
    luaSpawncode: ['4E/EU07-153', 'LocomotiveNames.EU07_153'],
    description: 'PUK Kolprem elektrická lokomotiva s bílou kabinou a novým rádiem'
  },
  'EU07-193': {
    name: 'EU07-193',
    image: 'https://wiki.simrail.eu/vehicle/eu07-193.png',
    railwayUndertaking: 'PKP Cargo',
    locoNumber: 'EU07-193',
    uicNumber: '91 51 5 140 072-7 PL-PKPC',
    interior: 'green cabin',
    radioDevice: 'old radio device',
    registrations: 'PL',
    luaSpawncode: ['4E/EU07-193', 'LocomotiveNames.EU07_193'],
    description: 'PKP Cargo elektrická lokomotiva se zelenou kabinou a starým rádiem'
  },
  'EP07-174': {
    name: 'EP07-174',
    image: 'https://wiki.simrail.eu/vehicle/ep07-174.jpg',
    railwayUndertaking: 'PKP Intercity',
    locoNumber: 'EP07-174',
    uicNumber: '91 51 1 140 126-0 PL-PKPIC',
    interior: 'white cabin',
    radioDevice: 'new radio device',
    registrations: 'PL',
    luaSpawncode: ['4E/EP07-174', 'LocomotiveNames.EP07_174'],
    description: 'PKP Intercity elektrická lokomotiva EP07 s bílou kabinou a novým rádiem'
  },
  'EU07-241': {
    name: 'EU07-241',
    image: 'https://wiki.simrail.eu/vehicle/eu07-241.jpg',
    railwayUndertaking: 'PKP Cargo / PKP Intercity',
    locoNumber: 'EU07-241',
    uicNumber: '91 51 5 140 083-4 PL-PKPC',
    interior: 'green cabin',
    radioDevice: 'old radio device',
    registrations: 'PL',
    luaSpawncode: ['4E/EU07-241', 'LocomotiveNames.EU07_241'],
    description: 'PKP Cargo/PKP Intercity elektrická lokomotiva se zelenou kabinou a starým rádiem'
  }
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
  
  // Check for specific locomotive variants first
  const specificPatterns = [
    /^(EU07-005|EU07-068|EU07-070|EU07-085|EU07-092|EU07-096|EU07-153|EU07-193|EU07-241)/i,
    /^(EP07-135|EP07-174)/i,
  ];
  
  for (const pattern of specificPatterns) {
    const match = trainNumber.match(pattern);
    if (match) {
      return match[1].toUpperCase();
    }
  }
  
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
 * Get detailed train information
 * @param trainNumber - Train number (e.g., "EU07-005")
 * @returns Detailed train information or null if not found
 */
export function getTrainDetails(trainNumber: string): TrainDetails | null {
  // Check for exact match first
  if (trainDetails[trainNumber]) {
    return trainDetails[trainNumber];
  }
  
  // Check for partial matches
  for (const [key, details] of Object.entries(trainDetails)) {
    if (trainNumber.includes(key) || details.luaSpawncode.some(code => code.includes(trainNumber))) {
      return details;
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
    // Specific locomotive variants
    'EU07-005': 'PKP Intercity EU07-005 - Elektrická lokomotiva s bílou kabinou a starým rádiem',
    'EU07-068': 'CargoUnit EU07-068 - Elektrická lokomotiva s bílou kabinou a novým rádiem',
    'EU07-070': 'PUK Kolprem EU07-070 - Elektrická lokomotiva s bílou kabinou a novým rádiem',
    'EU07-085': 'PKP Intercity EU07-085 - Elektrická lokomotiva se zelenou kabinou a starým rádiem',
    'EU07-092': 'PKP Intercity EU07-092 - Elektrická lokomotiva s bílou kabinou a novým rádiem',
    'EU07-096': 'PKP Cargo EU07-096 - Elektrická lokomotiva se zelenou kabinou a starým rádiem',
    'EP07-135': 'PKP Intercity EP07-135 - Elektrická lokomotiva se zelenou kabinou a starým rádiem',
    'EU07-153': 'PUK Kolprem EU07-153 - Elektrická lokomotiva s bílou kabinou a novým rádiem',
    'EU07-193': 'PKP Cargo EU07-193 - Elektrická lokomotiva se zelenou kabinou a starým rádiem',
    'EP07-174': 'PKP Intercity EP07-174 - Elektrická lokomotiva s bílou kabinou a novým rádiem',
    'EU07-241': 'PKP Cargo/PKP Intercity EU07-241 - Elektrická lokomotiva se zelenou kabinou a starým rádiem',
    
    // General locomotive types
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
  trainDetails,
  fallbackImages,
  getTrainImage,
  getTrainDetails,
  getTrainTypeDescription
};