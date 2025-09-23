'use client';

import { useSession, signIn } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import Dashboard from '@/components/Dashboard';

export default function Home() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return; // Still loading
    
    if (session) {
      // User is signed in, redirect to dashboard
      redirect('/dashboard');
    }
  }, [session, status]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (session) {
    return <Dashboard />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Section */}
          <div className="mb-12">
            <div className="text-6xl mb-6">🚂</div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              MultiCargo
            </h1>
            <p className="text-xl md:text-2xl text-blue-200 mb-8 max-w-3xl mx-auto">
              Moderní webová aplikace pro správu železničních jízd s real-time sledováním a Discord integrací
            </p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
              <div className="text-3xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Live Dashboard</h3>
              <p className="text-blue-200">
                Sledujte své jízdy v reálném čase s pokročilými statistikami a progress bary
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
              <div className="text-3xl mb-4">🔗</div>
              <h3 className="text-xl font-semibold mb-2">Discord Integrace</h3>
              <p className="text-blue-200">
                Přihlášení přes Discord s automatickou synchronizací rolí a dat z botu
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2">Role Management</h3>
              <p className="text-blue-200">
                Pokročilé řízení přístupů pro Strojvůdce, Výpravčí, Zaměstnance a Administrátory
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <p className="text-blue-200 mb-6">
              Připojte se k MultiCargo týmu a začněte efektivně spravovat vaše železniční jízdy
            </p>
            <button
              onClick={() => signIn('discord', { callbackUrl: '/dashboard' })}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center gap-3 mx-auto"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              Přihlásit přes Discord
            </button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-white">50+</div>
              <div className="text-blue-200">Aktivních uživatelů</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">200+</div>
              <div className="text-blue-200">Dokončených jízd</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">99%</div>
              <div className="text-blue-200">Úspěšnost</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">24/7</div>
              <div className="text-blue-200">Monitoring</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
