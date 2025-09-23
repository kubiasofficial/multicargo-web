import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const serverCode = searchParams.get('serverCode') || 'cz1';

    console.log('🚉 Fetching stations for server:', serverCode);

    const response = await fetch(
      `https://panel.simrail.eu:8084/stations-open?serverCode=${serverCode}`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'MultiCargo-Web/1.0'
        },
        cache: 'no-store' // Real-time data
      }
    );

    if (!response.ok) {
      console.error('❌ SimRail stations API error:', response.status, response.statusText);
      throw new Error(`SimRail API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ SimRail stations response:', {
      result: data.result,
      count: data.count,
      stationsCount: data.data?.length || 0
    });

    // Transform the data to our format
    const stations = data.data?.map((station: any) => ({
      id: station.id,
      name: station.Name,
      prefix: station.Prefix,
      latitude: station.Latititude, // Note: API has typo "Latititude"
      longitude: station.Longitude,
      difficultyLevel: station.DifficultyLevel,
      mainImageURL: station.MainImageURL,
      additionalImage1URL: station.AdditionalImage1URL,
      additionalImage2URL: station.AdditionalImage2URL,
      dispatchedBy: station.DispatchedBy || []
    })) || [];

    console.log('🗺️ Processed stations:', stations.length);
    if (stations.length > 0) {
      console.log('🏁 Sample station:', stations[0]);
    }

    return NextResponse.json({
      success: true,
      data: stations,
      count: stations.length
    });

  } catch (error) {
    console.error('❌ Error in stations API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch stations data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}