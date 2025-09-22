'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { 
  UsersIcon, 
  TruckIcon,
  ChartBarIcon,
  CogIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { User, Ride, UserStats } from '@/types';
import { isAdmin, getRoleDisplayName, getRoleColor } from '@/lib/auth';

interface AdminStats {
  totalUsers: number;
  activeRides: number;
  completedToday: number;
  pendingAssignments: number;
}

export default function AdminPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      if (!isAdmin(session.user.roles)) {
        // Redirect non-admin users
        window.location.href = '/dashboard';
        return;
      }
      fetchAdminData();
    }
  }, [session]);

  const fetchAdminData = async () => {
    try {
      // Simulate API calls - replace with actual Firebase calls
      setStats({
        totalUsers: 24,
        activeRides: 8,
        completedToday: 15,
        pendingAssignments: 3
      });

      setUsers([
        {
          id: '1',
          discordId: '123456789',
          username: 'strojvudce1',
          discriminator: '1234',
          roles: ['STROJVUDCE'],
          createdAt: new Date('2024-01-15'),
          lastLogin: new Date('2024-12-22T10:30:00')
        },
        {
          id: '2',
          discordId: '987654321',
          username: 'vypravci1',
          discriminator: '5678',
          roles: ['VYPRAVCI', 'EMPLOYEE'],
          createdAt: new Date('2024-02-01'),
          lastLogin: new Date('2024-12-22T09:15:00')
        }
      ]);

      setRides([
        {
          id: '1',
          trainNumber: 'R 672',
          route: 'Praha hl.n. → Brno hl.n.',
          departure: { station: 'Praha hl.n.', time: new Date('2024-12-22T14:30:00') },
          arrival: { station: 'Brno hl.n.', time: new Date('2024-12-22T17:15:00') },
          status: 'PENDING',
          createdBy: 'dispatcher1',
          createdAt: new Date(),
          updatedAt: new Date(),
          priority: 'HIGH'
        },
        {
          id: '2',
          trainNumber: 'Os 7331',
          route: 'Brno hl.n. → Blansko',
          departure: { station: 'Brno hl.n.', time: new Date('2024-12-22T16:00:00') },
          arrival: { station: 'Blansko', time: new Date('2024-12-22T16:45:00') },
          status: 'ASSIGNED',
          assignedUserId: '1',
          createdBy: 'dispatcher1',
          createdAt: new Date(),
          updatedAt: new Date(),
          priority: 'NORMAL'
        }
      ]);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'text-yellow-600 bg-yellow-100';
      case 'ASSIGNED': return 'text-blue-600 bg-blue-100';
      case 'IN_PROGRESS': return 'text-green-600 bg-green-100';
      case 'COMPLETED': return 'text-gray-600 bg-gray-100';
      case 'CANCELLED': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'text-red-800 bg-red-200';
      case 'HIGH': return 'text-red-600 bg-red-100';
      case 'NORMAL': return 'text-blue-600 bg-blue-100';
      case 'LOW': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Přístup zamítnut
          </h2>
          <p className="text-gray-600">
            Přihlaste se pro přístup k admin panelu.
          </p>
        </div>
      </div>
    );
  }

  if (!isAdmin(session.user.roles)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Nedostatečná oprávnění
          </h2>
          <p className="text-gray-600">
            Pro přístup k admin panelu potřebujete admin roli.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <CogIcon className="h-8 w-8 mr-3" />
            Administrace
          </h1>
          <p className="text-gray-600 mt-2">
            Správa uživatelů, jízd a systémových nastavení
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UsersIcon className="h-8 w-8 text-blue-500" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Celkem uživatelů</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TruckIcon className="h-8 w-8 text-green-500" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Aktivní jízdy</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeRides}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircleIcon className="h-8 w-8 text-purple-500" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Dokončeno dnes</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.completedToday}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ClockIcon className="h-8 w-8 text-orange-500" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Čekající přiřazení</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingAssignments}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Users Management */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Správa uživatelů</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <div className="font-medium">{user.username}#{user.discriminator}</div>
                      <div className="text-sm text-gray-500">
                        {user.roles.map(role => (
                          <span key={role} className={`inline-block mr-2 ${getRoleColor(role)}`}>
                            {getRoleDisplayName(role)}
                          </span>
                        ))}
                      </div>
                      <div className="text-xs text-gray-400">
                        Poslední přihlášení: {user.lastLogin.toLocaleDateString('cs-CZ')}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                        Upravit
                      </button>
                      <button className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200">
                        Blokovat
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Rides Management */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Správa jízd</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {rides.map((ride) => (
                  <div key={ride.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold">{ride.trainNumber}</span>
                        <span className={`px-2 py-1 text-xs rounded ${getPriorityColor(ride.priority)}`}>
                          {ride.priority}
                        </span>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded ${getStatusColor(ride.status)}`}>
                        {ride.status}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-2">{ride.route}</div>
                    
                    <div className="text-xs text-gray-500">
                      {ride.departure.time.toLocaleString('cs-CZ')} - {ride.arrival.time.toLocaleString('cs-CZ')}
                    </div>
                    
                    <div className="flex space-x-2 mt-3">
                      <button className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200">
                        Přiřadit
                      </button>
                      <button className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                        Upravit
                      </button>
                      <button className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200">
                        Zrušit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}