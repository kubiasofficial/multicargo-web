import { NextRequest, NextResponse } from 'next/server';
import { findStationByCoordinates } from '@/lib/simrailApi';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get('lat') || '0');
    const lng = parseFloat(searchParams.get('lng') || '0');
    const maxDistance = parseInt(searchParams.get('maxDistance') || '5000');

    if (!lat || !lng) {
      return NextResponse.json({
        success: false,
        error: 'Missing required parameters: lat, lng'
      }, { status: 400 });
    }

    console.log(`🔍 Testing coordinate lookup: [${lat}, ${lng}] within ${maxDistance}m`);

    const stationName = await findStationByCoordinates(lat, lng, maxDistance);

    return NextResponse.json({
      success: true,
      data: {
        coordinates: { lat, lng },
        maxDistance,
        stationName,
        found: !!stationName
      }
    });

  } catch (error) {
    console.error('❌ Error in coordinate test:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to test coordinates',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}