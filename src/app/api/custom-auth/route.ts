import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  
  if (error) {
    console.error('[CUSTOM-AUTH] OAuth error:', error);
    return NextResponse.redirect(new URL('/?error=oauth_error', request.url));
  }
  
  if (!code) {
    console.error('[CUSTOM-AUTH] No authorization code received');
    return NextResponse.redirect(new URL('/?error=no_code', request.url));
  }
  
  try {
    console.log('[CUSTOM-AUTH] Starting token exchange...');
    console.log('[CUSTOM-AUTH] Environment check:', {
      hasClientId: !!process.env.DISCORD_CLIENT_ID,
      hasClientSecret: !!process.env.DISCORD_CLIENT_SECRET,
      hasGuildId: !!process.env.DISCORD_GUILD_ID,
      hasBotToken: !!process.env.DISCORD_BOT_TOKEN
    });
    
    // Exchange code for token
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
        redirect_uri: `${new URL(request.url).origin}/api/custom-auth`,
      }),
    });
    
    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('[CUSTOM-AUTH] Token exchange failed:', errorText);
      return NextResponse.redirect(new URL('/?error=token_exchange_failed', request.url));
    }
    
    const tokenData = await tokenResponse.json();
    console.log('[CUSTOM-AUTH] Token exchange successful');
    
    // Get user info
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });
    
    if (!userResponse.ok) {
      const errorText = await userResponse.text();
      console.error('[CUSTOM-AUTH] User fetch failed:', errorText);
      return NextResponse.redirect(new URL('/?error=user_fetch_failed', request.url));
    }
    
    const userData = await userResponse.json();
    console.log('[CUSTOM-AUTH] User data received for:', userData.username);
    
    // Get guild member info (roles)
    let roles = ['EMPLOYEE']; // default
    try {
      const memberResponse = await fetch(
        `https://discord.com/api/v10/guilds/${process.env.DISCORD_GUILD_ID}/members/${userData.id}`,
        {
          headers: {
            Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
          },
        }
      );
      
      if (memberResponse.ok) {
        const memberData = await memberResponse.json();
        console.log('[CUSTOM-AUTH] Member data received, roles:', memberData.roles);
        
        roles = [];
        
        if (memberData.roles.includes(process.env.DISCORD_ADMIN_ROLE_ID)) {
          roles.push('ADMIN');
        }
        if (memberData.roles.includes(process.env.DISCORD_EMPLOYEE_ROLE_ID)) {
          roles.push('EMPLOYEE');
        }
        if (memberData.roles.includes(process.env.DISCORD_STROJVUDCE_ROLE_ID)) {
          roles.push('STROJVUDCE');
        }
        if (memberData.roles.includes(process.env.DISCORD_VYPRAVCI_ROLE_ID)) {
          roles.push('VYPRAVCI');
        }
        
        if (roles.length === 0) roles = ['EMPLOYEE'];
        console.log('[CUSTOM-AUTH] Mapped roles:', roles);
      } else {
        console.log('[CUSTOM-AUTH] Member not found in guild, using default role');
      }
    } catch (roleError) {
      console.error('[CUSTOM-AUTH] Error fetching roles:', roleError);
    }
    
    // Create session data
    const sessionData = {
      user: {
        id: userData.id,
        username: userData.username,
        discriminator: userData.discriminator,
        avatar: userData.avatar,
        roles: roles
      },
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };
    
    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('custom-session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/'
    });
    
    console.log('[CUSTOM-AUTH] Successfully authenticated user:', userData.username);
    
    return NextResponse.redirect(new URL('/dashboard', request.url));
    
  } catch (error) {
    console.error('[CUSTOM-AUTH] Authentication error:', error);
    return NextResponse.redirect(new URL('/?error=auth_failed', request.url));
  }
}