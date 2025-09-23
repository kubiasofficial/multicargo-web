import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('[DEBUG-DISCORD-ROLES] Starting...');
    
    // Check environment variables
    const envVars = {
      DISCORD_BOT_TOKEN: !!process.env.DISCORD_BOT_TOKEN,
      DISCORD_GUILD_ID: process.env.DISCORD_GUILD_ID,
      DISCORD_ADMIN_ROLE_ID: process.env.DISCORD_ADMIN_ROLE_ID,
      DISCORD_EMPLOYEE_ROLE_ID: process.env.DISCORD_EMPLOYEE_ROLE_ID,
      DISCORD_STROJVUDCE_ROLE_ID: process.env.DISCORD_STROJVUDCE_ROLE_ID,
      DISCORD_VYPRAVCI_ROLE_ID: process.env.DISCORD_VYPRAVCI_ROLE_ID
    };
    
    console.log('[DEBUG-DISCORD-ROLES] Environment variables:', envVars);
    
    // Test Discord bot access to guild
    if (!process.env.DISCORD_BOT_TOKEN || !process.env.DISCORD_GUILD_ID) {
      return NextResponse.json({
        error: 'Missing Discord bot token or guild ID',
        envVars
      }, { status: 400 });
    }
    
    // Get guild info
    const guildResponse = await fetch(
      `https://discord.com/api/v10/guilds/${process.env.DISCORD_GUILD_ID}`,
      {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`
        }
      }
    );
    
    console.log('[DEBUG-DISCORD-ROLES] Guild response status:', guildResponse.status);
    
    if (!guildResponse.ok) {
      const errorText = await guildResponse.text();
      console.error('[DEBUG-DISCORD-ROLES] Guild fetch error:', errorText);
      return NextResponse.json({
        error: 'Failed to fetch guild info',
        status: guildResponse.status,
        details: errorText,
        envVars
      }, { status: 500 });
    }
    
    const guild = await guildResponse.json();
    
    // Get guild roles
    const rolesResponse = await fetch(
      `https://discord.com/api/v10/guilds/${process.env.DISCORD_GUILD_ID}/roles`,
      {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`
        }
      }
    );
    
    console.log('[DEBUG-DISCORD-ROLES] Roles response status:', rolesResponse.status);
    
    if (!rolesResponse.ok) {
      const errorText = await rolesResponse.text();
      console.error('[DEBUG-DISCORD-ROLES] Roles fetch error:', errorText);
      return NextResponse.json({
        error: 'Failed to fetch guild roles',
        status: rolesResponse.status,
        details: errorText,
        guild: { id: guild.id, name: guild.name },
        envVars
      }, { status: 500 });
    }
    
    const roles = await rolesResponse.json();
    
    // Map role names to IDs for easier debugging
    const roleMapping = roles.map((role: any) => ({
      id: role.id,
      name: role.name,
      isConfigured: {
        admin: role.id === process.env.DISCORD_ADMIN_ROLE_ID,
        employee: role.id === process.env.DISCORD_EMPLOYEE_ROLE_ID,
        strojvudce: role.id === process.env.DISCORD_STROJVUDCE_ROLE_ID,
        vypravci: role.id === process.env.DISCORD_VYPRAVCI_ROLE_ID
      }
    }));
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      guild: {
        id: guild.id,
        name: guild.name,
        memberCount: guild.member_count
      },
      envVars,
      roleMapping,
      configuredRoles: {
        admin: process.env.DISCORD_ADMIN_ROLE_ID,
        employee: process.env.DISCORD_EMPLOYEE_ROLE_ID,
        strojvudce: process.env.DISCORD_STROJVUDCE_ROLE_ID,
        vypravci: process.env.DISCORD_VYPRAVCI_ROLE_ID
      }
    });
    
  } catch (error) {
    console.error('[DEBUG-DISCORD-ROLES] Error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}