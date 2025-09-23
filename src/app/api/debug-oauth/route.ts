import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const testUserId = url.searchParams.get('userId') || '1418590336871833673'; // Your Discord ID
  
  try {
    console.log('[DEBUG-OAUTH] Testing OAuth flow for user:', testUserId);
    
    // Test fetching user from Discord API
    const userResponse = await fetch(
      `https://discord.com/api/v10/users/${testUserId}`,
      {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`
        }
      }
    );
    
    console.log('[DEBUG-OAUTH] User response status:', userResponse.status);
    
    let userData = null;
    if (userResponse.ok) {
      userData = await userResponse.json();
    }
    
    // Test fetching guild member
    const memberResponse = await fetch(
      `https://discord.com/api/v10/guilds/${process.env.DISCORD_GUILD_ID}/members/${testUserId}`,
      {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`
        }
      }
    );
    
    console.log('[DEBUG-OAUTH] Member response status:', memberResponse.status);
    
    let memberData = null;
    if (memberResponse.ok) {
      memberData = await memberResponse.json();
    } else {
      const errorText = await memberResponse.text();
      console.error('[DEBUG-OAUTH] Member fetch error:', errorText);
    }
    
    // Test role mapping
    const mappedRoles = [];
    if (memberData?.roles) {
      const userRoles = memberData.roles;
      
      if (userRoles.includes(process.env.DISCORD_ADMIN_ROLE_ID)) {
        mappedRoles.push('ADMIN');
      }
      if (userRoles.includes(process.env.DISCORD_EMPLOYEE_ROLE_ID)) {
        mappedRoles.push('EMPLOYEE');
      }
      if (userRoles.includes(process.env.DISCORD_STROJVUDCE_ROLE_ID)) {
        mappedRoles.push('STROJVUDCE');
      }
      if (userRoles.includes(process.env.DISCORD_VYPRAVCI_ROLE_ID)) {
        mappedRoles.push('VYPRAVCI');
      }
      
      if (mappedRoles.length === 0) {
        mappedRoles.push('EMPLOYEE');
      }
    }
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      testUserId,
      userData: userData ? {
        id: userData.id,
        username: userData.username,
        discriminator: userData.discriminator
      } : null,
      memberData: memberData ? {
        user: memberData.user ? {
          id: memberData.user.id,
          username: memberData.user.username
        } : null,
        roles: memberData.roles,
        joinedAt: memberData.joined_at
      } : null,
      mappedRoles,
      roleConfiguration: {
        admin: process.env.DISCORD_ADMIN_ROLE_ID,
        employee: process.env.DISCORD_EMPLOYEE_ROLE_ID,
        strojvudce: process.env.DISCORD_STROJVUDCE_ROLE_ID,
        vypravci: process.env.DISCORD_VYPRAVCI_ROLE_ID
      },
      responseStatuses: {
        user: userResponse.status,
        member: memberResponse.status
      }
    });
    
  } catch (error) {
    console.error('[DEBUG-OAUTH] Error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}