import { NextRequest, NextResponse } from 'next/server';
import { calculateTrainDelay, getTrainDelayDetails, fetchTrainTimetable } from '@/lib/simrailApi';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const trainNumber = searchParams.get('trainNumber');
    
    if (!trainNumber) {
      return NextResponse.json({
        success: false,
        error: 'Missing required parameter: trainNumber'
      }, { status: 400 });
    }

    console.log(`🧪 Testing delay calculation for train: ${trainNumber}`);

    // Get current time for reference
    const now = new Date();
    
    // Calculate delay using the new system
    const calculatedDelay = await calculateTrainDelay(trainNumber);
    const delayDetails = await getTrainDelayDetails(trainNumber);
    const timetable = await fetchTrainTimetable(trainNumber);

    console.log('📊 Delay calculation results:', {
      trainNumber,
      currentTime: now.toLocaleTimeString('cs-CZ'),
      calculatedDelay,
      delayDetails,
      timetableEntries: timetable.length
    });

    return NextResponse.json({
      success: true,
      data: {
        trainNumber,
        currentTime: now.toISOString(),
        currentTimeLocal: now.toLocaleTimeString('cs-CZ'),
        calculatedDelay,
        delayDetails,
        timetable: timetable.slice(0, 5), // First 5 entries for debugging
        totalTimetableEntries: timetable.length
      }
    });

  } catch (error) {
    console.error('❌ Error in delay calculation test:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to test delay calculation',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}