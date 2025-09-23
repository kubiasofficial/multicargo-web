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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Fetch user statistics from storage
    // For now, we'll implement a simple file-based storage
    const fs = await import('fs').then(m => m.promises);
    const path = await import('path');
    
    const dataDir = path.join(process.cwd(), 'data');
    const userStatsFile = path.join(dataDir, `user-stats-${userId}.json`);

    let userStats: UserStats = {
      totalRides: 0,
      completedRides: 0,
      activeRides: 0,
      points: 0,
      level: 1,
      streak: 0,
      lastActiveDate: null
    };

    try {
      // Ensure data directory exists
      await fs.mkdir(dataDir, { recursive: true });
      
      // Try to read existing stats
      const statsData = await fs.readFile(userStatsFile, 'utf-8');
      userStats = JSON.parse(statsData);
    } catch {
      // File doesn't exist or is invalid, use defaults
      console.log(`Creating new stats file for user ${userId}`);
    }

    // Calculate level based on points
    userStats.level = Math.floor(userStats.points / 100) + 1;

    // Update streak based on last active date
    const today = new Date().toDateString();
    const lastActive = userStats.lastActiveDate;
    
    if (lastActive) {
      const lastActiveDate = new Date(lastActive);
      const todayDate = new Date(today);
      const diffTime = todayDate.getTime() - lastActiveDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 1) {
        // Streak broken
        userStats.streak = 0;
      }
    }

    return NextResponse.json({
      success: true,
      data: userStats
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json({
      error: 'Failed to fetch user statistics'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, action, data } = await request.json();

    if (!userId || !action) {
      return NextResponse.json({ error: 'User ID and action are required' }, { status: 400 });
    }

    const fs = await import('fs').then(m => m.promises);
    const path = await import('path');
    
    const dataDir = path.join(process.cwd(), 'data');
    const userStatsFile = path.join(dataDir, `user-stats-${userId}.json`);

    // Ensure data directory exists
    await fs.mkdir(dataDir, { recursive: true });

    let userStats: UserStats = {
      totalRides: 0,
      completedRides: 0,
      activeRides: 0,
      points: 0,
      level: 1,
      streak: 0,
      lastActiveDate: null
    };

    try {
      const statsData = await fs.readFile(userStatsFile, 'utf-8');
      userStats = JSON.parse(statsData);
    } catch {
      // File doesn't exist, use defaults
    }

    const today = new Date().toDateString();

    switch (action) {
      case 'START_RIDE':
        userStats.totalRides += 1;
        userStats.activeRides += 1;
        userStats.points += 10; // Points for starting a ride
        
        // Update streak
        if (userStats.lastActiveDate !== today) {
          const lastActive = userStats.lastActiveDate;
          if (lastActive) {
            const lastActiveDate = new Date(lastActive);
            const todayDate = new Date(today);
            const diffTime = todayDate.getTime() - lastActiveDate.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) {
              userStats.streak += 1;
            } else if (diffDays > 1) {
              userStats.streak = 1;
            }
          } else {
            userStats.streak = 1;
          }
          userStats.lastActiveDate = today;
        }
        break;

      case 'COMPLETE_RIDE':
        userStats.completedRides += 1;
        userStats.activeRides = Math.max(0, userStats.activeRides - 1);
        userStats.points += 50; // Points for completing a ride
        
        // Bonus points for delay performance
        if (data?.delay !== undefined) {
          if (data.delay <= 0) {
            userStats.points += 25; // On time bonus
          } else if (data.delay <= 5) {
            userStats.points += 10; // Minor delay bonus
          }
        }
        break;

      case 'CANCEL_RIDE':
        userStats.activeRides = Math.max(0, userStats.activeRides - 1);
        userStats.points = Math.max(0, userStats.points - 5); // Small penalty
        break;

      case 'UPDATE_ACTIVITY':
        // Just update last active date
        if (userStats.lastActiveDate !== today) {
          userStats.lastActiveDate = today;
        }
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Recalculate level
    userStats.level = Math.floor(userStats.points / 100) + 1;

    // Save updated stats
    await fs.writeFile(userStatsFile, JSON.stringify(userStats, null, 2));

    return NextResponse.json({
      success: true,
      data: userStats
    });
  } catch (error) {
    console.error('Error updating user stats:', error);
    return NextResponse.json({
      error: 'Failed to update user statistics'
    }, { status: 500 });
  }
}