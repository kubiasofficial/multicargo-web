import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  
  // Log all query parameters
  const params = Object.fromEntries(url.searchParams.entries());
  console.log('[CALLBACK-DEBUG] Query params:', params);
  
  // Check for OAuth callback parameters
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');
  const errorDescription = url.searchParams.get('error_description');
  const state = url.searchParams.get('state');
  
  console.log('[CALLBACK-DEBUG] OAuth params:', { code: !!code, error, errorDescription, state });
  
  // If we have a code, try to exchange it manually for debugging
  if (code) {
    try {
      console.log('[CALLBACK-DEBUG] Attempting token exchange...');
      
      const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: process.env.DISCORD_CLIENT_ID!,
          client_secret: process.env.DISCORD_CLIENT_SECRET!,
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/discord`,
        }),
      });
      
      console.log('[CALLBACK-DEBUG] Token response status:', tokenResponse.status);
      
      if (tokenResponse.ok) {
        const tokenData = await tokenResponse.json();
        console.log('[CALLBACK-DEBUG] Token data received:', { 
          access_token: !!tokenData.access_token,
          token_type: tokenData.token_type,
          scope: tokenData.scope 
        });
        
        // Now get user info
        const userResponse = await fetch('https://discord.com/api/users/@me', {
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
          },
        });
        
        console.log('[CALLBACK-DEBUG] User response status:', userResponse.status);
        
        if (userResponse.ok) {
          const userData = await userResponse.json();
          console.log('[CALLBACK-DEBUG] User data:', {
            id: userData.id,
            username: userData.username,
            discriminator: userData.discriminator
          });
          
          return NextResponse.json({
            success: true,
            oauth_flow: 'working',
            user: {
              id: userData.id,
              username: userData.username,
              discriminator: userData.discriminator
            },
            token_exchange: 'successful',
            issue: 'OAuth works, problem is in NextAuth configuration'
          });
        } else {
          const errorText = await userResponse.text();
          return NextResponse.json({
            success: false,
            error: 'Failed to get user data',
            userResponseStatus: userResponse.status,
            userError: errorText
          });
        }
      } else {
        const errorText = await tokenResponse.text();
        console.error('[CALLBACK-DEBUG] Token exchange failed:', errorText);
        return NextResponse.json({
          success: false,
          error: 'Token exchange failed',
          tokenResponseStatus: tokenResponse.status,
          tokenError: errorText
        });
      }
    } catch (err) {
      console.error('[CALLBACK-DEBUG] Exception:', err);
      return NextResponse.json({
        success: false,
        error: 'Exception during token exchange',
        exception: err instanceof Error ? err.message : 'Unknown error'
      });
    }
  }
  
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    allParams: params,
    oauth: {
      hasCode: !!code,
      hasError: !!error,
      error: error,
      errorDescription: errorDescription,
      state: state
    },
    environment: {
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
      hasClientSecret: !!process.env.DISCORD_CLIENT_SECRET,
      hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET
    },
    message: code ? 'Has authorization code - OAuth flow initiated' : 'No authorization code - call this endpoint from Discord callback'
  });
}