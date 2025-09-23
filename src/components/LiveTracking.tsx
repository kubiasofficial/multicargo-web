'use client';

import { useState, useEffect } from 'react';
import { useActiveRide } from '@/contexts/ActiveRideContext';
import { 
  MapPinIcon, 
  ClockIcon, 
  SignalIcon,
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';
import { LiveTrackingData } from '@/types';
import { getTrainPosition, calculateTrainDelay, findStationByCoordinates } from '@/lib/simrailApi';

export default function LiveTracking() {
  const { activeRide } = useActiveRide();
  const [trackingData, setTrackingData] = useState<LiveTrackingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    fetchLiveData();
    
    // Update every 30 seconds 
    const interval = setInterval(fetchLiveData, 30000);
    
    return () => clearInterval(interval);
  }, [activeRide]); // Update when activeRide changes

  const fetchLiveData = async () => {
    try {
      if (!activeRide) {
        setTrackingData([]);
        setLastUpdate(new Date());
        setLoading(false);
        return;
      }

      // Get real-time position data from SimRail API
      const position = await getTrainPosition(activeRide.trainNumber);
      const delay = await calculateTrainDelay(activeRide.trainNumber);
      
      let currentStationName = 'Načítání pozice...';
      let coordinates = { latitude: 0, longitude: 0 };
      
      if (position) {
        // Use the station name from position if available
        currentStationName = position.currentStation || 'Neznámá stanice';
        
        // Set coordinates if available
        if (position.lat && position.lng) {
          coordinates = {
            latitude: position.lat,
            longitude: position.lng
          };
          
          // If no station name but we have coordinates, try to resolve
          if (!position.currentStation) {
            const resolvedStation = await findStationByCoordinates(position.lat, position.lng);
            if (resolvedStation) {
              currentStationName = resolvedStation;
            } else {
              currentStationName = `GPS: ${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}`;
            }
          }
        }
      }

      const liveData: LiveTrackingData[] = [{
        rideId: activeRide.id,
        userId: activeRide.userId,
        currentLocation: {
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          station: currentStationName
        },
        progress: {
          current: Math.round((activeRide.progress || 0) * 100) / 100, // Real progress
          total: 100,
          percentage: activeRide.progress || 0
        },
        delays: delay || activeRide.delay || 0,
        actualDeparture: activeRide.startTime,
        estimatedArrival: activeRide.estimatedArrival || new Date(),
        lastUpdate: new Date()
      }];
      
      setTrackingData(liveData);
      setLastUpdate(new Date());
      setLoading(false);
    } catch (error) {
      console.error('Error fetching live tracking data:', error);
      
      // Fallback to activeRide data if API fails
      if (activeRide) {
        const fallbackData: LiveTrackingData[] = [{
          rideId: activeRide.id,
          userId: activeRide.userId,
          currentLocation: {
            latitude: 0,
            longitude: 0,
            station: activeRide.currentStation || 'Chyba načítání pozice'
          },
          progress: {
            current: activeRide.progress || 0,
            total: 100,
            percentage: activeRide.progress || 0
          },
          delays: activeRide.delay || 0,
          actualDeparture: activeRide.startTime,
          estimatedArrival: activeRide.estimatedArrival || new Date(),
          lastUpdate: new Date()
        }];
        
        setTrackingData(fallbackData);
      }
      
      setLoading(false);
    }
  };

  const getStatusColor = (delays: number) => {
    if (delays === 0) return 'text-green-400';
    if (delays <= 5) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getStatusText = (delays: number) => {
    if (delays === 0) return 'Včas';
    if (delays <= 5) return `Zpoždění ${delays} min`;
    return `Velké zpoždění ${delays} min`;
  };

  if (loading) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg shadow-blue-500/20">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-lg font-medium text-white flex items-center">
            <SignalIcon className="h-5 w-5 mr-2 text-blue-400" />
            Live Tracking
          </h2>
        </div>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            <div className="h-4 bg-gray-700 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg shadow-blue-500/20">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-white flex items-center">
            <SignalIcon className="h-5 w-5 mr-2 text-blue-400 animate-pulse" />
            Live Tracking
          </h2>
          {lastUpdate && (
            <div className="text-xs text-gray-400">
              Aktualizováno: {lastUpdate.toLocaleTimeString('cs-CZ')}
            </div>
          )}
        </div>
      </div>
      
      <div className="p-6">
        {trackingData.length > 0 ? (
          <div className="space-y-6">
            {trackingData.map((data) => (
              <div key={data.rideId} className="border border-gray-600 rounded-lg p-4 bg-gradient-to-r from-gray-800 to-gray-750 shadow-lg shadow-green-500/10">
                {/* Current location */}
                <div className="flex items-center space-x-2 mb-3">
                  <MapPinIcon className="h-5 w-5 text-green-400 animate-pulse" />
                  <span className="font-medium text-white">
                    {data.currentLocation?.station || 'Neznámá poloha'}
                  </span>
                  <span className={`text-sm font-medium ${getStatusColor(data.delays)}`}>
                    {getStatusText(data.delays)}
                  </span>
                </div>
                
                {/* Progress bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-sm text-gray-400 mb-1">
                    <span>Postup cesty</span>
                    <span>{data.progress.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2 shadow-inner">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full transition-all duration-500 shadow-lg shadow-blue-500/50" 
                      style={{ width: `${data.progress.percentage}%` }}
                    ></div>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {data.progress.current} / {data.progress.total} km
                  </div>
                </div>
                
                {/* Time information */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {data.actualDeparture && (
                    <div className="bg-gray-700 p-3 rounded-lg border border-gray-600">
                      <div className="text-gray-400">Odjezd</div>
                      <div className="font-medium text-white">
                        {data.actualDeparture.toLocaleTimeString('cs-CZ', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  )}
                  
                  {data.estimatedArrival && (
                    <div className="bg-gray-700 p-3 rounded-lg border border-gray-600">
                      <div className="text-gray-400">Očekávaný příjezd</div>
                      <div className="font-medium text-white">
                        {data.estimatedArrival.toLocaleTimeString('cs-CZ', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Alert for significant delays */}
                {data.delays > 10 && (
                  <div className="mt-3 flex items-center space-x-2 text-red-200 bg-red-900/30 border border-red-700 p-2 rounded shadow-lg shadow-red-500/20">
                    <ExclamationTriangleIcon className="h-4 w-4 animate-pulse" />
                    <span className="text-sm">
                      Významné zpoždění! Kontaktujte dispečink.
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <SignalIcon className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">Žádné aktivní sledování</p>
            <p className="text-sm text-gray-500 mt-2">
              Live tracking se zobrazí při aktivních jízdách
            </p>
          </div>
        )}
        
        {/* Auto-refresh indicator */}
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex items-center justify-center text-xs text-gray-400">
            <div className="animate-pulse h-2 w-2 bg-green-400 rounded-full mr-2 shadow-lg shadow-green-400/50"></div>
            Automatická aktualizace každých 30 sekund
          </div>
        </div>
      </div>
    </div>
  );
}