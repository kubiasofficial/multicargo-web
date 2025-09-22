'use client';

import { useState, useEffect } from 'react';
import { 
  MapPinIcon, 
  ClockIcon, 
  SignalIcon,
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';
import { LiveTrackingData } from '@/types';
import { createProgressBar, formatDuration } from '@/lib/auth';

export default function LiveTracking() {
  const [trackingData, setTrackingData] = useState<LiveTrackingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    fetchLiveData();
    
    // Update every 30 seconds (real Discord bot updates every 5 minutes)
    const interval = setInterval(fetchLiveData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchLiveData = async () => {
    try {
      // Simulate live tracking data - replace with actual Firebase real-time listener
      const mockData: LiveTrackingData[] = [
        {
          rideId: '1',
          userId: 'user1',
          currentLocation: {
            latitude: 49.2,
            longitude: 16.6,
            station: 'Brno-Královo Pole'
          },
          progress: {
            current: 65,
            total: 100,
            percentage: 65
          },
          estimatedArrival: new Date(Date.now() + 45 * 60000), // 45 minutes from now
          actualDeparture: new Date(Date.now() - 90 * 60000), // 90 minutes ago
          delays: 5, // 5 minutes delay
          lastUpdate: new Date()
        }
      ];
      
      setTrackingData(mockData);
      setLastUpdate(new Date());
      setLoading(false);
    } catch (error) {
      console.error('Error fetching live tracking data:', error);
      setLoading(false);
    }
  };

  const getStatusColor = (delays: number) => {
    if (delays === 0) return 'text-green-500';
    if (delays <= 5) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getStatusText = (delays: number) => {
    if (delays === 0) return 'Včas';
    if (delays <= 5) return `Zpoždění ${delays} min`;
    return `Velké zpoždění ${delays} min`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 flex items-center">
            <SignalIcon className="h-5 w-5 mr-2" />
            Live Tracking
          </h2>
        </div>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900 flex items-center">
            <SignalIcon className="h-5 w-5 mr-2" />
            Live Tracking
          </h2>
          {lastUpdate && (
            <div className="text-xs text-gray-500">
              Aktualizováno: {lastUpdate.toLocaleTimeString('cs-CZ')}
            </div>
          )}
        </div>
      </div>
      
      <div className="p-6">
        {trackingData.length > 0 ? (
          <div className="space-y-6">
            {trackingData.map((data) => (
              <div key={data.rideId} className="border border-gray-200 rounded-lg p-4">
                {/* Current location */}
                <div className="flex items-center space-x-2 mb-3">
                  <MapPinIcon className="h-5 w-5 text-blue-500" />
                  <span className="font-medium">
                    {data.currentLocation?.station || 'Neznámá poloha'}
                  </span>
                  <span className={`text-sm font-medium ${getStatusColor(data.delays)}`}>
                    {getStatusText(data.delays)}
                  </span>
                </div>
                
                {/* Progress bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-sm text-gray-500 mb-1">
                    <span>Postup cesty</span>
                    <span>{data.progress.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${data.progress.percentage}%` }}
                    ></div>
                  </div>
                  <div className="mt-1 text-xs text-gray-500 font-mono">
                    {createProgressBar(data.progress.current, data.progress.total)}
                  </div>
                </div>
                
                {/* Time information */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {data.actualDeparture && (
                    <div>
                      <div className="text-gray-500">Odjezd</div>
                      <div className="font-medium">
                        {data.actualDeparture.toLocaleTimeString('cs-CZ', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  )}
                  
                  {data.estimatedArrival && (
                    <div>
                      <div className="text-gray-500">Očekávaný příjezd</div>
                      <div className="font-medium">
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
                  <div className="mt-3 flex items-center space-x-2 text-red-600 bg-red-50 p-2 rounded">
                    <ExclamationTriangleIcon className="h-4 w-4" />
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
            <SignalIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Žádné aktivní sledování</p>
            <p className="text-sm text-gray-400 mt-2">
              Live tracking se zobrazí při aktivních jízdách
            </p>
          </div>
        )}
        
        {/* Auto-refresh indicator */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-center text-xs text-gray-400">
            <div className="animate-pulse h-2 w-2 bg-green-400 rounded-full mr-2"></div>
            Automatická aktualizace každých 30 sekund
          </div>
        </div>
      </div>
    </div>
  );
}