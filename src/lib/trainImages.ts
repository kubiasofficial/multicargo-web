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
  // Common SimRail train numbers with specific mappings
  '32920': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/PKP_EU07-005.jpg/300px-PKP_EU07-005.jpg',
  '23919': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/PKP_EU07-005.jpg/300px-PKP_EU07-005.jpg',
  '54015': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/PKP_EU07-005.jpg/300px-PKP_EU07-005.jpg',
  '54017': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/PKP_EU07-005.jpg/300px-PKP_EU07-005.jpg',
  '23911': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/EN57-1752.jpg/300px-EN57-1752.jpg',
  '21417': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/PKP_EU07-005.jpg/300px-PKP_EU07-005.jpg',
  '5341': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/EN57-1752.jpg/300px-EN57-1752.jpg',

  // EU07/EP07 Series (4E) - Specific variants
  'EU07-005': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/PKP_EU07-005.jpg/300px-PKP_EU07-005.jpg',
  'EU07-068': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/PKP_EU07-005.jpg/300px-PKP_EU07-005.jpg',
  'EU07-070': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/PKP_EU07-005.jpg/300px-PKP_EU07-005.jpg',
  'EU07-085': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/PKP_EU07-005.jpg/300px-PKP_EU07-005.jpg',
  'EU07-092': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/PKP_EU07-005.jpg/300px-PKP_EU07-005.jpg',
  'EU07-096': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/PKP_EU07-005.jpg/300px-PKP_EU07-005.jpg',
  'EP07-135': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/PKP_EU07-005.jpg/300px-PKP_EU07-005.jpg',
  'EU07-153': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/PKP_EU07-005.jpg/300px-PKP_EU07-005.jpg',
  'EU07-193': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/PKP_EU07-005.jpg/300px-PKP_EU07-005.jpg',
  'EP07-174': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/PKP_EU07-005.jpg/300px-PKP_EU07-005.jpg',
  'EU07-241': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/PKP_EU07-005.jpg/300px-PKP_EU07-005.jpg',
  
  // EU07/EP07 Series (4E) - General types
  'EU07': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/PKP_EU07-005.jpg/300px-PKP_EU07-005.jpg',
  'EP07': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/PKP_EU07-005.jpg/300px-PKP_EU07-005.jpg',
  '4E': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/PKP_EU07-005.jpg/300px-PKP_EU07-005.jpg',
  
  // EP08 Series (102E)
  'EP08': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/PKP_EU07-005.jpg/300px-PKP_EU07-005.jpg',
  '102E': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/PKP_EU07-005.jpg/300px-PKP_EU07-005.jpg',
  
  // ET22 Series (201E) - Cargo Pack DLC
  'ET22': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/SP32-012.jpg/300px-SP32-012.jpg',
  '201E': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/SP32-012.jpg/300px-SP32-012.jpg',
  
  // ET25 E6ACTa Dragon2
  'ET25': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/PKP_EU07-005.jpg/300px-PKP_EU07-005.jpg',
  'E6ACTa': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/PKP_EU07-005.jpg/300px-PKP_EU07-005.jpg',
  'Dragon2': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/PKP_EU07-005.jpg/300px-PKP_EU07-005.jpg',
  
  // EU43 E186 Traxx
  'EU43': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/PKP_EU07-005.jpg/300px-PKP_EU07-005.jpg',
  'E186': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/PKP_EU07-005.jpg/300px-PKP_EU07-005.jpg',
  'Traxx': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/PKP_EU07-005.jpg/300px-PKP_EU07-005.jpg',
  
  // ED250 Pendolino
  'ED250': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/EN57-1752.jpg/300px-EN57-1752.jpg',
  'Pendolino': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/EN57-1752.jpg/300px-EN57-1752.jpg',
  
  // EN57/EN71 Kibel
  'EN57': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/EN57-1752.jpg/300px-EN57-1752.jpg',
  'EN71': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/EN57-1752.jpg/300px-EN57-1752.jpg',
  'Kibel': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/EN57-1752.jpg/300px-EN57-1752.jpg',
  
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
  electric: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/PKP_EU07-005.jpg/300px-PKP_EU07-005.jpg',
  emu: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/EN57-1752.jpg/300px-EN57-1752.jpg', 
  steam: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/TKt48-191_locomotive.jpg/300px-TKt48-191_locomotive.jpg',
  diesel: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/SP32-012.jpg/300px-SP32-012.jpg',
  default: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Train_icon.svg/200px-Train_icon.svg.png'
};

/**
 * Get train image URL based on vehicles data and train info
 * @param trainNumber - Train number
 * @param trainType - Train type (optional)
 * @param vehicles - Array of vehicle identifiers from SimRail API (optional)
 * @returns Image URL for the train
 */
export function getTrainImage(trainNumber: string, trainType?: string, vehicles?: string[]): string {
  if (!trainNumber && !trainType && !vehicles) {
    return fallbackImages.default;
  }

  // If we have vehicles data, use it to determine the train image more accurately
  if (vehicles && vehicles.length > 0) {
    const firstVehicle = vehicles[0].toLowerCase();
    
    // Map specific locomotive types based on SimRail vehicle data
    if (firstVehicle.includes('ep08')) {
      return trainImages['EP08'] || fallbackImages.electric;
    }
    if (firstVehicle.includes('ep07')) {
      return trainImages['EP07'] || fallbackImages.electric;
    }
    if (firstVehicle.includes('eu07')) {
      return trainImages['EU07'] || fallbackImages.electric;
    }
    if (firstVehicle.includes('et22')) {
      return trainImages['ET22'] || fallbackImages.diesel;
    }
    if (firstVehicle.includes('et25')) {
      return trainImages['ET25'] || fallbackImages.diesel;
    }
    if (firstVehicle.includes('e186') || firstVehicle.includes('traxx')) {
      return trainImages['EU43'] || fallbackImages.electric;
    }
    if (firstVehicle.includes('dragon') || firstVehicle.includes('e6act')) {
      return trainImages['ET25'] || fallbackImages.electric;
    }
    if (firstVehicle.includes('en57')) {
      return trainImages['EN57'] || fallbackImages.electric;
    }
    if (firstVehicle.includes('en71')) {
      return trainImages['EN71'] || fallbackImages.electric;
    }
    if (firstVehicle.includes('en76')) {
      return trainImages['EN76'] || fallbackImages.electric;
    }
    
    // Try to extract specific locomotive number from vehicles data
    const vehicleMatch = vehicles[0].match(/([A-Z0-9-]+)/);
    if (vehicleMatch) {
      const locomotiveId = vehicleMatch[1];
      if (trainImages[locomotiveId]) {
        return trainImages[locomotiveId];
      }
    }
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
  
  // For numerical train numbers (SimRail), return electric locomotive fallback
  if (/^\d+$/.test(trainNumber)) {
    return fallbackImages.electric;
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
 * Get train type description based on vehicles data and train info
 * @param trainNumber - Train number
 * @param trainType - Train type (optional)
 * @param vehicles - Array of vehicle identifiers from SimRail API (optional)
 * @returns Human readable description
 */
export function getTrainTypeDescription(trainNumber: string, trainType?: string, vehicles?: string[]): string {
  // If we have vehicles data, use it to determine the train type more accurately
  if (vehicles && vehicles.length > 0) {
    const firstVehicle = vehicles[0].toLowerCase();
    
    // Locomotive types based on SimRail vehicle data
    if (firstVehicle.includes('ep08') || firstVehicle.includes('ep07')) {
      return `Osobní vlak s lokomotivou ${vehicles[0].split('/')[1]?.split(':')[0] || 'EP'}`;
    }
    if (firstVehicle.includes('eu07') || firstVehicle.includes('et22') || firstVehicle.includes('et25')) {
      return `Nákladní vlak s lokomotivou ${vehicles[0].split('/')[1]?.split(':')[0] || 'EU/ET'}`;
    }
    if (firstVehicle.includes('e186') || firstVehicle.includes('traxx')) {
      return `Nákladní vlak s lokomotivou Traxx ${vehicles[0].split('/')[1]?.split(':')[0] || 'E186'}`;
    }
    if (firstVehicle.includes('dragon') || firstVehicle.includes('e6act')) {
      return `Nákladní vlak s lokomotivou Dragon ${vehicles[0].split('/')[1]?.split(':')[0] || 'E6ACT'}`;
    }
    
    // Electric multiple units
    if (firstVehicle.includes('en57') || firstVehicle.includes('en71')) {
      return `Regionální vlak s jednotkou ${vehicles[0].split('/')[1] || 'EN57/71'}`;
    }
    if (firstVehicle.includes('en76')) {
      return `Příměstský vlak s jednotkou ${vehicles[0].split('/')[1] || 'EN76'}`;
    }
    
    // Determine by cargo type if it's a freight train
    const hasContainers = vehicles.some(v => v.includes('container') || v.includes('629z') || v.includes('434z'));
    const hasTanks = vehicles.some(v => v.includes('406ra') || v.includes('oil') || v.includes('petrol'));
    const hasWoodBeam = vehicles.some(v => v.includes('wooden_beam') || v.includes('424z'));
    const hasBallast = vehicles.some(v => v.includes('ballast') || v.includes('412w'));
    
    if (hasContainers) {
      return `Kontejnerový vlak s lokomotivou ${vehicles[0].split('/')[1]?.split(':')[0] || ''}`;
    }
    if (hasTanks) {
      return `Cisternový vlak s lokomotivou ${vehicles[0].split('/')[1]?.split(':')[0] || ''}`;
    }
    if (hasWoodBeam) {
      return `Nákladní vlak (dřevo) s lokomotivou ${vehicles[0].split('/')[1]?.split(':')[0] || ''}`;
    }
    if (hasBallast) {
      return `Nákladní vlak (štěrk) s lokomotivou ${vehicles[0].split('/')[1]?.split(':')[0] || ''}`;
    }
  }

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
    
    // Common SimRail train numbers
    '32920': 'Osobní vlak Kraków Płaszów → Kielce',
    '23919': 'Osobní vlak Kielce → Kraków Płaszów',
    '54015': 'Osobní vlak Gdynia Główna → Bohumin',
    '54017': 'Osobní vlak Gdynia Główna → Bohumin',
    '23911': 'Rychlý vlak spojující hlavní polské stanice',
    '21417': 'Regionální spoj v polské síti',
    '5341': 'Místní osobní spoj',
  };
  
  // Check exact match first
  if (descriptions[trainNumber]) {
    return descriptions[trainNumber];
  }
  
  // Extract locomotive type and find description
  const extractedType = extractLocomotiveType(trainNumber);
  if (extractedType && descriptions[extractedType]) {
    return descriptions[extractedType];
  }
  
  // For numerical train numbers, provide general description based on number range
  if (/^\d+$/.test(trainNumber)) {
    const trainNum = parseInt(trainNumber);
    
    // Different train categories by number ranges (based on Polish classification)
    if (trainNum >= 50000 && trainNum <= 59999) {
      return 'Rychlý vlak (kategorie R) - Dálkové spojení mezi velkými městy';
    } else if (trainNum >= 20000 && trainNum <= 29999) {
      return 'Osobní vlak (kategorie OS) - Regionální spojení s častými zastávkami';
    } else if (trainNum >= 30000 && trainNum <= 39999) {
      return 'Regionální rychlík (kategorie REG) - Rychlejší regionální spojení';
    } else if (trainNum >= 1000 && trainNum <= 9999) {
      return 'Express vlak (kategorie EX/IC) - Rychlé spojení mezi hlavními stanicemi';
    } else if (trainNum >= 10000 && trainNum <= 19999) {
      return 'Regionální vlak (kategorie R) - Spojení mezi regionálními centry';
    } else if (trainNum >= 40000 && trainNum <= 49999) {
      return 'Příměstský vlak (kategorie S) - Městská a příměstská doprava';
    } else if (trainNum >= 60000 && trainNum <= 99999) {
      return 'TLK vlak - Twoje Linie Kolejowe (rychlé dálkové spojení)';
    } else if (trainNum >= 100000) {
      return 'Nákladní vlak - Přeprava zboží a materiálů';
    } else {
      return 'Vlak polských železnic (PKP) - Elektrická nebo dieselová trakce';
    }
  }
  
  // Use trainType if available
  if (trainType) {
    switch (trainType.toUpperCase()) {
      case 'REGIONAL':
      case 'R':
        return 'Regionální vlak';
      case 'EXPRESS':
      case 'EC':
      case 'IC':
        return 'Expresní vlak';
      case 'LOCAL':
      case 'OS':
        return 'Osobní vlak';
      case 'FREIGHT':
      case 'CARGO':
        return 'Nákladní vlak';
      case 'TLK':
        return 'TLK (Twoje Linie Kolejowe)';
      case 'EIC':
        return 'EuroCity';
      default:
        return `${trainType} vlak`;
    }
  }
  
  // Check if it contains any known locomotive prefix
  for (const [key, desc] of Object.entries(descriptions)) {
    if (trainNumber.includes(key)) {
      return desc;
    }
  }
  
  return 'Vlak';
}

export default {
  trainImages,
  trainDetails,
  fallbackImages,
  getTrainImage,
  getTrainDetails,
  getTrainTypeDescription
};