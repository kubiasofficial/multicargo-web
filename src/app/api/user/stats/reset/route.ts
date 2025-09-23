import { NextRequest, NextResponse } from 'next/server';

interface UserStats {
  totalRides: number;
  completedRides: number;
  activeRides: number;
  points: number;
  level: number;
  streak: number;
  lastActiveDate: string | null;
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const fs = await import('fs').then(m => m.promises);
    const path = await import('path');
    
    const dataDir = path.join(process.cwd(), 'data');
    const userStatsFile = path.join(dataDir, `user-stats-${userId}.json`);

    // Reset to default stats
    const defaultStats: UserStats = {
      totalRides: 0,
      completedRides: 0,
      activeRides: 0,
      points: 0,
      level: 1,
      streak: 0,
      lastActiveDate: null
    };

    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(userStatsFile, JSON.stringify(defaultStats, null, 2));

    return NextResponse.json({
      success: true,
      message: 'User statistics reset successfully',
      data: defaultStats
    });
  } catch (error) {
    console.error('Error resetting user stats:', error);
    return NextResponse.json({
      error: 'Failed to reset user statistics'
    }, { status: 500 });
  }
}