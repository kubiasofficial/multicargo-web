'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ActiveRide, SimRailTrain } from '@/types';
import { useAuth } from './AuthContext';
import { sendRideStartNotification } from '@/lib/discord';
import { getTrainImage } from '@/lib/trainImages';
import { getTrainPosition, calculateTrainDelay } from '@/lib/simrailApi';

interface ActiveRideContextType {
  activeRide: ActiveRide | null;
  startRide: (train: SimRailTrain) => Promise<void>;
  endRide: () => Promise<void>;
  updateRideData: (data: Partial<ActiveRide>) => void;
  minimizeRide: () => void;
}

const ActiveRideContext = createContext<ActiveRideContextType | undefined>(undefined);

export function ActiveRideProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [activeRide, setActiveRide] = useState<ActiveRide | null>(null);

  // Load active ride from localStorage on mount
  useEffect(() => {
    const savedRide = localStorage.getItem('activeRide');
    if (savedRide && user) {
      try {
        const ride = JSON.parse(savedRide);
        // Convert date strings back to Date objects
        ride.startTime = new Date(ride.startTime);
        if (ride.estimatedArrival) {
          ride.estimatedArrival = new Date(ride.estimatedArrival);
        }
        if (ride.actualArrival) {
          ride.actualArrival = new Date(ride.actualArrival);
        }
        
        // Verify the ride belongs to current user
        if (ride.userId === user.id) {
          setActiveRide(ride);
        }
      } catch (error) {
        console.error('Error loading saved ride:', error);
        localStorage.removeItem('activeRide');
      }
    }
  }, [user]);

  // Save active ride to localStorage whenever it changes
  useEffect(() => {
    if (activeRide) {
      localStorage.setItem('activeRide', JSON.stringify(activeRide));
    } else {
      localStorage.removeItem('activeRide');
    }
  }, [activeRide]);

  // Real-time updates for active ride
  useEffect(() => {
    if (!activeRide || activeRide.status !== 'ACTIVE') {
      return;
    }

    const updateRealTimeData = async () => {
      try {
        const position = await getTrainPosition(activeRide.trainNumber);
        const delay = await calculateTrainDelay(activeRide.trainNumber);
        
        if (position) {
          setActiveRide(prev => prev ? {
            ...prev,
            currentStation: position.currentStation || prev.currentStation,
            nextStation: position.nextStation || prev.nextStation,
            delay: delay,
            progress: position.progress || prev.progress
          } : null);
        }
      } catch (error) {
        console.error('Error updating real-time data:', error);
      }
    };

    // Initial update
    updateRealTimeData();

    // Set up interval for updates every 30 seconds
    const interval = setInterval(updateRealTimeData, 30000);

    return () => clearInterval(interval);
  }, [activeRide?.trainNumber, activeRide?.status]);

  const startRide = async (train: SimRailTrain): Promise<void> => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    if (activeRide) {
      throw new Error('Another ride is already active');
    }

    const newRide: ActiveRide = {
      id: `ride_${Date.now()}`,
      trainId: train.id,
      trainNumber: train.trainNumber,
      route: `${train.startStation} → ${train.endStation}`,
      startStation: train.startStation,
      endStation: train.endStation,
      userId: user.id,
      userName: user.username,
      startTime: new Date(),
      currentStation: train.currentStation,
      nextStation: train.nextStation,
      delay: 0,
      progress: 0,
      status: 'ACTIVE',
      isMinimized: false
    };

    setActiveRide(newRide);

    // Update user statistics
    try {
      await fetch('/api/user/stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user.id,
          action: 'START_RIDE'
        })
      });
    } catch (error) {
      console.error('Error updating user stats:', error);
    }

    // Send Discord notification
    try {
      await sendRideStartNotification(
        newRide.userName,
        newRide.trainNumber,
        newRide.route,
        getTrainImage(newRide.trainNumber)
      );
    } catch (error) {
      console.error('Error sending Discord notification:', error);
    }

    // TODO: Save to Firebase
    console.log('Started new ride:', newRide);
  };

  const endRide = async (): Promise<void> => {
    if (!activeRide) {
      return;
    }

    const endTime = new Date();
    const duration = Math.floor((endTime.getTime() - activeRide.startTime.getTime()) / 1000 / 60); // minutes

    // Update ride status to completed
    const completedRide = { 
      ...activeRide, 
      status: 'COMPLETED' as const, 
      actualArrival: endTime 
    };
    setActiveRide(completedRide);

    // Update user statistics
    try {
      await fetch('/api/user/stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: activeRide.userId,
          action: 'COMPLETE_RIDE',
          data: {
            delay: activeRide.delay || 0,
            duration: duration
          }
        })
      });
    } catch (error) {
      console.error('Error updating user stats:', error);
    }

    // Save completed ride to recent rides
    try {
      const recentRideData = {
        trainNumber: activeRide.trainNumber,
        route: activeRide.route,
        departure: { 
          station: activeRide.startStation, 
          time: activeRide.startTime.toISOString() 
        },
        arrival: { 
          station: activeRide.endStation, 
          time: endTime.toISOString() 
        },
        status: 'COMPLETED',
        assignedUserId: activeRide.userId,
        createdBy: 'system',
        createdAt: activeRide.startTime.toISOString(),
        priority: 'NORMAL',
        actualDuration: duration,
        finalDelay: activeRide.delay || 0
      };

      const response = await fetch('/api/rides/recent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(recentRideData)
      });

      if (response.ok) {
        console.log('✅ Completed ride saved to recent rides');
      } else {
        console.warn('⚠️ Failed to save completed ride to recent rides');
      }
    } catch (error) {
      console.error('❌ Error saving completed ride:', error);
    }

    // TODO: Save final ride data to Firebase
    // TODO: Update user statistics

    // Clear active ride after a short delay to show completion status
    setTimeout(() => {
      setActiveRide(null);
    }, 2000);

    console.log('Ended ride:', activeRide.id);
  };

  const updateRideData = (data: Partial<ActiveRide>) => {
    setActiveRide(prev => prev ? { ...prev, ...data } : null);
  };

  const minimizeRide = () => {
    setActiveRide(prev => prev ? { ...prev, isMinimized: !prev.isMinimized } : null);
  };

  return (
    <ActiveRideContext.Provider value={{
      activeRide,
      startRide,
      endRide,
      updateRideData,
      minimizeRide
    }}>
      {children}
    </ActiveRideContext.Provider>
  );
}

export function useActiveRide() {
  const context = useContext(ActiveRideContext);
  if (context === undefined) {
    throw new Error('useActiveRide must be used within an ActiveRideProvider');
  }
  return context;
}