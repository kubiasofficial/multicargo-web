'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { 
  TruckIcon,
  ClockIcon,
  MapPinIcon,
  FunnelIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  CalendarDaysIcon,
  ExclamationTriangleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { Ride, SimRailTrain } from '@/types';
import { getRoleDisplayName, isAdmin } from '@/lib/auth';
import { fetchAvailableTrains, filterTrains, getFormattedRoute } from '@/lib/simrailApi';
import { getTrainImage, getTrainTypeDescription } from '@/lib/trainImages';

interface RideFilters {
  status: string;
  priority: string;
  dateRange: string;
  search: string;
}

export default function RidesPage() {
  const { user, loading: authLoading } = useAuth();
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewRideModal, setShowNewRideModal] = useState(false);
  const [availableTrains, setAvailableTrains] = useState<SimRailTrain[]>([]);
  const [filteredTrains, setFilteredTrains] = useState<SimRailTrain[]>([]);
  const [trainSearchQuery, setTrainSearchQuery] = useState('');
  const [loadingTrains, setLoadingTrains] = useState(false);
  const [filters, setFilters] = useState<RideFilters>({
    status: 'all',
    priority: 'all',
    dateRange: 'today',
    search: ''
  });

  useEffect(() => {
    if (user) {
      fetchRides();
    }
  }, [user, filters]);

  const fetchRides = async () => {
    try {
      // TODO: Implement Firebase integration based on new data structure
      const mockRides: Ride[] = [];

      // Apply filters
      let filteredRides = mockRides;

      if (filters.status !== 'all') {
        filteredRides = filteredRides.filter(ride => ride.status === filters.status);
      }

      if (filters.priority !== 'all') {
        filteredRides = filteredRides.filter(ride => ride.priority === filters.priority);
      }

      if (filters.search) {
        filteredRides = filteredRides.filter(ride => 
          ride.trainNumber.toLowerCase().includes(filters.search.toLowerCase()) ||
          ride.route.toLowerCase().includes(filters.search.toLowerCase())
        );
      }

      setRides(filteredRides);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching rides:', error);
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'text-yellow-400 bg-yellow-900/30 border-yellow-700';
      case 'ASSIGNED': return 'text-blue-400 bg-blue-900/30 border-blue-700';
      case 'IN_PROGRESS': return 'text-green-400 bg-green-900/30 border-green-700';
      case 'COMPLETED': return 'text-gray-400 bg-gray-700/30 border-gray-600';
      case 'CANCELLED': return 'text-red-400 bg-red-900/30 border-red-700';
      default: return 'text-gray-400 bg-gray-700/30 border-gray-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'text-red-200 bg-red-900/50 border-red-700 shadow-red-500/30';
      case 'HIGH': return 'text-red-300 bg-red-900/30 border-red-700 shadow-red-500/20';
      case 'NORMAL': return 'text-blue-300 bg-blue-900/30 border-blue-700 shadow-blue-500/20';
      case 'LOW': return 'text-gray-300 bg-gray-700/30 border-gray-600';
      default: return 'text-gray-300 bg-gray-700/30 border-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Čeká na přiřazení';
      case 'ASSIGNED': return 'Přiřazeno';
      case 'IN_PROGRESS': return 'Probíhá';
      case 'COMPLETED': return 'Dokončeno';
      case 'CANCELLED': return 'Zrušeno';
      default: return status;
    }
  };

  const canTakeRide = (ride: Ride) => {
    return ride.status === 'PENDING' && user?.roles.some(role => 
      ['STROJVUDCE', 'ADMIN'].includes(role)
    );
  };

  const handleNewRide = async () => {
    setShowNewRideModal(true);
    setLoadingTrains(true);
    
    try {
      const trains = await fetchAvailableTrains();
      setAvailableTrains(trains);
      setFilteredTrains(trains);
    } catch (error) {
      console.error('Error loading trains:', error);
    } finally {
      setLoadingTrains(false);
    }
  };

  const handleTrainSearch = (query: string) => {
    setTrainSearchQuery(query);
    const filtered = filterTrains(availableTrains, query);
    setFilteredTrains(filtered);
  };

  const handleTakeRide = async (train: SimRailTrain) => {
    try {
      // TODO: Implement actual ride assignment logic
      console.log('Taking ride for train:', train.trainNumber);
      setShowNewRideModal(false);
      
      // Create new active ride
      // This will be implemented with Firebase
      
    } catch (error) {
      console.error('Error taking ride:', error);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-400"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Přístup zamítnut
          </h2>
          <p className="text-gray-300">
            Přihlaste se pro přístup k jízdám.
          </p>
        </div>
      </div>
    );
  }

  // Check if user has STROJVEDOUCÍ role
  const hasDriverRole = user.roles.some(role => 
    ['STROJVEDOUCÍ', 'ADMIN'].includes(role)
  );

  if (!hasDriverRole) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">
            Přístup zamítnut
          </h2>
          <p className="text-gray-300 mb-2">
            Pouze uživatelé s rolí <span className="text-blue-400 font-semibold">STROJVEDOUCÍ</span> mají přístup k této stránce.
          </p>
          <p className="text-gray-500 text-sm">
            Vaše role: {user.roles.map(role => getRoleDisplayName(role as any)).join(', ')}
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center">
                <TruckIcon className="h-8 w-8 mr-3" />
                Jízdy
              </h1>
              <p className="text-gray-300 mt-2">
                Správa a přehled všech jízd v systému
              </p>
            </div>
            
            {(user.roles.some(role => ['STROJVEDOUCÍ', 'ADMIN'].includes(role))) && (
              <button 
                onClick={handleNewRide}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 shadow-lg shadow-indigo-500/20"
              >
                <PlusIcon className="h-5 w-5" />
                <span>Nová jízda</span>
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg shadow-purple-500/20 p-6 mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <FunnelIcon className="h-5 w-5 text-purple-400" />
            <h2 className="text-lg font-medium text-white">Filtry</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Hledat vlak nebo trasu..."
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>

            {/* Status Filter */}
            <select
              className="bg-gray-700 border border-gray-600 rounded-lg text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="all">Všechny stavy</option>
              <option value="PENDING">Čeká na přiřazení</option>
              <option value="ASSIGNED">Přiřazeno</option>
              <option value="IN_PROGRESS">Probíhá</option>
              <option value="COMPLETED">Dokončeno</option>
              <option value="CANCELLED">Zrušeno</option>
            </select>

            {/* Priority Filter */}
            <select
              className="bg-gray-700 border border-gray-600 rounded-lg text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={filters.priority}
              onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
            >
              <option value="all">Všechny priority</option>
              <option value="URGENT">Naléhavé</option>
              <option value="HIGH">Vysoká</option>
              <option value="NORMAL">Normální</option>
              <option value="LOW">Nízká</option>
            </select>

            {/* Date Range Filter */}
            <select
              className="bg-gray-700 border border-gray-600 rounded-lg text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={filters.dateRange}
              onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
            >
              <option value="today">Dnes</option>
              <option value="week">Tento týden</option>
              <option value="month">Tento měsíc</option>
              <option value="all">Všechny</option>
            </select>
          </div>
        </div>

        {/* Rides List */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg shadow-cyan-500/20">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-lg font-medium text-white">
              Nalezeno {rides.length} jízd
            </h2>
          </div>
          
          <div className="p-6">
            {rides.length > 0 ? (
              <div className="space-y-4">
                {rides.map((ride) => (
                  <div key={ride.id} className="border border-gray-600 rounded-lg p-6 bg-gradient-to-r from-gray-800 to-gray-750 shadow-lg shadow-blue-500/10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="text-xl font-bold text-white">{ride.trainNumber}</h3>
                          <p className="text-gray-300">{ride.route}</p>
                        </div>
                        
                        <div className="flex space-x-2">
                          <span className={`px-3 py-1 text-xs rounded-full border shadow-lg ${getPriorityColor(ride.priority)}`}>
                            {ride.priority}
                          </span>
                          <span className={`px-3 py-1 text-xs rounded-full border ${getStatusColor(ride.status)}`}>
                            {getStatusText(ride.status)}
                          </span>
                        </div>
                      </div>

                      {canTakeRide(ride) && (
                        <button
                          onClick={() => {
                            // TODO: Convert ride to SimRail train format
                            console.log('Taking existing ride:', ride.id);
                          }}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors shadow-lg shadow-green-500/20"
                        >
                          Převzít jízdu
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-gray-700 p-3 rounded-lg border border-gray-600">
                        <div className="flex items-center text-gray-400 mb-1">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          <span className="text-sm">Odjezd</span>
                        </div>
                        <div className="text-white font-medium">
                          {ride.departure.time.toLocaleString('cs-CZ')}
                        </div>
                        <div className="text-sm text-gray-400">{ride.departure.station}</div>
                      </div>

                      <div className="bg-gray-700 p-3 rounded-lg border border-gray-600">
                        <div className="flex items-center text-gray-400 mb-1">
                          <MapPinIcon className="h-4 w-4 mr-1" />
                          <span className="text-sm">Příjezd</span>
                        </div>
                        <div className="text-white font-medium">
                          {ride.arrival.time.toLocaleString('cs-CZ')}
                        </div>
                        <div className="text-sm text-gray-400">{ride.arrival.station}</div>
                      </div>

                      <div className="bg-gray-700 p-3 rounded-lg border border-gray-600">
                        <div className="flex items-center text-gray-400 mb-1">
                          <CalendarDaysIcon className="h-4 w-4 mr-1" />
                          <span className="text-sm">Doba jízdy</span>
                        </div>
                        <div className="text-white font-medium">
                          {Math.round((ride.arrival.time.getTime() - ride.departure.time.getTime()) / 60000)} min
                        </div>
                        <div className="text-sm text-gray-400">
                          {ride.assignedUserId ? 'Přiřazeno' : 'Volné'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div>
                        Vytvořeno: {ride.createdAt.toLocaleDateString('cs-CZ')} od {ride.createdBy}
                      </div>
                      <div>
                        Aktualizováno: {ride.updatedAt.toLocaleDateString('cs-CZ')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <TruckIcon className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-400 mb-2">Žádné jízdy nenalezeny</h3>
                <p className="text-gray-500">
                  Zkuste změnit filtry nebo se vraťte později.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* New Ride Modal */}
        {showNewRideModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-2xl shadow-indigo-500/20 max-w-4xl w-full max-h-[90vh] overflow-hidden">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <TruckIcon className="h-6 w-6 mr-2" />
                  Vyberte vlak ze SimRail serveru CZ1
                </h2>
                <button
                  onClick={() => setShowNewRideModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Search Bar */}
              <div className="p-6 border-b border-gray-700">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Hledat podle čísla vlaku nebo trasy..."
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={trainSearchQuery}
                    onChange={(e) => handleTrainSearch(e.target.value)}
                  />
                </div>
              </div>

              {/* Trains List */}
              <div className="p-6 max-h-96 overflow-y-auto">
                {loadingTrains ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400"></div>
                    <span className="ml-3 text-white">Načítám vlaky ze SimRail...</span>
                  </div>
                ) : filteredTrains.length > 0 ? (
                  <div className="space-y-4">
                    {filteredTrains.map((train) => (
                      <div key={train.id} className="border border-gray-600 rounded-lg p-4 bg-gradient-to-r from-gray-800 to-gray-750 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 transition-all">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            {/* Train Image */}
                            <div className="w-16 h-16 bg-gray-700 rounded-lg overflow-hidden border border-gray-600">
                              <img
                                src={getTrainImage(train.trainNumber, train.type)}
                                alt={train.trainNumber}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://wiki.simrail.eu/vehicles_logo.png';
                                }}
                              />
                            </div>

                            {/* Train Info */}
                            <div>
                              <h3 className="text-lg font-bold text-white">{train.trainNumber}</h3>
                              <p className="text-gray-300">{getFormattedRoute(train)}</p>
                              <p className="text-sm text-gray-400">{getTrainTypeDescription(train.type)}</p>
                            </div>
                          </div>

                          {/* Take Ride Button */}
                          <button
                            onClick={() => handleTakeRide(train)}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2 shadow-lg shadow-green-500/20"
                          >
                            <span>Převzít</span>
                          </button>
                        </div>

                        {/* Additional Info */}
                        <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Výchozí stanice:</span>
                            <span className="text-white ml-2">{train.startStation}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Cílová stanice:</span>
                            <span className="text-white ml-2">{train.endStation}</span>
                          </div>
                          {train.currentStation && (
                            <div>
                              <span className="text-gray-400">Aktuální pozice:</span>
                              <span className="text-white ml-2">{train.currentStation}</span>
                            </div>
                          )}
                          {train.speed && (
                            <div>
                              <span className="text-gray-400">Rychlost:</span>
                              <span className="text-white ml-2">{train.speed} km/h</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <TruckIcon className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-400 mb-2">
                      {trainSearchQuery ? 'Žádné vlaky nenalezeny' : 'Žádné dostupné vlaky'}
                    </h3>
                    <p className="text-gray-500">
                      {trainSearchQuery 
                        ? 'Zkuste změnit vyhledávací dotaz.'
                        : 'Aktuálně nejsou na serveru CZ1 dostupné žádné vlaky.'
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}