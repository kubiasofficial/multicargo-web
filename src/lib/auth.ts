import { getServerSession } from 'next-auth';
import { UserRole } from '@/types';

// Discord role configuration
export const DISCORD_CONFIG = {
  DISPATCHER_CHANNEL_ID: '1418624695829532764',
  ACTIVE_RIDES_CHANNEL_ID: '1419230177585528842',
  ADMIN_ROLE_ID: '1418603886218051635',
  EMPLOYEE_ROLE_ID: '1418604088693882900',
  STROJVUDCE_ROLE_ID: '1418875308811223123',
  VYPRAVCI_ROLE_ID: '1418875376855158825'
} as const;

// Role hierarchy for permissions
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  'ADMIN': 4,
  'VYPRAVCI': 3,
  'EMPLOYEE': 2,
  'STROJVUDCE': 1
};

// Get current session
export async function getCurrentSession() {
  return await getServerSession();
}

// Check if user has required role
export function hasRole(userRoles: UserRole[], requiredRole: UserRole): boolean {
  if (!userRoles || userRoles.length === 0) return false;
  
  const userMaxLevel = Math.max(...userRoles.map(role => ROLE_HIERARCHY[role] || 0));
  const requiredLevel = ROLE_HIERARCHY[requiredRole] || 0;
  
  return userMaxLevel >= requiredLevel;
}

// Check if user has any of the required roles
export function hasAnyRole(userRoles: UserRole[], requiredRoles: UserRole[]): boolean {
  if (!userRoles || userRoles.length === 0) return false;
  
  return requiredRoles.some(role => userRoles.includes(role));
}

// Check if user is admin
export function isAdmin(userRoles: UserRole[]): boolean {
  return hasRole(userRoles, 'ADMIN');
}

// Check if user can dispatch rides
export function canDispatch(userRoles: UserRole[]): boolean {
  return hasAnyRole(userRoles, ['ADMIN', 'VYPRAVCI']);
}

// Check if user can take rides
export function canTakeRides(userRoles: UserRole[]): boolean {
  return hasAnyRole(userRoles, ['STROJVUDCE', 'EMPLOYEE', 'ADMIN']);
}

// Check if user can manage users
export function canManageUsers(userRoles: UserRole[]): boolean {
  return hasRole(userRoles, 'ADMIN');
}

// Format Discord username
export function formatDiscordUsername(username: string, discriminator: string): string {
  return `${username}#${discriminator}`;
}

// Get Discord avatar URL
export function getDiscordAvatarUrl(userId: string, avatar?: string): string {
  if (!avatar) {
    // Default Discord avatar
    return `https://cdn.discordapp.com/embed/avatars/${parseInt(userId) % 5}.png`;
  }
  
  const format = avatar.startsWith('a_') ? 'gif' : 'png';
  return `https://cdn.discordapp.com/avatars/${userId}/${avatar}.${format}?size=128`;
}

// Create progress bar representation
export function createProgressBar(current: number, total: number, length: number = 20): string {
  const percentage = Math.min(current / total, 1);
  const filled = Math.round(percentage * length);
  const empty = length - filled;
  
  const filledBar = '█'.repeat(filled);
  const emptyBar = '░'.repeat(empty);
  
  return `${filledBar}${emptyBar}`;
}

// Calculate user level based on points
export function calculateLevel(points: number): number {
  // Simple level calculation: every 100 points = 1 level
  return Math.floor(points / 100) + 1;
}

// Calculate points needed for next level
export function pointsToNextLevel(points: number): number {
  const currentLevel = calculateLevel(points);
  const pointsForNextLevel = currentLevel * 100;
  return pointsForNextLevel - points;
}

// Format time duration
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
}

// Check if ride is overdue
export function isRideOverdue(departureTime: Date): boolean {
  const now = new Date();
  const bufferTime = 15; // 15 minutes buffer
  
  return now.getTime() > (departureTime.getTime() + bufferTime * 60 * 1000);
}

// Get role display name in Czech
export function getRoleDisplayName(role: UserRole): string {
  const roleNames: Record<UserRole, string> = {
    'ADMIN': 'Administrátor',
    'VYPRAVCI': 'Výpravčí',
    'EMPLOYEE': 'Zaměstnanec',
    'STROJVUDCE': 'Strojvůdce'
  };
  
  return roleNames[role] || role;
}

// Get role color for UI
export function getRoleColor(role: UserRole): string {
  const roleColors: Record<UserRole, string> = {
    'ADMIN': 'text-red-500',
    'VYPRAVCI': 'text-blue-500',
    'EMPLOYEE': 'text-green-500',
    'STROJVUDCE': 'text-yellow-500'
  };
  
  return roleColors[role] || 'text-gray-500';
}