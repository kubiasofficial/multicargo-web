import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(_request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('simple-session');
    
    if (!sessionCookie) {
      return NextResponse.json({ user: null });
    }
    
    const sessionData = JSON.parse(sessionCookie.value);
    
    // Check if session is expired
    if (new Date(sessionData.expires) < new Date()) {
      return NextResponse.json({ user: null });
    }
    
    return NextResponse.json(sessionData);
  } catch (error) {
    console.error('[SIMPLE-SESSION] Error:', error);
    return NextResponse.json({ user: null });
  }
}