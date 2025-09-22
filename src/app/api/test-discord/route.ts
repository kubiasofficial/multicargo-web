import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('Testing Discord bot token...');
    console.log('Bot token exists:', !!process.env.DISCORD_BOT_TOKEN);
    console.log('Guild ID:', process.env.DISCORD_GUILD_ID);
    
    // Test basic Discord API access
    const response = await fetch(
      `https://discord.com/api/v10/guilds/${process.env.DISCORD_GUILD_ID}`,
      {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`
        }
      }
    );
    
    const data = await response.json();
    console.log('Discord API response status:', response.status);
    console.log('Discord API response:', data);
    
    return NextResponse.json({
      status: response.status,
      botTokenExists: !!process.env.DISCORD_BOT_TOKEN,
      guildId: process.env.DISCORD_GUILD_ID,
      response: response.ok ? 'Bot has access to guild' : data
    });
    
  } catch (error) {
    console.error('Discord test error:', error);
    return NextResponse.json({ error: 'Test failed', details: error }, { status: 500 });
  }
}