import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  
  if (error) {
    console.error('[SIMPLE-AUTH] OAuth error:', error);
    return NextResponse.redirect(new URL('/?error=oauth_error', request.url));
  }
  
  if (!code) {
    console.error('[SIMPLE-AUTH] No authorization code received');
    return NextResponse.redirect(new URL('/?error=no_code', request.url));
  }
  
  try {
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
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/simple-auth`,
      }),
    });
    
    if (!tokenResponse.ok) {
      throw new Error(`Token exchange failed: ${tokenResponse.status}`);
    }
    
    const tokenData = await tokenResponse.json();
    
    // Get user info
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });
    
    if (!userResponse.ok) {
      throw new Error(`User fetch failed: ${userResponse.status}`);
    }
    
    const userData = await userResponse.json();
    
    // Get guild member info (roles)
    const memberResponse = await fetch(
      `https://discord.com/api/v10/guilds/${process.env.DISCORD_GUILD_ID}/members/${userData.id}`,
      {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        },
      }
    );
    
    let roles = ['EMPLOYEE']; // default
    if (memberResponse.ok) {
      const memberData = await memberResponse.json();
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
    }
    
    // Create simple session
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
    cookieStore.set('simple-session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 // 30 days
    });
    
    console.log('[SIMPLE-AUTH] Successfully authenticated user:', userData.username);
    
    return NextResponse.redirect(new URL('/simple-dashboard', request.url));
    
  } catch (error) {
    console.error('[SIMPLE-AUTH] Authentication error:', error);
    return NextResponse.redirect(new URL('/?error=auth_failed', request.url));
  }
}