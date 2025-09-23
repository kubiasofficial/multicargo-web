import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  
  console.log('[MINIMAL-AUTH] Request received');
  console.log('[MINIMAL-AUTH] Code:', code ? 'YES' : 'NO');
  console.log('[MINIMAL-AUTH] Error:', error);
  console.log('[MINIMAL-AUTH] All params:', Object.fromEntries(searchParams.entries()));
  
  if (error) {
    return NextResponse.json({
      status: 'error',
      error: error,
      message: 'Discord returned an error'
    });
  }
  
  if (!code) {
    return NextResponse.json({
      status: 'no_code',
      message: 'No authorization code received',
      allParams: Object.fromEntries(searchParams.entries())
    });
  }
  
  // Try token exchange
  try {
    console.log('[MINIMAL-AUTH] Attempting token exchange...');
    
    const tokenBody = new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID!,
      client_secret: process.env.DISCORD_CLIENT_SECRET!,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: `${process.env.NEXTAUTH_URL}/api/minimal-auth`,
    });
    
    console.log('[MINIMAL-AUTH] Token request body:', tokenBody.toString());
    
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: tokenBody,
    });
    
    console.log('[MINIMAL-AUTH] Token response status:', tokenResponse.status);
    
    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('[MINIMAL-AUTH] Token error:', errorText);
      return NextResponse.json({
        status: 'token_error',
        tokenStatus: tokenResponse.status,
        tokenError: errorText,
        environment: {
          NEXTAUTH_URL: process.env.NEXTAUTH_URL,
          CLIENT_ID: process.env.DISCORD_CLIENT_ID?.substring(0, 8) + '...',
          hasSecret: !!process.env.DISCORD_CLIENT_SECRET
        }
      });
    }
    
    const tokenData = await tokenResponse.json();
    console.log('[MINIMAL-AUTH] Token received successfully');
    
    // Get user
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });
    
    if (!userResponse.ok) {
      const errorText = await userResponse.text();
      return NextResponse.json({
        status: 'user_error',
        userStatus: userResponse.status,
        userError: errorText
      });
    }
    
    const userData = await userResponse.json();
    console.log('[MINIMAL-AUTH] User data received:', userData.username);
    
    return NextResponse.json({
      status: 'success',
      message: '🎉 Discord OAuth funguje perfektně!',
      user: {
        id: userData.id,
        username: userData.username,
        discriminator: userData.discriminator
      },
      token_info: {
        access_token: !!tokenData.access_token,
        token_type: tokenData.token_type,
        scope: tokenData.scope
      }
    });
    
  } catch (err) {
    console.error('[MINIMAL-AUTH] Exception:', err);
    return NextResponse.json({
      status: 'exception',
      error: err instanceof Error ? err.message : 'Unknown error'
    });
  }
}