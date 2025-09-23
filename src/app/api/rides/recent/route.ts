import { NextRequest, NextResponse } from 'next/server';

// Simulace databáze pro poslední jízdy
const recentRidesData = [
  {
    id: 'recent-1',
    trainNumber: 'Os 7331',
    route: 'Brno hl.n. → Blansko',
    departure: { station: 'Brno hl.n.', time: new Date('2024-12-22T12:00:00') },
    arrival: { station: 'Blansko', time: new Date('2024-12-22T12:45:00') },
    status: 'COMPLETED',
    assignedUserId: '',
    createdBy: 'dispatcher1',
    createdAt: new Date('2024-12-22T11:30:00'),
    updatedAt: new Date('2024-12-22T12:45:00'),
    priority: 'LOW',
    actualDuration: 45, // minutes
    finalDelay: 2 // minutes
  },
  {
    id: 'recent-2',
    trainNumber: 'R 672',
    route: 'Praha hl.n. → Pardubice hl.n.',
    departure: { station: 'Praha hl.n.', time: new Date('2024-12-22T10:15:00') },
    arrival: { station: 'Pardubice hl.n.', time: new Date('2024-12-22T11:35:00') },
    status: 'COMPLETED',
    assignedUserId: '',
    createdBy: 'dispatcher2',
    createdAt: new Date('2024-12-22T09:45:00'),
    updatedAt: new Date('2024-12-22T11:35:00'),
    priority: 'NORMAL',
    actualDuration: 80,
    finalDelay: 0
  },
  {
    id: 'recent-3',
    trainNumber: 'EC 378',
    route: 'Praha hl.n. → Brno hl.n.',
    departure: { station: 'Praha hl.n.', time: new Date('2024-12-21T14:20:00') },
    arrival: { station: 'Brno hl.n.', time: new Date('2024-12-21T17:15:00') },
    status: 'COMPLETED',
    assignedUserId: '',
    createdBy: 'dispatcher1',
    createdAt: new Date('2024-12-21T13:50:00'),
    updatedAt: new Date('2024-12-21T17:15:00'),
    priority: 'HIGH',
    actualDuration: 175,
    finalDelay: 8
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '5');

    console.log('📋 Fetching recent rides for user:', userId, 'limit:', limit);

    // Filter by user if specified
    let filteredRides = recentRidesData;
    if (userId) {
      filteredRides = recentRidesData.filter(ride => ride.assignedUserId === userId);
    }

    // Sort by completion date (most recent first)
    const sortedRides = filteredRides
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, limit);

    console.log('✅ Found recent rides:', sortedRides.length);

    return NextResponse.json({
      success: true,
      data: sortedRides,
      count: sortedRides.length
    });

  } catch (error) {
    console.error('❌ Error fetching recent rides:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch recent rides',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('💾 Adding completed ride:', body);

    // In a real app, this would save to database
    const newRide = {
      id: `recent-${Date.now()}`,
      ...body,
      status: 'COMPLETED',
      updatedAt: new Date(),
      createdAt: body.createdAt ? new Date(body.createdAt) : new Date()
    };

    // Add to the beginning of the array (most recent first)
    recentRidesData.unshift(newRide);

    // Keep only last 20 rides
    if (recentRidesData.length > 20) {
      recentRidesData.splice(20);
    }

    console.log('✅ Ride added to recent rides');

    return NextResponse.json({
      success: true,
      data: newRide
    });

  } catch (error) {
    console.error('❌ Error adding completed ride:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to add completed ride',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}