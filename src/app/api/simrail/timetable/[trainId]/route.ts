import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ trainId: string }> }
) {
  const { trainId } = await params;
  
  try {
    console.log('Fetching timetable for train:', trainId);
    
    // Use the correct SimRail API endpoint for timetables
    const timetableResponse = await fetch(`https://api1.aws.simrail.eu:8082/api/getAllTimetables?serverCode=cz1&train=${trainId}`);
    
    if (!timetableResponse.ok) {
      throw new Error(`Timetable API error: ${timetableResponse.status}`);
    }
    
    const timetableData = await timetableResponse.json();
    console.log('Raw timetable data from API:', timetableData);
    
    // API vrací pole objektů, kde každý objekt má timetable pole
    let timetableEntries = [];
    if (Array.isArray(timetableData) && timetableData.length > 0) {
      // Vezmeme první objekt a jeho timetable
      const trainInfo = timetableData[0];
      timetableEntries = trainInfo.timetable || [];
    }
    
    console.log('Extracted timetable entries:', timetableEntries);
    
    // Transform timetable data to match our interface
    const validTimetable = timetableEntries
      .filter((entry: any) => entry && (entry.nameForPerson || entry.nameOfPoint || entry.stationName || entry.StationName))
      .map((entry: any) => ({
        stationName: entry.nameForPerson || entry.nameOfPoint || entry.stationName || entry.StationName,
        stationCategory: entry.stationCategory || entry.StationCategory,
        arrivalTime: entry.arrivalTime || entry.ArrivalTime,
        departureTime: entry.departureTime || entry.DepartureTime,
        platform: entry.platform || entry.Platform,
        track: entry.track || entry.Track,
        maxSpeed: entry.maxSpeed || entry.MaxSpeed,
        radioChanels: entry.radioChanels || entry.RadioChanels,
        supervisedBy: entry.supervisedBy || entry.SupervisedBy,
        mileage: entry.mileage || entry.Mileage,
        stopType: entry.stopType || entry.StopType
      }));

    console.log('Valid timetable entries:', validTimetable.length);
    console.log('First few timetable entries:', validTimetable.slice(0, 3));

    return NextResponse.json(validTimetable, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });

  } catch (error) {
    console.error('Error fetching timetable:', error);
    return NextResponse.json({ error: 'Failed to fetch timetable' }, { status: 500 });
  }
}