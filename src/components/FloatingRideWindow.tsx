'use client';

import { useState, useEffect } from 'react';
import { 
  XMarkIcon,
  MinusIcon,
  ClockIcon,
  MapPinIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  StopIcon,
  CalendarDaysIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { ActiveRide, SimRailTimetableEntry } from '@/types';
import { getTrainImage, getTrainTypeDescription } from '@/lib/trainImages';
import { fetchTrainTimetable, getTrainPosition, calculateTrainDelay } from '@/lib/simrailApi';
import { sendRideEndNotification } from '@/lib/discord';

interface FloatingRideWindowProps {
  activeRide: ActiveRide;
  onMinimize: () => void;
  onClose: () => void;
  onEndRide: () => void;
}

export default function FloatingRideWindow({ 
  activeRide, 
  onMinimize, 
  onClose, 
  onEndRide 
}: FloatingRideWindowProps) {
  const [isMinimized, setIsMinimized] = useState(activeRide.isMinimized);
  const [showTimetable, setShowTimetable] = useState(false);
  const [timetable, setTimetable] = useState<SimRailTimetableEntry[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [realTimeData, setRealTimeData] = useState({
    currentStation: activeRide.currentStation || '',
    nextStation: activeRide.nextStation || '',
    delay: activeRide.delay || 0,
    speed: 0,
    progress: activeRide.progress || 0
  });
  const [loadingTimetable, setLoadingTimetable] = useState(false);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fetch real-time data every 30 seconds
  useEffect(() => {
    const fetchRealTimeData = async () => {
      try {
        const position = await getTrainPosition(activeRide.trainNumber);
        const delay = await calculateTrainDelay(activeRide.trainNumber);
        
        if (position) {
          setRealTimeData(prev => ({
            ...prev,
            currentStation: position.currentStation || prev.currentStation,
            nextStation: position.nextStation || prev.nextStation,
            delay: delay,
            speed: position.speed || 0,
            progress: position.progress || prev.progress
          }));
        }
      } catch (error) {
        console.error('Error fetching real-time data:', error);
      }
    };

    // Initial fetch
    fetchRealTimeData();

    // Set up interval for real-time updates
    const interval = setInterval(fetchRealTimeData, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [activeRide.trainNumber]);

  const handleShowTimetable = async () => {
    if (!showTimetable && timetable.length === 0) {
      setLoadingTimetable(true);
      try {
        const timetableData = await fetchTrainTimetable(activeRide.trainNumber);
        setTimetable(timetableData);
      } catch (error) {
        console.error('Error fetching timetable:', error);
      } finally {
        setLoadingTimetable(false);
      }
    }
    setShowTimetable(!showTimetable);
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
    onMinimize();
  };

  const handleEndRide = async () => {
    const duration = Math.floor((Date.now() - activeRide.startTime.getTime()) / 1000 / 60); // minutes
    
    // Send Discord notification
    try {
      await sendRideEndNotification(
        activeRide.userName,
        activeRide.trainNumber,
        activeRide.route,
        duration,
        realTimeData.delay,
        getTrainImage(activeRide.trainNumber)
      );
    } catch (error) {
      console.error('Error sending Discord notification:', error);
    }
    
    onEndRide();
  };

  const getCurrentStationInTimetable = () => {
    return timetable.findIndex(entry => 
      entry.stationName === realTimeData.currentStation
    );
  };

  const getJourneyDuration = () => {
    const duration = Math.floor((Date.now() - activeRide.startTime.getTime()) / 1000 / 60);
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  return (
    <div className={`fixed ${isMinimized ? 'bottom-4 right-4' : 'top-4 right-4'} z-50 transition-all duration-300`}>
      <div className={`bg-gray-800 border border-gray-600 rounded-lg shadow-2xl shadow-indigo-500/20 ${
        isMinimized ? 'w-80' : 'w-96'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gradient-to-r from-indigo-600 to-purple-600">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded overflow-hidden">
              <img
                src={getTrainImage(activeRide.trainNumber)}
                alt={activeRide.trainNumber}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://wiki.simrail.eu/vehicles_logo.png';
                }}
              />
            </div>
            <div>
              <h3 className="text-white font-bold">{activeRide.trainNumber}</h3>
              <p className="text-indigo-100 text-sm">Aktivní jízda</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleMinimize}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <MinusIcon className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        {!isMinimized && (
          <div className="p-4 space-y-4">
            {/* Route Info */}
            <div className="bg-gray-700 rounded-lg p-3 border border-gray-600">
              <h4 className="text-white font-medium mb-2">Trasa</h4>
              <p className="text-gray-300">{activeRide.route}</p>
            </div>

            {/* Real-time Info Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-700 rounded-lg p-3 border border-gray-600">
                <div className="flex items-center text-blue-400 mb-1">
                  <MapPinIcon className="h-4 w-4 mr-1" />
                  <span className="text-sm">Aktuální pozice</span>
                </div>
                <p className="text-white font-medium text-sm">
                  {activeRide.currentStation || realTimeData.currentStation || 'Neznámá'}
                </p>
              </div>

              <div className="bg-gray-700 rounded-lg p-3 border border-gray-600">
                <div className="flex items-center text-green-400 mb-1">
                  <MapPinIcon className="h-4 w-4 mr-1" />
                  <span className="text-sm">Další stanice</span>
                </div>
                <p className="text-white font-medium text-sm">
                  {activeRide.nextStation || realTimeData.nextStation || 'Neznámá'}
                </p>
              </div>

              <div className="bg-gray-700 rounded-lg p-3 border border-gray-600">
                <div className="flex items-center text-orange-400 mb-1">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  <span className="text-sm">Zpoždění</span>
                </div>
                <p className={`font-medium text-sm ${
                  realTimeData.delay > 5 ? 'text-red-400' : 
                  realTimeData.delay > 0 ? 'text-yellow-400' : 'text-green-400'
                }`}>
                  {realTimeData.delay > 0 ? `+${realTimeData.delay} min` : 'Na čas'}
                </p>
              </div>

              <div className="bg-gray-700 rounded-lg p-3 border border-gray-600">
                <div className="flex items-center text-purple-400 mb-1">
                  <CalendarDaysIcon className="h-4 w-4 mr-1" />
                  <span className="text-sm">Doba jízdy</span>
                </div>
                <p className="text-white font-medium text-sm">
                  {getJourneyDuration()}
                </p>
              </div>
            </div>

            {/* Current Time */}
            <div className="text-center bg-gray-700 rounded-lg p-3 border border-gray-600">
              <div className="text-gray-400 text-sm mb-1">Aktuální čas</div>
              <div className="text-white text-lg font-mono">
                {currentTime.toLocaleTimeString('cs-CZ')}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={handleShowTimetable}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/20"
              >
                <CalendarDaysIcon className="h-4 w-4" />
                <span>Jízdní řád</span>
                {showTimetable ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
              </button>
              
              <button
                onClick={handleEndRide}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 shadow-lg shadow-red-500/20"
              >
                <StopIcon className="h-4 w-4" />
                <span>Ukončit</span>
              </button>
            </div>

            {/* Timetable */}
            {showTimetable && (
              <div className="bg-gray-700 rounded-lg border border-gray-600 max-h-64 overflow-y-auto">
                <div className="p-3 border-b border-gray-600">
                  <h4 className="text-white font-medium">Jízdní řád - {activeRide.trainNumber}</h4>
                </div>
                {loadingTimetable ? (
                  <div className="flex items-center justify-center p-6">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
                    <span className="ml-2 text-gray-300">Načítám jízdní řád...</span>
                  </div>
                ) : timetable.length > 0 ? (
                  <div className="p-3 space-y-2">
                    {timetable.map((entry, index) => {
                      const isCurrent = entry.stationName === realTimeData.currentStation;
                      const isPassed = index < getCurrentStationInTimetable();
                      
                      return (
                        <div
                          key={index}
                          className={`flex items-center justify-between p-2 rounded ${
                            isCurrent 
                              ? 'bg-blue-600/30 border border-blue-500' 
                              : isPassed 
                                ? 'bg-green-600/20' 
                                : 'bg-gray-600/30'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${
                              isCurrent 
                                ? 'bg-blue-400 animate-pulse' 
                                : isPassed 
                                  ? 'bg-green-400' 
                                  : 'bg-gray-400'
                            }`} />
                            <div>
                              <span className={`text-sm ${
                                isCurrent ? 'text-blue-200 font-medium' : 'text-gray-300'
                              }`}>
                                {entry.stationName}
                              </span>
                              {entry.platform && (
                                <span className="text-xs text-gray-500 ml-2">
                                  Nástupiště {entry.platform}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-xs text-gray-400">
                            {entry.arrivalTime && (
                              <div>Příjezd: {entry.arrivalTime}</div>
                            )}
                            {entry.departureTime && (
                              <div>Odjezd: {entry.departureTime}</div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <ExclamationTriangleIcon className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm mb-2">Jízdní řád není dostupný</p>
                    <p className="text-gray-500 text-xs mb-3">
                      Zobrazuji pouze základní informace o trase: {activeRide.route}
                    </p>
                    {/* Show basic route info as fallback */}
                    <div className="text-left bg-gray-600/30 rounded p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full bg-green-400" />
                          <span className="text-sm text-gray-300">{activeRide.startStation}</span>
                        </div>
                        <span className="text-xs text-gray-500">Výchozí</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full bg-blue-400" />
                          <span className="text-sm text-gray-300">{activeRide.endStation}</span>
                        </div>
                        <span className="text-xs text-gray-500">Cílová</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Minimized View */}
        {isMinimized && (
          <div className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">{activeRide.trainNumber}</p>
                <p className="text-gray-400 text-sm">{activeRide.currentStation || realTimeData.currentStation || 'Neznámá stanice'}</p>
              </div>
              <div className="text-right">
                <p className="text-white text-sm">{getJourneyDuration()}</p>
                <p className={`text-xs ${
                  realTimeData.delay > 5 ? 'text-red-400' : 
                  realTimeData.delay > 0 ? 'text-yellow-400' : 'text-green-400'
                }`}>
                  {realTimeData.delay > 0 ? `+${realTimeData.delay}min` : 'Na čas'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}