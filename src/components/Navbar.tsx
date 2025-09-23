'use client';

import { useAuth } from '@/contexts/AuthContext';
import { 
  UserIcon, 
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
  HomeIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { getDiscordAvatarUrl, getRoleDisplayName, formatDiscordUsername } from '@/lib/auth';
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  const { user, loading, signIn, signOut } = useAuth();

  return (
    <nav className="bg-gray-900 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and main navigation */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-white">
                🚂 MultiCargo
              </div>
            </Link>
            
            {user && (
              <div className="hidden md:flex items-center space-x-6">
                <Link 
                  href="/dashboard" 
                  className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors"
                >
                  <HomeIcon className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
                
                <Link 
                  href="/rides" 
                  className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors"
                >
                  <ChartBarIcon className="h-5 w-5" />
                  <span>Jízdy</span>
                </Link>
                
                {user.roles.includes('ADMIN') && (
                  <Link 
                    href="/admin" 
                    className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors"
                  >
                    <Cog6ToothIcon className="h-5 w-5" />
                    <span>Admin</span>
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* User section */}
          <div className="flex items-center">
            {loading ? (
              <div className="animate-pulse">
                <div className="h-8 w-8 bg-gray-600 rounded-full"></div>
              </div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                {/* User info */}
                <div className="hidden md:flex items-center space-x-3">
                  <div className="relative">
                    <Image
                      src={getDiscordAvatarUrl(user.discordId, user.avatar)}
                      alt="Avatar"
                      width={32}
                      height={32}
                      className="rounded-full"
                      onError={(e) => {
                        console.error('Avatar failed to load:', getDiscordAvatarUrl(user.discordId, user.avatar));
                        // Fallback to default Discord avatar
                        const target = e.target as HTMLImageElement;
                        target.src = `https://cdn.discordapp.com/embed/avatars/${parseInt(user.discordId) % 5}.png`;
                      }}
                    />
                    <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 border-2 border-gray-900 rounded-full"></div>
                  </div>
                  
                  <div className="text-sm">
                    <div className="text-white font-medium">
                      {formatDiscordUsername(user.username, user.discriminator)}
                    </div>
                    <div className="text-gray-400">
                      {user.roles.map(role => getRoleDisplayName(role as any)).join(', ')}
                    </div>
                  </div>
                </div>

                {/* Sign out button */}
                <button
                  onClick={signOut}
                  className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Odhlásit</span>
                </button>
              </div>
            ) : (
              <button
                onClick={signIn}
                className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <ArrowLeftOnRectangleIcon className="h-4 w-4" />
                <span>Přihlásit přes Discord</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}