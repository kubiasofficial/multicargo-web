import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  Timestamp,
  QueryConstraint
} from 'firebase/firestore';
import { db } from './firebase';
import { 
  User, 
  Ride, 
  Assignment, 
  UserStats, 
  LiveTrackingData,
  FirestoreUser,
  FirestoreRide,
  FirestoreAssignment,
  FirestoreLiveTracking
} from '@/types';

// Collections
const COLLECTIONS = {
  USERS: 'users',
  RIDES: 'rides',
  ASSIGNMENTS: 'assignments',
  USER_STATS: 'userStats',
  LIVE_TRACKING: 'liveTracking'
} as const;

// Helper functions for Firestore timestamp conversion
const toFirestoreTimestamp = (date: Date): Timestamp => {
  return Timestamp.fromDate(date);
};

const fromFirestoreTimestamp = (timestamp: any): Date => {
  return timestamp.toDate();
};

// User operations
export const userOperations = {
  // Create new user
  async create(user: Omit<User, 'id'>): Promise<string> {
    const firestoreUser: Omit<FirestoreUser, 'id'> = {
      ...user,
      createdAt: toFirestoreTimestamp(user.createdAt),
      lastLogin: toFirestoreTimestamp(user.lastLogin)
    };
    
    const docRef = await addDoc(collection(db, COLLECTIONS.USERS), firestoreUser);
    return docRef.id;
  },

  // Get user by ID
  async getById(id: string): Promise<User | null> {
    const docRef = doc(db, COLLECTIONS.USERS, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data() as FirestoreUser;
      return {
        ...data,
        id: docSnap.id,
        createdAt: fromFirestoreTimestamp(data.createdAt),
        lastLogin: fromFirestoreTimestamp(data.lastLogin)
      };
    }
    
    return null;
  },

  // Get user by Discord ID
  async getByDiscordId(discordId: string): Promise<User | null> {
    const q = query(
      collection(db, COLLECTIONS.USERS),
      where('discordId', '==', discordId),
      limit(1)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const data = doc.data() as FirestoreUser;
      return {
        ...data,
        id: doc.id,
        createdAt: fromFirestoreTimestamp(data.createdAt),
        lastLogin: fromFirestoreTimestamp(data.lastLogin)
      };
    }
    
    return null;
  },

  // Update user
  async update(id: string, updates: Partial<User>): Promise<void> {
    const docRef = doc(db, COLLECTIONS.USERS, id);
    const firestoreUpdates: any = { ...updates };
    
    // Convert dates to Firestore timestamps
    if (updates.createdAt) {
      firestoreUpdates.createdAt = toFirestoreTimestamp(updates.createdAt);
    }
    if (updates.lastLogin) {
      firestoreUpdates.lastLogin = toFirestoreTimestamp(updates.lastLogin);
    }
    
    await updateDoc(docRef, firestoreUpdates);
  },

  // Get all users
  async getAll(): Promise<User[]> {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.USERS));
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data() as FirestoreUser;
      return {
        ...data,
        id: doc.id,
        createdAt: fromFirestoreTimestamp(data.createdAt),
        lastLogin: fromFirestoreTimestamp(data.lastLogin)
      };
    });
  }
};

// Ride operations
export const rideOperations = {
  // Create new ride
  async create(ride: Omit<Ride, 'id'>): Promise<string> {
    const firestoreRide: Omit<FirestoreRide, 'id'> = {
      ...ride,
      departure: {
        station: ride.departure.station,
        time: toFirestoreTimestamp(ride.departure.time)
      },
      arrival: {
        station: ride.arrival.station,
        time: toFirestoreTimestamp(ride.arrival.time)
      },
      createdAt: toFirestoreTimestamp(ride.createdAt),
      updatedAt: toFirestoreTimestamp(ride.updatedAt)
    };
    
    const docRef = await addDoc(collection(db, COLLECTIONS.RIDES), firestoreRide);
    return docRef.id;
  },

  // Get ride by ID
  async getById(id: string): Promise<Ride | null> {
    const docRef = doc(db, COLLECTIONS.RIDES, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data() as FirestoreRide;
      return {
        ...data,
        id: docSnap.id,
        departure: {
          station: data.departure.station,
          time: fromFirestoreTimestamp(data.departure.time)
        },
        arrival: {
          station: data.arrival.station,
          time: fromFirestoreTimestamp(data.arrival.time)
        },
        createdAt: fromFirestoreTimestamp(data.createdAt),
        updatedAt: fromFirestoreTimestamp(data.updatedAt)
      };
    }
    
    return null;
  },

  // Get rides by status
  async getByStatus(status: string): Promise<Ride[]> {
    const q = query(
      collection(db, COLLECTIONS.RIDES),
      where('status', '==', status),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data() as FirestoreRide;
      return {
        ...data,
        id: doc.id,
        departure: {
          station: data.departure.station,
          time: fromFirestoreTimestamp(data.departure.time)
        },
        arrival: {
          station: data.arrival.station,
          time: fromFirestoreTimestamp(data.arrival.time)
        },
        createdAt: fromFirestoreTimestamp(data.createdAt),
        updatedAt: fromFirestoreTimestamp(data.updatedAt)
      };
    });
  },

  // Get rides by user
  async getByUserId(userId: string): Promise<Ride[]> {
    const q = query(
      collection(db, COLLECTIONS.RIDES),
      where('assignedUserId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data() as FirestoreRide;
      return {
        ...data,
        id: doc.id,
        departure: {
          station: data.departure.station,
          time: fromFirestoreTimestamp(data.departure.time)
        },
        arrival: {
          station: data.arrival.station,
          time: fromFirestoreTimestamp(data.arrival.time)
        },
        createdAt: fromFirestoreTimestamp(data.createdAt),
        updatedAt: fromFirestoreTimestamp(data.updatedAt)
      };
    });
  },

  // Update ride
  async update(id: string, updates: Partial<Ride>): Promise<void> {
    const docRef = doc(db, COLLECTIONS.RIDES, id);
    const firestoreUpdates: any = { ...updates };
    
    // Convert dates to Firestore timestamps
    if (updates.departure) {
      firestoreUpdates.departure = {
        station: updates.departure.station,
        time: toFirestoreTimestamp(updates.departure.time)
      };
    }
    if (updates.arrival) {
      firestoreUpdates.arrival = {
        station: updates.arrival.station,
        time: toFirestoreTimestamp(updates.arrival.time)
      };
    }
    if (updates.createdAt) {
      firestoreUpdates.createdAt = toFirestoreTimestamp(updates.createdAt);
    }
    if (updates.updatedAt) {
      firestoreUpdates.updatedAt = toFirestoreTimestamp(updates.updatedAt);
    }
    
    await updateDoc(docRef, firestoreUpdates);
  },

  // Delete ride
  async delete(id: string): Promise<void> {
    const docRef = doc(db, COLLECTIONS.RIDES, id);
    await deleteDoc(docRef);
  }
};

// Live tracking operations
export const liveTrackingOperations = {
  // Update live tracking data
  async update(rideId: string, data: Omit<LiveTrackingData, 'rideId'>): Promise<void> {
    const docRef = doc(db, COLLECTIONS.LIVE_TRACKING, rideId);
    const firestoreData: Omit<FirestoreLiveTracking, 'rideId'> = {
      ...data,
      estimatedArrival: data.estimatedArrival ? toFirestoreTimestamp(data.estimatedArrival) : undefined,
      actualDeparture: data.actualDeparture ? toFirestoreTimestamp(data.actualDeparture) : undefined,
      lastUpdate: toFirestoreTimestamp(data.lastUpdate)
    };
    
    await updateDoc(docRef, firestoreData);
  },

  // Get live tracking data
  async getByRideId(rideId: string): Promise<LiveTrackingData | null> {
    const docRef = doc(db, COLLECTIONS.LIVE_TRACKING, rideId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data() as FirestoreLiveTracking;
      return {
        ...data,
        rideId,
        estimatedArrival: data.estimatedArrival ? fromFirestoreTimestamp(data.estimatedArrival) : undefined,
        actualDeparture: data.actualDeparture ? fromFirestoreTimestamp(data.actualDeparture) : undefined,
        lastUpdate: fromFirestoreTimestamp(data.lastUpdate)
      };
    }
    
    return null;
  }
};

// User stats operations
export const userStatsOperations = {
  // Get user stats
  async getByUserId(userId: string): Promise<UserStats | null> {
    const docRef = doc(db, COLLECTIONS.USER_STATS, userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        ...data,
        lastActivity: fromFirestoreTimestamp(data.lastActivity)
      } as UserStats;
    }
    
    return null;
  },

  // Update user stats
  async update(userId: string, stats: Partial<UserStats>): Promise<void> {
    const docRef = doc(db, COLLECTIONS.USER_STATS, userId);
    const firestoreStats: any = { ...stats };
    
    if (stats.lastActivity) {
      firestoreStats.lastActivity = toFirestoreTimestamp(stats.lastActivity);
    }
    
    await updateDoc(docRef, firestoreStats);
  },

  // Create initial user stats
  async create(stats: UserStats): Promise<void> {
    const docRef = doc(db, COLLECTIONS.USER_STATS, stats.userId);
    const firestoreStats = {
      ...stats,
      lastActivity: toFirestoreTimestamp(stats.lastActivity)
    };
    
    await updateDoc(docRef, firestoreStats);
  }
};

// Real-time listeners
export const realtimeListeners = {
  // Listen to active rides
  onActiveRidesChange(callback: (rides: Ride[]) => void): () => void {
    const q = query(
      collection(db, COLLECTIONS.RIDES),
      where('status', 'in', ['ASSIGNED', 'IN_PROGRESS']),
      orderBy('createdAt', 'desc')
    );
    
    return onSnapshot(q, (snapshot) => {
      const rides = snapshot.docs.map(doc => {
        const data = doc.data() as FirestoreRide;
        return {
          ...data,
          id: doc.id,
          departure: {
            station: data.departure.station,
            time: fromFirestoreTimestamp(data.departure.time)
          },
          arrival: {
            station: data.arrival.station,
            time: fromFirestoreTimestamp(data.arrival.time)
          },
          createdAt: fromFirestoreTimestamp(data.createdAt),
          updatedAt: fromFirestoreTimestamp(data.updatedAt)
        };
      });
      
      callback(rides);
    });
  },

  // Listen to live tracking updates
  onLiveTrackingChange(callback: (data: LiveTrackingData[]) => void): () => void {
    const q = query(
      collection(db, COLLECTIONS.LIVE_TRACKING),
      orderBy('lastUpdate', 'desc')
    );
    
    return onSnapshot(q, (snapshot) => {
      const trackingData = snapshot.docs.map(doc => {
        const data = doc.data() as FirestoreLiveTracking;
        return {
          ...data,
          rideId: doc.id,
          estimatedArrival: data.estimatedArrival ? fromFirestoreTimestamp(data.estimatedArrival) : undefined,
          actualDeparture: data.actualDeparture ? fromFirestoreTimestamp(data.actualDeparture) : undefined,
          lastUpdate: fromFirestoreTimestamp(data.lastUpdate)
        };
      });
      
      callback(trackingData);
    });
  },

  // Listen to user stats changes
  onUserStatsChange(userId: string, callback: (stats: UserStats | null) => void): () => void {
    const docRef = doc(db, COLLECTIONS.USER_STATS, userId);
    
    return onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        const stats: UserStats = {
          ...data,
          lastActivity: fromFirestoreTimestamp(data.lastActivity)
        } as UserStats;
        callback(stats);
      } else {
        callback(null);
      }
    });
  }
};

// Migration helpers for Discord bot data
export const migrationHelpers = {
  // Migrate Discord bot data to Firestore
  async migrateDiscordBotData(aktivniJizdy: Map<string, any>, dokonceneJizdy: Map<string, any[]>, userStats: Map<string, any>): Promise<void> {
    try {
      // Migrate active rides
      for (const [userId, rideData] of aktivniJizdy) {
        const ride: Omit<Ride, 'id'> = {
          trainNumber: rideData.trainNumber || '',
          route: rideData.route || '',
          departure: {
            station: rideData.departure?.station || '',
            time: new Date(rideData.departure?.time || Date.now())
          },
          arrival: {
            station: rideData.arrival?.station || '',
            time: new Date(rideData.arrival?.time || Date.now())
          },
          status: 'IN_PROGRESS',
          assignedUserId: userId,
          createdBy: 'discord-bot',
          createdAt: new Date(),
          updatedAt: new Date(),
          priority: 'NORMAL'
        };
        
        await rideOperations.create(ride);
      }

      // Migrate user stats
      for (const [userId, stats] of userStats) {
        const userStatsData: UserStats = {
          userId,
          points: stats.points || 0,
          level: stats.level || 1,
          streak: stats.streak || 0,
          totalRides: stats.totalRides || 0,
          completedRides: stats.completedRides || 0,
          averageRating: stats.averageRating || 0,
          lastActivity: new Date()
        };
        
        await userStatsOperations.create(userStatsData);
      }

      console.log('Discord bot data migration completed successfully');
    } catch (error) {
      console.error('Error migrating Discord bot data:', error);
      throw error;
    }
  }
};