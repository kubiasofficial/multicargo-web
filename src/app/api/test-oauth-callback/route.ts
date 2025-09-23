import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  
  console.log('[OAUTH-TEST] Callback received');
  console.log('[OAUTH-TEST] All search params:', Object.fromEntries(searchParams.entries()));
  console.log('[OAUTH-TEST] Headers:', Object.fromEntries(request.headers.entries()));
  
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const state = searchParams.get('state');
  
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    received: {
      code: code ? `${code.substring(0, 10)}...` : null,
      error: error,
      state: state,
      allParams: Object.fromEntries(searchParams.entries())
    },
    nextStep: code ? 'Should exchange code for token' : 'Error or missing code'
  });
}