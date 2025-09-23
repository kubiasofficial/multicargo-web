'use client';

import { useAuth } from '@/contexts/AuthContext';
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
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activeRides, setActiveRides] = useState<Ride[]>([]);
  const [recentRides, setRecentRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Simulate API calls - replace with actual Firebase calls
      setStats({
        totalRides: 45,
        completedRides: 42,
        activeRides: 3,
        points: 1250,
        level: 13,
        streak: 7
      });

      setActiveRides([
        {
          id: '1',
          trainNumber: 'R 672',
          route: 'Praha hl.n. → Brno hl.n.',
          departure: { station: 'Praha hl.n.', time: new Date('2024-12-22T14:30:00') },
          arrival: { station: 'Brno hl.n.', time: new Date('2024-12-22T17:15:00') },
          status: 'IN_PROGRESS',
          assignedUserId: user?.id || '',
          createdBy: 'dispatcher1',
          createdAt: new Date(),
          updatedAt: new Date(),
          priority: 'NORMAL'
        }
      ]);

      setRecentRides([
        {
          id: '2',
          trainNumber: 'Os 7331',
          route: 'Brno hl.n. → Blansko',
          departure: { station: 'Brno hl.n.', time: new Date('2024-12-22T12:00:00') },
          arrival: { station: 'Blansko', time: new Date('2024-12-22T12:45:00') },
          status: 'COMPLETED',
          assignedUserId: user?.id || '',
          createdBy: 'dispatcher1',
          createdAt: new Date(),
          updatedAt: new Date(),
          priority: 'LOW'
        }
      ]);

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
            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow p-6">
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

            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow p-6">
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

            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow p-6">
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

            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow p-6">
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
            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow">
              <div className="p-6 border-b border-gray-700">
                <h2 className="text-lg font-medium text-white">Aktivní jízdy</h2>
              </div>
              <div className="p-6">
                {activeRides.length > 0 ? (
                  <div className="space-y-4">
                    {activeRides.map((ride) => (
                      <div key={ride.id} className="border border-gray-600 rounded-lg p-4 bg-gray-750">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-lg text-white">{ride.trainNumber}</span>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              ride.priority === 'HIGH' ? 'bg-red-900 text-red-200' :
                              ride.priority === 'URGENT' ? 'bg-red-800 text-red-100' :
                              ride.priority === 'LOW' ? 'bg-gray-700 text-gray-300' :
                              'bg-blue-900 text-blue-200'
                            }`}>
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
                          <div className="w-full bg-gray-600 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
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
            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow">
              <div className="p-6 border-b border-gray-700">
                <h2 className="text-lg font-medium text-white">Poslední jízdy</h2>
              </div>
              <div className="p-6">
                {recentRides.length > 0 ? (
                  <div className="space-y-3">
                    {recentRides.map((ride) => (
                      <div key={ride.id} className="flex items-center justify-between py-2">
                        <div>
                          <div className="font-medium text-white">{ride.trainNumber}</div>
                          <div className="text-sm text-gray-400">{ride.route}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-green-400">Dokončeno</div>
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