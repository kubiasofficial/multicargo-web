import { NextRequest, NextResponse } from 'next/server';

const SIMRAIL_BASE_URL = 'https://panel.simrail.eu:8084';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const serverCode = searchParams.get('serverCode') || 'cz1';
    
    console.log('Fetching trains from SimRail API for server:', serverCode);
    
    const response = await fetch(`${SIMRAIL_BASE_URL}/trains-open?serverCode=${serverCode}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'MultiCargo-Web/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`SimRail API error: ${response.status} - ${response.statusText}`);
    }

    const apiResponse = await response.json();
    console.log('SimRail API full response:', apiResponse);

    // Check if response has the expected structure
    let trainsData = [];
    if (apiResponse.result && Array.isArray(apiResponse.data)) {
      trainsData = apiResponse.data;
    } else if (Array.isArray(apiResponse)) {
      trainsData = apiResponse;
    } else {
      console.error('Unexpected API response structure:', apiResponse);
      throw new Error('Invalid API response structure');
    }

    console.log('Extracted trains data:', trainsData);
    console.log('Number of trains found:', trainsData.length);

    // Transform the data to match our expected format
    const transformedData = trainsData
      .filter((train: any) => {
        // Only include trains that are not controlled by players (available for taking)
        return !train.TrainData?.ControlledBySteamId;
      })
      .map((train: any) => {
        console.log('Raw train data:', JSON.stringify(train, null, 2));
        
        const transformed = {
          id: train.TrainNoLocal || train.id || `train-${Date.now()}-${Math.random()}`,
          trainNumber: train.TrainNoLocal || train.trainNumber || 'Unknown',
          trainName: train.TrainName || train.trainName || '',
          startStation: train.StartStation || train.startStation || 'Unknown',
          endStation: train.EndStation || train.endStation || 'Unknown',
          currentStation: train.TrainData?.VDVCurrentStation || train.TrainData?.CurrentStation || train.currentStation || 'Neznámá stanice',
          nextStation: train.TrainData?.VDVNextStation || train.TrainData?.NextStation || train.nextStation || 'Neznámá stanice',
          type: 'AVAILABLE',
          company: 'SimRail',
          speed: train.TrainData?.Velocity || train.speed || 0,
          maxSpeed: train.TrainData?.MaxVelocity || train.maxSpeed || 0,
          signal: train.TrainData?.Signal || train.signal,
          distance: train.TrainData?.Distance || train.distance,
          distanceToSignalInFront: train.TrainData?.DistanceToSignalInFront || train.distanceToSignalInFront,
          lat: train.TrainData?.Latitude || train.lat,
          lng: train.TrainData?.Longitude || train.lng,
          vehicles: train.Vehicles || [],
          timetable: train.TimeTable || [], // Include timetable from API
          serverCode: train.ServerCode || serverCode
        };
        
        console.log('Transformed train:', JSON.stringify(transformed, null, 2));
        return transformed;
      });

    console.log('Transformed data:', transformedData);

    return NextResponse.json(transformedData, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });

  } catch (error) {
    console.error('Error proxying SimRail API:', error);
    
    // Return mock data if API fails
    const mockData = [
      {
        id: 'mock-1',
        trainNumber: 'R 672',
        trainName: 'RegioJet',
        startStation: 'Praha hl.n.',
        endStation: 'Brno hl.n.',
        currentStation: 'Pardubice hl.n.',
        nextStation: 'Česká Třebová',
        type: 'REGIONAL',
        company: 'České dráhy',
        speed: 85,
        maxSpeed: 120
      },
      {
        id: 'mock-2',
        trainNumber: 'EC 378',
        trainName: 'EuroCity',
        startStation: 'Praha hl.n.',
        endStation: 'Wien Hbf',
        currentStation: 'Brno hl.n.',
        nextStation: 'Břeclav',
        type: 'EXPRESS',
        company: 'České dráhy',
        speed: 0,
        maxSpeed: 160
      },
      {
        id: 'mock-3',
        trainNumber: 'Os 7331',
        trainName: 'Osobní vlak',
        startStation: 'Brno hl.n.',
        endStation: 'Blansko',
        type: 'LOCAL',
        company: 'České dráhy',
        speed: 45,
        maxSpeed: 90
      }
    ];

    return NextResponse.json(mockData, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }
}