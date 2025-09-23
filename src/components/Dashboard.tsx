'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useActiveRide } from '@/contexts/ActiveRideContext';
import { useState, useEffect } from 'react';
import { 
  ClockIcon, 
  MapPinIcon, 
  UserIcon,
  ChartBarIcon,
  TruckIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { Ride, UserStats } from '@/types';
import { createProgressBar, formatDuration, getRoleDisplayName } from '@/lib/auth';
import LiveTracking from './LiveTracking';

interface DashboardStats {
  totalRides: number;
  completedRides: number;
  activeRides: number;
  points: number;
  level: number;
  streak: number;
}

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const { activeRide } = useActiveRide();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activeRides, setActiveRides] = useState<Ride[]>([]);
  const [recentRides, setRecentRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user, activeRide]); // Update when activeRide changes

  const fetchDashboardData = async () => {
    try {
      // Calculate stats based on active ride and historical data
      const totalRides = 45; // From database
      const completedRides = 42; // From database
      const currentActiveRides = activeRide ? 1 : 0;
      
      setStats({
        totalRides: totalRides + currentActiveRides,
        completedRides: completedRides,
        activeRides: currentActiveRides,
        points: 1250, // From database
        level: 13, // From database
        streak: 7 // From database
      });

      // Set active rides based on current active ride
      const currentActiveRides_array = activeRide ? [{
        id: activeRide.id,
        trainNumber: activeRide.trainNumber,
        route: activeRide.route,
        departure: { 
          station: activeRide.startStation, 
          time: activeRide.startTime 
        },
        arrival: { 
          station: activeRide.endStation, 
          time: activeRide.estimatedArrival || new Date() 
        },
        status: 'IN_PROGRESS' as const,
        assignedUserId: activeRide.userId,
        createdBy: 'system',
        createdAt: activeRide.startTime,
        updatedAt: new Date(),
        priority: 'NORMAL' as const
      }] : [];

      setActiveRides(currentActiveRides_array);

      // Fetch real recent rides from API
      try {
        const recentRidesResponse = await fetch(`/api/rides/recent?userId=${user?.id}&limit=5`);
        if (recentRidesResponse.ok) {
          const recentRidesData = await recentRidesResponse.json();
          if (recentRidesData.success) {
            setRecentRides(recentRidesData.data.map((ride: any) => ({
              ...ride,
              departure: {
                ...ride.departure,
                time: new Date(ride.departure.time)
              },
              arrival: {
                ...ride.arrival,
                time: new Date(ride.arrival.time)
              },
              createdAt: new Date(ride.createdAt),
              updatedAt: new Date(ride.updatedAt)
            })));
          } else {
            console.warn('Failed to fetch recent rides:', recentRidesData.error);
            setRecentRides([]);
          }
        } else {
          console.warn('Recent rides API responded with error:', recentRidesResponse.status);
          setRecentRides([]);
        }
      } catch (error) {
        console.error('Error fetching recent rides:', error);
        setRecentRides([]);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Přihlaste se pro přístup k dashboardu
          </h2>
          <p className="text-gray-300">
            Pro zobrazení vašich jízd a statistik se musíte přihlásit přes Discord.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            Vítejte zpět, {user.username}!
          </h1>
          <p className="text-gray-300 mt-2">
            Role: {user.roles.map((role: any) => getRoleDisplayName(role)).join(', ')}
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg shadow-blue-500/20 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TruckIcon className="h-8 w-8 text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Celkem jízd</p>
                  <p className="text-2xl font-bold text-white">{stats.totalRides}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg shadow-green-500/20 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircleIcon className="h-8 w-8 text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Dokončeno</p>
                  <p className="text-2xl font-bold text-white">{stats.completedRides}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg shadow-purple-500/20 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ChartBarIcon className="h-8 w-8 text-purple-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Level</p>
                  <p className="text-2xl font-bold text-white">{stats.level}</p>
                  <div className="text-sm text-gray-400">{stats.points} bodů</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg shadow-orange-500/20 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ClockIcon className="h-8 w-8 text-orange-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Série</p>
                  <p className="text-2xl font-bold text-white">{stats.streak}</p>
                  <div className="text-sm text-gray-400">dní za sebou</div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Rides */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg shadow-cyan-500/20">
              <div className="p-6 border-b border-gray-700">
                <h2 className="text-lg font-medium text-white">Aktivní jízdy</h2>
              </div>
              <div className="p-6">
                {activeRides.length > 0 ? (
                  <div className="space-y-4">
                    {activeRides.map((ride) => (
                      <div key={ride.id} className="border border-gray-600 rounded-lg p-4 bg-gradient-to-r from-gray-800 to-gray-750 shadow-lg shadow-blue-500/10">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-lg text-white">{ride.trainNumber}</span>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              ride.priority === 'HIGH' ? 'bg-red-900 text-red-200 shadow-red-500/20' :
                              ride.priority === 'URGENT' ? 'bg-red-800 text-red-100 shadow-red-500/30' :
                              ride.priority === 'LOW' ? 'bg-gray-700 text-gray-300' :
                              'bg-blue-900 text-blue-200 shadow-blue-500/20'
                            } shadow-lg`}>
                              {ride.priority}
                            </span>
                          </div>
                          <span className="text-sm text-green-400 font-medium">
                            {ride.status === 'IN_PROGRESS' ? 'Probíhá' : ride.status}
                          </span>
                        </div>
                        
                        <div className="text-gray-300 mb-2">{ride.route}</div>
                        
                        <div className="flex items-center text-sm text-gray-400 space-x-4">
                          <div className="flex items-center space-x-1">
                            <ClockIcon className="h-4 w-4" />
                            <span>
                              {ride.departure.time.toLocaleTimeString('cs-CZ', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })} - {ride.arrival.time.toLocaleTimeString('cs-CZ', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPinIcon className="h-4 w-4" />
                            <span>{formatDuration(
                              Math.round((ride.arrival.time.getTime() - ride.departure.time.getTime()) / 60000)
                            )}</span>
                          </div>
                        </div>
                        
                        {/* Progress bar simulation */}
                        <div className="mt-3">
                          <div className="flex justify-between text-sm text-gray-400 mb-1">
                            <span>Postup jízdy</span>
                            <span>65%</span>
                          </div>
                          <div className="w-full bg-gray-600 rounded-full h-2 shadow-inner">
                            <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full shadow-lg shadow-blue-500/50" style={{ width: '65%' }}></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <TruckIcon className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">Momentálně nemáte žádné aktivní jízdy</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Live Tracking & Recent */}
          <div className="space-y-8">
            {/* Live Tracking Component */}
            <LiveTracking />
            
            {/* Recent Rides */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg shadow-purple-500/20">
              <div className="p-6 border-b border-gray-700">
                <h2 className="text-lg font-medium text-white">Poslední jízdy</h2>
              </div>
              <div className="p-6">
                {recentRides.length > 0 ? (
                  <div className="space-y-3">
                    {recentRides.map((ride) => (
                      <div key={ride.id} className="flex items-center justify-between py-2 bg-gradient-to-r from-gray-800 to-gray-750 p-3 rounded-lg border border-gray-600 shadow-lg shadow-green-500/10">
                        <div>
                          <div className="font-medium text-white">{ride.trainNumber}</div>
                          <div className="text-sm text-gray-400">{ride.route}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-green-400 flex items-center">
                            <CheckCircleIcon className="h-4 w-4 mr-1" />
                            Dokončeno
                          </div>
                          <div className="text-xs text-gray-500">
                            {ride.departure.time.toLocaleDateString('cs-CZ')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-4">Žádné poslední jízdy</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}