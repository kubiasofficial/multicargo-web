import { SimRailTrain, SimRailTimetableEntry, SimRailStation } from '@/types';

const SIMRAIL_BASE_URL = 'https://panel.simrail.eu:8084';
const SIMRAIL_API_URL = 'https://api1.aws.simrail.eu:8082';
const SERVER_CODE = 'cz1';

/**
 * Fetch all available trains from SimRail API via our proxy
 */
export async function fetchAvailableTrains(): Promise<SimRailTrain[]> {
  try {
    console.log('Fetching trains via proxy endpoint...');
    
    const response = await fetch(`/api/simrail/trains?serverCode=${SERVER_CODE}`, {
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
        trainNumber: train.trainNumber || train.TrainNumber || 'Unknown',
        trainName: train.trainName || train.TrainName,
        startStation: train.startStation || train.StartStation || 'Unknown',
        endStation: train.endStation || train.EndStation || 'Unknown',
        currentStation: train.currentStation || train.CurrentStation,
        nextStation: train.nextStation || train.NextStation,
        serverCode: SERVER_CODE,
        type: train.type || train.Type || extractTrainType(train.trainNumber || train.TrainNumber),
        company: train.company || train.Company,
        speed: train.speed || train.Speed,
        maxSpeed: train.maxSpeed || train.MaxSpeed,
        signal: train.signal || train.Signal,
        distance: train.distance || train.Distance,
        distanceToSignalInFront: train.distanceToSignalInFront || train.DistanceToSignalInFront,
        lat: train.lat || train.Lat,
        lng: train.lng || train.Lng
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
    const response = await fetch(`${SIMRAIL_API_URL}/api/getAllTimetables?serverCode=${SERVER_CODE}&train=${trainNumber}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    return data.map((entry: any): SimRailTimetableEntry => ({
      stationName: entry.stationName,
      stationCategory: entry.stationCategory,
      arrivalTime: entry.arrivalTime,
      departureTime: entry.departureTime,
      platform: entry.platform,
      track: entry.track,
      maxSpeed: entry.maxSpeed,
      radioChanels: entry.radioChanels,
      supervisedBy: entry.supervisedBy,
      mileage: entry.mileage,
      stopType: entry.stopType
    }));
  } catch (error) {
    console.error('Error fetching timetable:', error);
    return [];
  }
}

/**
 * Fetch all stations
 */
export async function fetchStations(): Promise<SimRailStation[]> {
  try {
    const response = await fetch(`${SIMRAIL_BASE_URL}/stations-open?serverCode=${SERVER_CODE}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    return data.map((station: any): SimRailStation => ({
      id: station.id,
      name: station.name,
      lat: station.lat,
      lng: station.lng,
      mainImageUrl: station.mainImageUrl
    }));
  } catch (error) {
    console.error('Error fetching stations:', error);
    return [];
  }
}

/**
 * Get real-time train position by train number
 */
export async function getTrainPosition(trainNumber: string): Promise<any | null> {
  try {
    const positions = await fetchTrainPositions();
    return positions.find(pos => pos.trainNumber === trainNumber) || null;
  } catch (error) {
    console.error('Error getting train position:', error);
    return null;
  }
}

/**
 * Calculate delay based on timetable and current position
 */
export async function calculateTrainDelay(trainNumber: string): Promise<number> {
  try {
    const timetable = await fetchTrainTimetable(trainNumber);
    const position = await getTrainPosition(trainNumber);
    
    if (!timetable.length || !position) {
      return 0;
    }
    
    // Find current station in timetable
    const currentStationEntry = timetable.find(entry => 
      entry.stationName === position.currentStation
    );
    
    if (!currentStationEntry) {
      return 0;
    }
    
    // Calculate delay (simplified logic)
    const now = new Date();
    const scheduledTime = new Date(currentStationEntry.departureTime || currentStationEntry.arrivalTime || '');
    
    return Math.max(0, Math.round((now.getTime() - scheduledTime.getTime()) / 1000 / 60)); // minutes
  } catch (error) {
    console.error('Error calculating delay:', error);
    return 0;
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
  getTrainPosition,
  calculateTrainDelay,
  filterTrains,
  isTrainAvailable,
  getFormattedRoute,
  getEstimatedJourneyTime
};