'use client';

import { useEffect, useState } from 'react';

interface SimpleSession {
  user: {
    id: string;
    username: string;
    discriminator: string;
    avatar: string;
    roles: string[];
  };
  expires: string;
}

export default function SimpleDashboard() {
  const [session, setSession] = useState<SimpleSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for simple session
    fetch('/api/simple-session')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setSession(data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Nejste přihlášeni</h1>
          <a 
            href="https://discord.com/oauth2/authorize?client_id=1418589810012196946&response_type=code&redirect_uri=https://multicargo-web.vercel.app/api/simple-auth&scope=identify%20email"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
          >
            Přihlásit přes Discord (Simple)
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Simple Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {session.user.username}#{session.user.discriminator}
              </span>
              <button
                onClick={() => {
                  document.cookie = 'simple-session=; Max-Age=0; path=/';
                  window.location.href = '/';
                }}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Odhlásit
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium mb-4">Informace o uživateli</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <dt className="text-sm font-medium text-gray-500">Discord ID</dt>
                <dd className="mt-1 text-sm text-gray-900">{session.user.id}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Uživatelské jméno</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {session.user.username}#{session.user.discriminator}
                </dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Role</dt>
                <dd className="mt-1">
                  <div className="flex flex-wrap gap-2">
                    {session.user.roles.map((role, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Session platná do</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(session.expires).toLocaleString('cs-CZ')}
                </dd>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4 text-green-600">
                🎉 Gratulujeme! Discord OAuth funguje perfektně!
              </h3>
              <p className="text-sm text-gray-600">
                Tento jednoduchý auth systém úspěšně získal vaše Discord údaje a role. 
                Nyní můžeme opravit NextAuth konfiguraci na základě tohoto fungujícího příkladu.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}