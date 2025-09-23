import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(_request: NextRequest) {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('custom-session');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[CUSTOM-LOGOUT] Error:', error);
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
  }
}