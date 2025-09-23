import { NextRequest, NextResponse } from 'next/server';

export async function GET(_request: NextRequest) {
  return NextResponse.json({
    message: "Debug callback endpoint is working!",
    timestamp: new Date().toISOString(),
    environment: {
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID?.substring(0, 8) + "...",
      hasSecret: !!process.env.DISCORD_CLIENT_SECRET
    }
  });
}