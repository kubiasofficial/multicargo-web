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

    const data = await response.json();
    console.log('SimRail API response:', data);

    return NextResponse.json(data, {
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