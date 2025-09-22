'use client';

import { useSession } from 'next-auth/react';
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
