import { SimRailTrain, SimRailTimetableEntry, SimRailStation } from '@/types';

const SIMRAIL_BASE_URL = 'https://panel.simrail.eu:8084';
const SIMRAIL_API_URL = 'https://api1.aws.simrail.eu:8082';
const SERVER_CODE = 'cz1';

// Get base URL for API calls (works both client and server side)
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // Client side
    return window.location.origin;
  }
  // Server side
  return process.env.NEXTAUTH_URL || 'http://localhost:3000';
};

/**
 * Fetch all available trains from SimRail API via our proxy
 */
export async function fetchAvailableTrains(): Promise<SimRailTrain[]> {
  try {
    console.log('Fetching trains via proxy endpoint...');
    
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/simrail/trains?serverCode=${SERVER_CODE}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Proxy response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`Proxy API error! status: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Proxy API Response data:', data);
    console.log('Data type:', typeof data, 'Array?', Array.isArray(data));
    
    // Check if data is array
    if (!Array.isArray(data)) {
      console.error('Expected array but got:', typeof data, data);
      return getMockTrains();
    }
    
    console.log('Number of trains:', data.length);
    
    // Transform API response to our interface
    const trains = data.map((train: any): SimRailTrain => {
      console.log('Processing train:', train);
      return {
        id: train.id || `${train.trainNumber}-${Date.now()}`,
        trainNumber: train.trainNumber || 'Unknown',
        trainName: train.trainName || '',
        startStation: train.startStation || 'Unknown',
        endStation: train.endStation || 'Unknown',
        currentStation: train.currentStation,
        nextStation: train.nextStation,
        serverCode: SERVER_CODE,
        type: train.type || extractTrainType(train.trainNumber),
        company: train.company || 'Unknown',
        speed: train.speed || 0,
        maxSpeed: train.maxSpeed || 0,
        signal: train.signal,
        distance: train.distance,
        distanceToSignalInFront: train.distanceToSignalInFront,
        lat: train.lat,
        lng: train.lng,
        timetable: train.timetable || [] // Include timetable from API
      };
    });
    
    console.log('Processed trains:', trains);
    return trains;
  } catch (error) {
    console.error('Error fetching trains via proxy:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    // Return mock data for testing if API fails
    console.log('Returning mock data for testing...');
    return getMockTrains();
  }
}

/**
 * Get mock train data for testing when API is not available
 */
function getMockTrains(): SimRailTrain[] {
  return [
    {
      id: 'mock-1',
      trainNumber: 'R 672',
      trainName: 'RegioJet',
      startStation: 'Praha hl.n.',
      endStation: 'Brno hl.n.',
      currentStation: 'Pardubice hl.n.',
      nextStation: 'Česká Třebová',
      serverCode: 'cz1',
      type: 'REGIONAL',
      company: 'České dráhy',
      speed: 85,
      maxSpeed: 120,
      signal: 'Green',
      distance: 125.5,
      distanceToSignalInFront: 2.3,
      lat: 49.5175,
      lng: 15.472
    },
    {
      id: 'mock-2',
      trainNumber: 'EC 378',
      trainName: 'EuroCity',
      startStation: 'Praha hl.n.',
      endStation: 'Wien Hbf',
      currentStation: 'Brno hl.n.',
      nextStation: 'Břeclav',
      serverCode: 'cz1',
      type: 'EXPRESS',
      company: 'České dráhy',
      speed: 0,
      maxSpeed: 160,
      signal: 'Red',
      distance: 89.2,
      distanceToSignalInFront: 0.8,
      lat: 49.1951,
      lng: 16.6068
    },
    {
      id: 'mock-3',
      trainNumber: 'Os 7331',
      trainName: 'Osobní vlak',
      startStation: 'Brno hl.n.',
      endStation: 'Blansko',
      serverCode: 'cz1',
      type: 'LOCAL',
      company: 'České dráhy',
      speed: 45,
      maxSpeed: 90,
      signal: 'Yellow',
      distance: 15.7,
      distanceToSignalInFront: 1.2,
      lat: 49.2167,
      lng: 16.7167
    }
  ];
}

/**
 * Fetch train positions for real-time tracking
 */
export async function fetchTrainPositions(): Promise<any[]> {
  try {
    const response = await fetch(`${SIMRAIL_BASE_URL}/train-positions-open?serverCode=${SERVER_CODE}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching train positions:', error);
    return [];
  }
}

/**
 * Fetch detailed timetable for a specific train
 */
export async function fetchTrainTimetable(trainNumber: string): Promise<SimRailTimetableEntry[]> {
  try {
    // Use our new proxy endpoint for timetables
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/simrail/timetable/${trainNumber}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const timetableData = await response.json();
    
    console.log('Timetable data for train', trainNumber, ':', timetableData);
    
    return timetableData;
  } catch (error) {
    console.error('Error fetching timetable:', error);
    return [];
  }
}

/**
 * Fetch all stations via our proxy endpoint
 */
export async function fetchStations(): Promise<SimRailStation[]> {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/simrail/stations?serverCode=${SERVER_CODE}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch stations');
    }
    
    return result.data.map((station: any): SimRailStation => ({
      id: station.id,
      name: station.name,
      prefix: station.prefix,
      latitude: station.latitude,
      longitude: station.longitude,
      difficultyLevel: station.difficultyLevel,
      mainImageURL: station.mainImageURL,
      additionalImage1URL: station.additionalImage1URL,
      additionalImage2URL: station.additionalImage2URL,
      dispatchedBy: station.dispatchedBy
    }));
  } catch (error) {
    console.error('Error fetching stations:', error);
    return [];
  }
}

// Cache for stations to avoid repeated API calls
let stationsCache: SimRailStation[] | null = null;
let stationsCacheTimestamp = 0;
const STATIONS_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Get cached stations or fetch new ones
 */
async function getCachedStations(): Promise<SimRailStation[]> {
  const now = Date.now();
  
  if (stationsCache && (now - stationsCacheTimestamp) < STATIONS_CACHE_DURATION) {
    return stationsCache;
  }
  
  stationsCache = await fetchStations();
  stationsCacheTimestamp = now;
  return stationsCache;
}

/**
 * Find station name by GPS coordinates
 * Uses distance calculation to find the closest station
 */
export async function findStationByCoordinates(lat: number, lng: number, maxDistance = 5000): Promise<string | null> {
  try {
    const stations = await getCachedStations();
    
    if (stations.length === 0) {
      console.warn('No stations available for coordinate lookup');
      return null;
    }
    
    let closestStation: SimRailStation | null = null;
    let minDistance = Infinity;
    
    for (const station of stations) {
      const distance = calculateDistance(lat, lng, station.latitude, station.longitude);
      if (distance < minDistance && distance <= maxDistance) {
        minDistance = distance;
        closestStation = station;
      }
    }
    
    if (closestStation) {
      console.log(`🎯 Found station "${closestStation.name}" at distance ${Math.round(minDistance)}m from coordinates [${lat}, ${lng}]`);
      return closestStation.name;
    }
    
    console.warn(`❌ No station found within ${maxDistance}m of coordinates [${lat}, ${lng}]`);
    return null;
  } catch (error) {
    console.error('Error finding station by coordinates:', error);
    return null;
  }
}

/**
 * Calculate distance between two GPS coordinates in meters
 * Uses Haversine formula
 */
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000; // Earth's radius in meters
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Get real-time train position by train number
 */
export async function getTrainPosition(trainNumber: string): Promise<any | null> {
  try {
    const trains = await fetchAvailableTrains();
    const train = trains.find(t => t.trainNumber === trainNumber);
    
    if (!train) {
      console.warn(`⚠️ Train ${trainNumber} not found in available trains`);
      return null;
    }

    console.log(`🚂 Found train ${trainNumber}:`, {
      trainNumber: train.trainNumber,
      hasCoordinates: !!(train.lat && train.lng),
      coordinates: train.lat && train.lng ? `${train.lat}, ${train.lng}` : 'None',
      currentStation: train.currentStation || 'None',
      nextStation: train.nextStation || 'None'
    });

    // Convert GPS coordinates to station names if available
    let currentStationName = train.currentStation;
    let nextStationName = train.nextStation;
    
    // If we have GPS coordinates but not station names, try to resolve them
    if (train.lat && train.lng && !currentStationName) {
      console.log(`🗺️ Attempting to resolve GPS ${train.lat}, ${train.lng} to station name`);
      const resolvedStation = await findStationByCoordinates(train.lat, train.lng);
      if (resolvedStation) {
        currentStationName = resolvedStation;
        console.log(`✅ Resolved to station: ${resolvedStation}`);
      } else {
        console.warn(`❌ Could not resolve GPS coordinates to station`);
      }
    }
    
    // For next station, we'd need trajectory prediction - for now use fallback
    if (!nextStationName) {
      // Try to get next station from timetable
      try {
        const timetable = await fetchTrainTimetable(trainNumber);
        if (timetable.length > 0 && currentStationName) {
          const currentIndex = timetable.findIndex(entry => entry.stationName === currentStationName);
          if (currentIndex >= 0 && currentIndex < timetable.length - 1) {
            nextStationName = timetable[currentIndex + 1].stationName;
            console.log(`📍 Next station from timetable: ${nextStationName}`);
          }
        }
      } catch (error) {
        console.warn('Could not get timetable for next station lookup:', error);
      }
    }

    const result = {
      trainNumber: train.trainNumber,
      currentStation: currentStationName || `GPS: ${train.lat?.toFixed(4)}, ${train.lng?.toFixed(4)}`,
      nextStation: nextStationName || 'Neznámá',
      speed: train.speed || 0,
      lat: train.lat,
      lng: train.lng,
      progress: 50 // TODO: Calculate actual progress based on timetable
    };

    console.log(`📊 Final position result:`, result);
    return result;
    
  } catch (error) {
    console.error('Error getting train position:', error);
    return null;
  }
}

/**
 * Calculate delay based on timetable and current position
 * Compares real time with scheduled arrival/departure times
 */
export async function calculateTrainDelay(trainNumber: string): Promise<number> {
  try {
    const timetable = await fetchTrainTimetable(trainNumber);
    const position = await getTrainPosition(trainNumber);
    
    if (!timetable.length || !position) {
      return 0;
    }
    
    const now = new Date();
    
    // Find current station in timetable
    let currentStationEntry = null;
    let currentStationIndex = -1;
    
    // First try to find by station name
    if (position.currentStation) {
      currentStationIndex = timetable.findIndex(entry => 
        entry.stationName === position.currentStation
      );
      if (currentStationIndex >= 0) {
        currentStationEntry = timetable[currentStationIndex];
      }
    }
    
    // If not found by name, find by time proximity
    if (!currentStationEntry) {
      const currentTimeStr = now.toTimeString().slice(0, 8); // HH:mm:ss
      
      for (let i = 0; i < timetable.length; i++) {
        const entry = timetable[i];
        const departureTime = entry.departureTime?.slice(11, 19);
        const arrivalTime = entry.arrivalTime?.slice(11, 19);
        
        // Check if we're around this station's time
        if (departureTime && currentTimeStr <= departureTime) {
          currentStationIndex = Math.max(0, i - 1);
          currentStationEntry = timetable[currentStationIndex] || entry;
          break;
        }
      }
    }
    
    if (!currentStationEntry) {
      console.warn('Could not determine current station for delay calculation');
      return 0;
    }
    
    console.log(`🕐 Calculating delay for station: ${currentStationEntry.stationName}`);
    
    // Determine if this is a stop or pass-through
    const isStop = currentStationEntry.stopType !== 'TECHNICAL' && 
                   currentStationEntry.arrivalTime && 
                   currentStationEntry.departureTime;
    
    let scheduledTime: Date;
    let delayType: string;
    
    if (isStop) {
      // For stops, use departure time as reference
      if (currentStationEntry.departureTime) {
        scheduledTime = new Date(currentStationEntry.departureTime);
        delayType = 'departure';
      } else if (currentStationEntry.arrivalTime) {
        scheduledTime = new Date(currentStationEntry.arrivalTime);
        delayType = 'arrival';
      } else {
        return 0;
      }
    } else {
      // For pass-through, use arrival time or departure time
      if (currentStationEntry.arrivalTime) {
        scheduledTime = new Date(currentStationEntry.arrivalTime);
        delayType = 'pass-through';
      } else if (currentStationEntry.departureTime) {
        scheduledTime = new Date(currentStationEntry.departureTime);
        delayType = 'pass-through';
      } else {
        return 0;
      }
    }
    
    // Calculate delay in minutes
    const delayMs = now.getTime() - scheduledTime.getTime();
    const delayMinutes = Math.round(delayMs / 1000 / 60);
    
    console.log(`📊 Delay calculation:`, {
      station: currentStationEntry.stationName,
      type: delayType,
      scheduledTime: scheduledTime.toLocaleTimeString('cs-CZ'),
      currentTime: now.toLocaleTimeString('cs-CZ'),
      delayMinutes: Math.max(0, delayMinutes),
      isStop
    });
    
    // Return positive delay only (negative means we're early)
    return Math.max(0, delayMinutes);
    
  } catch (error) {
    console.error('Error calculating delay:', error);
    return 0;
  }
}

/**
 * Get detailed delay information for a train
 */
export async function getTrainDelayDetails(trainNumber: string): Promise<{
  currentDelay: number;
  currentStation: string;
  nextStation: string;
  scheduledArrival?: string;
  scheduledDeparture?: string;
  estimatedArrival?: string;
  estimatedDeparture?: string;
  delayTrend: 'improving' | 'worsening' | 'stable';
} | null> {
  try {
    const timetable = await fetchTrainTimetable(trainNumber);
    const position = await getTrainPosition(trainNumber);
    const currentDelay = await calculateTrainDelay(trainNumber);
    
    if (!timetable.length || !position) {
      return null;
    }
    
    // Find current and next station
    let currentStationIndex = -1;
    let nextStationIndex = -1;
    
    if (position.currentStation) {
      currentStationIndex = timetable.findIndex(entry => 
        entry.stationName === position.currentStation
      );
      nextStationIndex = currentStationIndex + 1;
    }
    
    const currentStation = timetable[currentStationIndex];
    const nextStation = timetable[nextStationIndex];
    
    // Calculate estimated times with current delay
    let estimatedArrival, estimatedDeparture;
    
    if (nextStation) {
      if (nextStation.arrivalTime) {
        const scheduled = new Date(nextStation.arrivalTime);
        estimatedArrival = new Date(scheduled.getTime() + currentDelay * 60000).toLocaleTimeString('cs-CZ');
      }
      
      if (nextStation.departureTime) {
        const scheduled = new Date(nextStation.departureTime);
        estimatedDeparture = new Date(scheduled.getTime() + currentDelay * 60000).toLocaleTimeString('cs-CZ');
      }
    }
    
    return {
      currentDelay,
      currentStation: position.currentStation || 'Neznámá',
      nextStation: position.nextStation || nextStation?.stationName || 'Neznámá',
      scheduledArrival: nextStation?.arrivalTime?.slice(11, 19),
      scheduledDeparture: nextStation?.departureTime?.slice(11, 19),
      estimatedArrival,
      estimatedDeparture,
      delayTrend: 'stable' // TODO: Implement trend analysis
    };
    
  } catch (error) {
    console.error('Error getting delay details:', error);
    return null;
  }
}

/**
 * Filter trains by search query
 */
export function filterTrains(trains: SimRailTrain[], searchQuery: string): SimRailTrain[] {
  if (!searchQuery.trim()) {
    return trains;
  }
  
  const query = searchQuery.toLowerCase();
  return trains.filter(train => 
    train.trainNumber.toLowerCase().includes(query) ||
    train.startStation.toLowerCase().includes(query) ||
    train.endStation.toLowerCase().includes(query) ||
    `${train.startStation} → ${train.endStation}`.toLowerCase().includes(query)
  );
}

/**
 * Extract train type from train number
 */
function extractTrainType(trainNumber: string): string {
  if (!trainNumber) return 'UNKNOWN';
  
  // Extract prefix (letters before numbers)
  const match = trainNumber.match(/^([A-Za-z]+)/);
  return match ? match[1].toUpperCase() : 'UNKNOWN';
}

/**
 * Check if train is available for assignment
 */
export function isTrainAvailable(train: SimRailTrain): boolean {
  // Add logic to check if train is already taken by another player
  // This would typically involve checking against our Firebase database
  return true; // For now, assume all trains are available
}

/**
 * Get formatted route string
 */
export function getFormattedRoute(train: SimRailTrain): string {
  return `${train.startStation} → ${train.endStation}`;
}

/**
 * Get estimated journey time
 */
export function getEstimatedJourneyTime(timetable: SimRailTimetableEntry[]): number {
  if (timetable.length < 2) return 0;
  
  const first = timetable[0];
  const last = timetable[timetable.length - 1];
  
  const startTime = new Date(first.departureTime || first.arrivalTime || '');
  const endTime = new Date(last.arrivalTime || last.departureTime || '');
  
  return Math.round((endTime.getTime() - startTime.getTime()) / 1000 / 60); // minutes
}

export default {
  fetchAvailableTrains,
  fetchTrainPositions,
  fetchTrainTimetable,
  fetchStations,
  findStationByCoordinates,
  getTrainPosition,
  calculateTrainDelay,
  getTrainDelayDetails,
  filterTrains,
  isTrainAvailable,
  getFormattedRoute,
  getEstimatedJourneyTime
};