import { NextRequest, NextResponse } from 'next/server';
import { migrationHelpers } from '@/lib/firestore';

// Discord bot webhook endpoint for data synchronization
export async function POST(request: NextRequest) {
  try {
    const authorization = request.headers.get('authorization');
    
    // Verify Discord bot token
    if (authorization !== `Bearer ${process.env.DISCORD_BOT_TOKEN}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { type, data } = body;

    switch (type) {
      case 'SYNC_DATA':
        // Full data synchronization from Discord bot
        const { aktivniJizdy, dokonceneJizdy, userStats } = data;
        
        // Convert Maps from JSON
        const aktivniJizdyMap = new Map(Object.entries(aktivniJizdy || {}).map(([key, value]) => [key, value as Record<string, unknown>]));
        const dokonceneJizdyMap = new Map(Object.entries(dokonceneJizdy || {}).map(([key, value]) => [key, Array.isArray(value) ? value as Record<string, unknown>[] : []]));
        const userStatsMap = new Map(Object.entries(userStats || {}).map(([key, value]) => [key, value as Record<string, unknown>]));
        
        await migrationHelpers.migrateDiscordBotData(
          aktivniJizdyMap,
          dokonceneJizdyMap,
          userStatsMap
        );
        
        return NextResponse.json({ success: true, message: 'Data synchronized successfully' });

      case 'RIDE_UPDATE':
        // Single ride update from Discord bot
        const { rideId, updateData } = data;
        // Handle specific ride update
        return NextResponse.json({ success: true, message: 'Ride updated' });

      case 'USER_STATS_UPDATE':
        // User statistics update from Discord bot
        const { userId, stats } = data;
        // Handle user stats update
        return NextResponse.json({ success: true, message: 'User stats updated' });

      default:
        return NextResponse.json({ error: 'Unknown sync type' }, { status: 400 });
    }
  } catch (error) {
    console.error('Discord sync error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET endpoint for Discord bot to fetch current web app data
export async function GET(request: NextRequest) {
  try {
    const authorization = request.headers.get('authorization');
    
    // Verify Discord bot token
    if (authorization !== `Bearer ${process.env.DISCORD_BOT_TOKEN}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Return current web app state for Discord bot
    const response = {
      timestamp: new Date().toISOString(),
      config: {
        DISPATCHER_CHANNEL_ID: process.env.DISCORD_DISPATCHER_CHANNEL_ID,
        ACTIVE_RIDES_CHANNEL_ID: process.env.DISCORD_ACTIVE_RIDES_CHANNEL_ID,
        ADMIN_ROLE_ID: process.env.DISCORD_ADMIN_ROLE_ID,
        EMPLOYEE_ROLE_ID: process.env.DISCORD_EMPLOYEE_ROLE_ID,
        STROJVUDCE_ROLE_ID: process.env.DISCORD_STROJVUDCE_ROLE_ID,
        VYPRAVCI_ROLE_ID: process.env.DISCORD_VYPRAVCI_ROLE_ID
      },
      status: 'online'
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Discord config fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}