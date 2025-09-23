import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

export async function GET(request: NextRequest) {
  try {
    console.log('[TEST-AUTH] Starting test...');
    
    // Test environment variables
    const envCheck = {
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      DISCORD_CLIENT_ID: !!process.env.DISCORD_CLIENT_ID,
      DISCORD_CLIENT_SECRET: !!process.env.DISCORD_CLIENT_SECRET,
      DISCORD_BOT_TOKEN: !!process.env.DISCORD_BOT_TOKEN,
      DISCORD_GUILD_ID: process.env.DISCORD_GUILD_ID
    };
    
    console.log('[TEST-AUTH] Environment variables:', envCheck);
    
    // Test session
    let session = null;
    try {
      session = await getServerSession();
      console.log('[TEST-AUTH] Session result:', session);
    } catch (sessionError) {
      console.error('[TEST-AUTH] Session error:', sessionError);
    }
    
    // Test cookies
    const cookies = request.headers.get('cookie');
    console.log('[TEST-AUTH] Request cookies:', cookies);
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      environment: envCheck,
      session: session,
      cookies: cookies ? cookies.split(';').map(c => c.trim()) : [],
      userAgent: request.headers.get('user-agent'),
      url: request.url
    });
    
  } catch (error) {
    console.error('[TEST-AUTH] Error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}