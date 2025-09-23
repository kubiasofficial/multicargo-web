'use client';

import { useActiveRide } from '@/contexts/ActiveRideContext';
import FloatingRideWindow from './FloatingRideWindow';

export default function FloatingRideWrapper() {
  const { activeRide, endRide, minimizeRide } = useActiveRide();

  if (!activeRide || activeRide.status === 'COMPLETED') {
    return null;
  }

  return (
    <FloatingRideWindow
      activeRide={activeRide}
      onMinimize={minimizeRide}
      onClose={() => {}} // Just hide, don't end ride
      onEndRide={endRide}
    />
  );
}