// Discord Configuration
export interface DiscordConfig {
  DISPATCHER_CHANNEL_ID: string;
  ACTIVE_RIDES_CHANNEL_ID: string;
  ADMIN_ROLE_ID: string;
  EMPLOYEE_ROLE_ID: string;
  STROJVUDCE_ROLE_ID: string;
  VYPRAVCI_ROLE_ID: string;
}

// User Types
export interface User {
  id: string;
  discordId: string;
  username: string;
  discriminator: string;
  avatar?: string;
  email?: string;
  roles: UserRole[];
  createdAt: Date;
  lastLogin: Date;
}

export interface UserStats {
  userId: string;
  points: number;
  level: number;
  streak: number;
  totalRides: number;
  completedRides: number;
  averageRating: number;
  lastActivity: Date;
}

export type UserRole = 'ADMIN' | 'EMPLOYEE' | 'STROJVUDCE' | 'VYPRAVCI';

// Ride Types
// SimRail API Types
export interface SimRailTrain {
  id: string;
  trainNumber: string;
  trainName?: string;
  startStation: string;
  endStation: string;
  currentStation?: string;
  nextStation?: string;
  serverCode: string;
  type: string;
  company?: string;
  speed?: number;
  maxSpeed?: number;
  signal?: string;
  distance?: number;
  distanceToSignalInFront?: number;
  lat?: number;
  lng?: number;
  vehicles?: string[];
  timetable?: SimRailTimetableEntry[];
}

export interface SimRailTimetableEntry {
  stationName: string;
  stationCategory: string;
  arrivalTime?: string;
  departureTime?: string;
  platform?: string;
  track?: string;
  maxSpeed?: number;
  radioChanels?: string[];
  supervisedBy?: string;
  mileage?: number;
  stopType?: 'COMMERCIAL' | 'NON_COMMERCIAL' | 'TECHNICAL';
}

export interface SimRailStation {
  id: string;
  name: string;
  prefix: string;
  latitude: number;
  longitude: number;
  difficultyLevel: number;
  mainImageURL?: string;
  additionalImage1URL?: string;
  additionalImage2URL?: string;
  dispatchedBy: Array<{
    ServerCode: string;
    SteamId: string;
  }>;
}

export interface ActiveRide {
  id: string;
  trainId: string;
  trainNumber: string;
  route: string;
  startStation: string;
  endStation: string;
  userId: string;
  userName: string;
  startTime: Date;
  currentStation?: string;
  nextStation?: string;
  delay: number;
  progress: number;
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED';
  estimatedArrival?: Date;
  actualArrival?: Date;
  isMinimized: boolean;
}

export interface Ride {
  id: string;
  trainNumber: string;
  route: string;
  departure: {
    station: string;
    time: Date;
  };
  arrival: {
    station: string;
    time: Date;
  };
  status: RideStatus;
  assignedUserId?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
}

export type RideStatus = 
  | 'PENDING'     // Čeká na přiřazení
  | 'ASSIGNED'    // Přiřazeno strojvůdci
  | 'IN_PROGRESS' // Probíhá
  | 'COMPLETED'   // Dokončeno
  | 'CANCELLED'   // Zrušeno
  | 'DELAYED';    // Zpožděno

// Assignment Types
export interface Assignment {
  id: string;
  rideId: string;
  userId: string;
  assignedBy: string;
  assignedAt: Date;
  acceptedAt?: Date;
  status: AssignmentStatus;
  notes?: string;
}

export type AssignmentStatus = 
  | 'PENDING'   // Čeká na potvrzení
  | 'ACCEPTED'  // Přijato
  | 'DECLINED'  // Odmítnuto
  | 'EXPIRED';  // Vypršelo

// Live Tracking Types
export interface LiveTrackingData {
  rideId: string;
  userId: string;
  currentLocation?: {
    latitude: number;
    longitude: number;
    station?: string;
  };
  progress: {
    current: number;
    total: number;
    percentage: number;
  };
  estimatedArrival?: Date;
  actualDeparture?: Date;
  delays: number; // v minutách
  lastUpdate: Date;
}

// Progress Bar Data
export interface ProgressBarData {
  current: number;
  total: number;
  percentage: number;
  label?: string;
}

// Discord Bot Data Structures (for migration)
export interface DiscordBotData {
  aktivniJizdy: Map<string, Ride>;
  dokonceneJizdy: Map<string, Ride[]>;
  userStats: Map<string, UserStats>;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Session Types (NextAuth extension)
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      discordId: string;
      username: string;
      discriminator: string;
      avatar?: string;
      email?: string;
      roles: UserRole[];
    };
  }

  interface User {
    discordId: string;
    username: string;
    discriminator: string;
    avatar?: string;
    roles: UserRole[];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    discordId: string;
    username: string;
    discriminator: string;
    avatar?: string;
    roles: UserRole[];
  }
}

// Firestore Document Types
export interface FirestoreUser extends Omit<User, 'createdAt' | 'lastLogin'> {
  createdAt: any; // Firestore Timestamp
  lastLogin: any; // Firestore Timestamp
}

export interface FirestoreRide extends Omit<Ride, 'departure' | 'arrival' | 'createdAt' | 'updatedAt'> {
  departure: {
    station: string;
    time: any; // Firestore Timestamp
  };
  arrival: {
    station: string;
    time: any; // Firestore Timestamp
  };
  createdAt: any; // Firestore Timestamp
  updatedAt: any; // Firestore Timestamp
}

export interface FirestoreAssignment extends Omit<Assignment, 'assignedAt' | 'acceptedAt'> {
  assignedAt: any; // Firestore Timestamp
  acceptedAt?: any; // Firestore Timestamp
}

export interface FirestoreLiveTracking extends Omit<LiveTrackingData, 'estimatedArrival' | 'actualDeparture' | 'lastUpdate'> {
  estimatedArrival?: any; // Firestore Timestamp
  actualDeparture?: any; // Firestore Timestamp
  lastUpdate: any; // Firestore Timestamp
}