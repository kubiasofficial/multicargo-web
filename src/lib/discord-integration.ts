// Discord Bot Integration Helper
// This file contains functions to help Discord bot communicate with the web app

import { DISCORD_CONFIG } from './auth';

// Discord Bot Web App Integration Class
export class DiscordWebAppIntegration {
  private webAppUrl: string;
  private botToken: string;

  constructor(webAppUrl: string = 'http://localhost:3000', botToken?: string) {
    this.webAppUrl = webAppUrl;
    this.botToken = botToken || process.env.DISCORD_BOT_TOKEN || '';
  }

  // Sync Discord bot data to web app
  async syncDataToWebApp(aktivniJizdy: Map<string, any>, dokonceneJizdy: Map<string, any[]>, userStats: Map<string, any>): Promise<boolean> {
    try {
      const response = await fetch(`${this.webAppUrl}/api/discord/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.botToken}`
        },
        body: JSON.stringify({
          type: 'SYNC_DATA',
          data: {
            aktivniJizdy: Object.fromEntries(aktivniJizdy),
            dokonceneJizdy: Object.fromEntries(dokonceneJizdy),
            userStats: Object.fromEntries(userStats)
          }
        })
      });

      const result = await response.json();
      
      if (response.ok) {
        console.log('✅ Data synced to web app successfully');
        return true;
      } else {
        console.error('❌ Failed to sync data to web app:', result.error);
        return false;
      }
    } catch (error) {
      console.error('❌ Error syncing data to web app:', error);
      return false;
    }
  }

  // Update specific ride in web app
  async updateRideInWebApp(rideId: string, updateData: any): Promise<boolean> {
    try {
      const response = await fetch(`${this.webAppUrl}/api/discord/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.botToken}`
        },
        body: JSON.stringify({
          type: 'RIDE_UPDATE',
          data: {
            rideId,
            updateData
          }
        })
      });

      return response.ok;
    } catch (error) {
      console.error('❌ Error updating ride in web app:', error);
      return false;
    }
  }

  // Update user stats in web app
  async updateUserStatsInWebApp(userId: string, stats: any): Promise<boolean> {
    try {
      const response = await fetch(`${this.webAppUrl}/api/discord/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.botToken}`
        },
        body: JSON.stringify({
          type: 'USER_STATS_UPDATE',
          data: {
            userId,
            stats
          }
        })
      });

      return response.ok;
    } catch (error) {
      console.error('❌ Error updating user stats in web app:', error);
      return false;
    }
  }

  // Get web app configuration
  async getWebAppConfig(): Promise<any | null> {
    try {
      const response = await fetch(`${this.webAppUrl}/api/discord/sync`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.botToken}`
        }
      });

      if (response.ok) {
        return await response.json();
      } else {
        console.error('❌ Failed to get web app config');
        return null;
      }
    } catch (error) {
      console.error('❌ Error getting web app config:', error);
      return null;
    }
  }
}

// Helper functions for Discord bot compatibility
export const DiscordBotHelpers = {
  // Create progress bar (replicate Discord bot function)
  createProgressBar(current: number, total: number, length: number = 20): string {
    const percentage = Math.min(current / total, 1);
    const filled = Math.round(percentage * length);
    const empty = length - filled;
    
    const filledBar = '█'.repeat(filled);
    const emptyBar = '░'.repeat(empty);
    
    return `${filledBar}${emptyBar} ${Math.round(percentage * 100)}%`;
  },

  // Format time for Discord
  formatTimeForDiscord(date: Date): string {
    return `<t:${Math.floor(date.getTime() / 1000)}:t>`;
  },

  // Format relative time for Discord
  formatRelativeTimeForDiscord(date: Date): string {
    return `<t:${Math.floor(date.getTime() / 1000)}:R>`;
  },

  // Calculate ride duration
  calculateRideDuration(departure: Date, arrival: Date): number {
    return Math.round((arrival.getTime() - departure.getTime()) / (1000 * 60)); // minutes
  },

  // Check if ride is overdue
  isRideOverdue(departureTime: Date, bufferMinutes: number = 15): boolean {
    const now = new Date();
    const overdueTime = new Date(departureTime.getTime() + bufferMinutes * 60 * 1000);
    return now > overdueTime;
  },

  // Get ride status emoji
  getRideStatusEmoji(status: string): string {
    const statusEmojis: Record<string, string> = {
      'PENDING': '⏳',
      'ASSIGNED': '👤',
      'IN_PROGRESS': '🚂',
      'COMPLETED': '✅',
      'CANCELLED': '❌',
      'DELAYED': '⚠️'
    };
    
    return statusEmojis[status] || '❓';
  },

  // Get priority emoji
  getPriorityEmoji(priority: string): string {
    const priorityEmojis: Record<string, string> = {
      'LOW': '🟢',
      'NORMAL': '🟡',
      'HIGH': '🟠',
      'URGENT': '🔴'
    };
    
    return priorityEmojis[priority] || '⚪';
  },

  // Format ride info for Discord embed
  formatRideForDiscord(ride: any): any {
    return {
      title: `${this.getRideStatusEmoji(ride.status)} ${ride.trainNumber}`,
      description: ride.route,
      fields: [
        {
          name: '⏰ Odjezd',
          value: this.formatTimeForDiscord(new Date(ride.departure.time)),
          inline: true
        },
        {
          name: '🎯 Příjezd',
          value: this.formatTimeForDiscord(new Date(ride.arrival.time)),
          inline: true
        },
        {
          name: '📊 Priorita',
          value: `${this.getPriorityEmoji(ride.priority)} ${ride.priority}`,
          inline: true
        }
      ],
      color: this.getStatusColor(ride.status),
      timestamp: new Date(ride.createdAt).toISOString()
    };
  },

  // Get status color for Discord embeds
  getStatusColor(status: string): number {
    const statusColors: Record<string, number> = {
      'PENDING': 0xFFD700,    // Gold
      'ASSIGNED': 0x1E90FF,   // DodgerBlue
      'IN_PROGRESS': 0x32CD32, // LimeGreen
      'COMPLETED': 0x90EE90,  // LightGreen
      'CANCELLED': 0xFF6347,  // Tomato
      'DELAYED': 0xFF8C00     // DarkOrange
    };
    
    return statusColors[status] || 0x808080; // Gray
  }
};

// Configuration constants matching Discord bot
export const DISCORD_BOT_CONFIG = {
  ...DISCORD_CONFIG,
  
  // Additional Discord bot specific settings
  UPDATE_INTERVAL: 5 * 60 * 1000, // 5 minutes in milliseconds
  OVERDUE_CHECK_INTERVAL: 1 * 60 * 1000, // 1 minute in milliseconds
  
  // Message templates
  TEMPLATES: {
    NEW_RIDE: (ride: any) => `🚂 **Nová jízda k dispozici!**\n\n**Vlak:** ${ride.trainNumber}\n**Trasa:** ${ride.route}\n**Odjezd:** ${DiscordBotHelpers.formatTimeForDiscord(new Date(ride.departure.time))}\n**Priorita:** ${DiscordBotHelpers.getPriorityEmoji(ride.priority)} ${ride.priority}`,
    
    RIDE_ASSIGNED: (ride: any, user: any) => `👤 **Jízda přiřazena!**\n\n**Vlak:** ${ride.trainNumber}\n**Strojvůdce:** <@${user.discordId}>\n**Odjezd:** ${DiscordBotHelpers.formatTimeForDiscord(new Date(ride.departure.time))}`,
    
    RIDE_COMPLETED: (ride: any, user: any) => `✅ **Jízda dokončena!**\n\n**Vlak:** ${ride.trainNumber}\n**Strojvůdce:** <@${user.discordId}>\n**Trasa:** ${ride.route}`,
    
    RIDE_OVERDUE: (ride: any) => `⚠️ **Zpožděná jízda!**\n\n**Vlak:** ${ride.trainNumber}\n**Měl odjet:** ${DiscordBotHelpers.formatRelativeTimeForDiscord(new Date(ride.departure.time))}\n**Status:** Kontaktujte dispečink`
  }
};

// Export for Discord bot usage
export default {
  DiscordWebAppIntegration,
  DiscordBotHelpers,
  DISCORD_BOT_CONFIG
};