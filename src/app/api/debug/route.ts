import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  console.log('Debug: Environment variables check');
  console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
  console.log('NEXTAUTH_SECRET exists:', !!process.env.NEXTAUTH_SECRET);
  console.log('DISCORD_CLIENT_ID:', process.env.DISCORD_CLIENT_ID);
  console.log('DISCORD_CLIENT_SECRET exists:', !!process.env.DISCORD_CLIENT_SECRET);
  console.log('DISCORD_BOT_TOKEN exists:', !!process.env.DISCORD_BOT_TOKEN);
  console.log('DISCORD_GUILD_ID:', process.env.DISCORD_GUILD_ID);

  return NextResponse.json({
    nextauth_url: process.env.NEXTAUTH_URL,
    nextauth_secret_exists: !!process.env.NEXTAUTH_SECRET,
    discord_client_id: process.env.DISCORD_CLIENT_ID,
    discord_client_secret_exists: !!process.env.DISCORD_CLIENT_SECRET,
    discord_bot_token_exists: !!process.env.DISCORD_BOT_TOKEN,
    discord_guild_id: process.env.DISCORD_GUILD_ID,
    timestamp: new Date().toISOString()
  });
}