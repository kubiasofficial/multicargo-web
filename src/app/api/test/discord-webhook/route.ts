import { NextRequest, NextResponse } from 'next/server';
import { testDiscordWebhook } from '@/lib/discord';

export async function GET(_request: NextRequest) {
  try {
    console.log('Testing Discord webhook...');
    
    const success = await testDiscordWebhook();
    
    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Discord webhook test úspěšný!',
        timestamp: new Date().toISOString()
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Discord webhook test selhal',
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error testing Discord webhook:', error);
    return NextResponse.json({
      success: false,
      error: 'Neočekávaná chyba při testování Discord webhook',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function POST(_request: NextRequest) {
  try {
    // Můžete také testovat s vlastní zprávou
    const { sendRideStartNotification } = await import('@/lib/discord');
    
    const success = await sendRideStartNotification(
      'Test Uživatel',
      'TEST-123',
      'Test Stanice → Cílová Stanice',
      'https://example.com/test-train.jpg'
    );
    
    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Test ride start notification odeslána úspěšně!',
        timestamp: new Date().toISOString()
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Nepodařilo se odeslat test ride start notification',
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error sending test ride notification:', error);
    return NextResponse.json({
      success: false,
      error: 'Neočekávaná chyba při odesílání test notifikace',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}