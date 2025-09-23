// Discord webhook integration for MultiCargo
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
const DISCORD_CHANNEL_ID = '1418624695829532764';

export interface DiscordEmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

export interface DiscordEmbed {
  title: string;
  description?: string;
  color: number;
  fields?: DiscordEmbedField[];
  timestamp?: string;
  footer?: {
    text: string;
  };
  thumbnail?: {
    url: string;
  };
}

export interface DiscordWebhookPayload {
  username?: string;
  avatar_url?: string;
  content?: string;
  embeds?: DiscordEmbed[];
}

/**
 * Send ride start notification to Discord
 */
export async function sendRideStartNotification(
  userName: string,
  trainNumber: string,
  route: string,
  trainImage?: string
): Promise<boolean> {
  const embed: DiscordEmbed = {
    title: '🚂 Nová jízda začala!',
    description: `Strojvedoucí **${userName}** začal jízdu vlaku **${trainNumber}**`,
    color: 0x00ff00, // Green
    fields: [
      {
        name: '🚂 Vlak',
        value: trainNumber,
        inline: true
      },
      {
        name: '🛤️ Trasa',
        value: route,
        inline: true
      },
      {
        name: '👤 Strojvedoucí',
        value: userName,
        inline: true
      },
      {
        name: '⏰ Čas zahájení',
        value: new Date().toLocaleString('cs-CZ'),
        inline: false
      }
    ],
    timestamp: new Date().toISOString(),
    footer: {
      text: 'MultiCargo - Správa jízd'
    }
  };

  if (trainImage) {
    embed.thumbnail = {
      url: trainImage
    };
  }

  return await sendDiscordWebhook({
    username: 'MultiCargo Bot',
    embeds: [embed]
  });
}

/**
 * Send ride end notification to Discord
 */
export async function sendRideEndNotification(
  userName: string,
  trainNumber: string,
  route: string,
  duration: number,
  delay: number,
  trainImage?: string
): Promise<boolean> {
  const embed: DiscordEmbed = {
    title: '🏁 Jízda dokončena!',
    description: `Strojvedoucí **${userName}** dokončil jízdu vlaku **${trainNumber}**`,
    color: delay > 5 ? 0xff9900 : 0x00ff00, // Orange if delayed, green if on time
    fields: [
      {
        name: '🚂 Vlak',
        value: trainNumber,
        inline: true
      },
      {
        name: '🛤️ Trasa',
        value: route,
        inline: true
      },
      {
        name: '👤 Strojvedoucí',
        value: userName,
        inline: true
      },
      {
        name: '⏱️ Doba jízdy',
        value: `${Math.floor(duration / 60)}h ${duration % 60}m`,
        inline: true
      },
      {
        name: delay > 0 ? '⚠️ Zpoždění' : '✅ Bez zpoždění',
        value: delay > 0 ? `${delay} minut` : 'Přesně na čas',
        inline: true
      },
      {
        name: '⏰ Čas dokončení',
        value: new Date().toLocaleString('cs-CZ'),
        inline: false
      }
    ],
    timestamp: new Date().toISOString(),
    footer: {
      text: 'MultiCargo - Správa jízd'
    }
  };

  if (trainImage) {
    embed.thumbnail = {
      url: trainImage
    };
  }

  return await sendDiscordWebhook({
    username: 'MultiCargo Bot',
    embeds: [embed]
  });
}

/**
 * Send emergency/incident notification to Discord
 */
export async function sendIncidentNotification(
  userName: string,
  trainNumber: string,
  incidentType: string,
  description: string
): Promise<boolean> {
  const embed: DiscordEmbed = {
    title: '⚠️ Incident během jízdy!',
    description: `Nahlášen incident během jízdy vlaku **${trainNumber}**`,
    color: 0xff0000, // Red
    fields: [
      {
        name: '🚂 Vlak',
        value: trainNumber,
        inline: true
      },
      {
        name: '👤 Strojvedoucí',
        value: userName,
        inline: true
      },
      {
        name: '🚨 Typ incidentu',
        value: incidentType,
        inline: true
      },
      {
        name: '📝 Popis',
        value: description || 'Bez dalších podrobností',
        inline: false
      },
      {
        name: '⏰ Čas nahlášení',
        value: new Date().toLocaleString('cs-CZ'),
        inline: false
      }
    ],
    timestamp: new Date().toISOString(),
    footer: {
      text: 'MultiCargo - Systém incidentů'
    }
  };

  return await sendDiscordWebhook({
    username: 'MultiCargo Alert',
    embeds: [embed]
  });
}

/**
 * Send Discord webhook message
 */
async function sendDiscordWebhook(payload: DiscordWebhookPayload): Promise<boolean> {
  try {
    if (!DISCORD_WEBHOOK_URL) {
      console.warn('Discord webhook URL not configured');
      return false;
    }

    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error('Discord webhook failed:', response.status, response.statusText);
      return false;
    }

    console.log('Discord notification sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending Discord webhook:', error);
    return false;
  }
}

/**
 * Test Discord webhook connection
 */
export async function testDiscordWebhook(): Promise<boolean> {
  return await sendDiscordWebhook({
    username: 'MultiCargo Test',
    content: '🧪 Test zpráva z MultiCargo systému',
    embeds: [{
      title: 'Test notifikace',
      description: 'Pokud vidíte tuto zprávu, Discord integrace funguje správně!',
      color: 0x0099ff,
      timestamp: new Date().toISOString(),
      footer: {
        text: 'MultiCargo - Test systému'
      }
    }]
  });
}

export default {
  sendRideStartNotification,
  sendRideEndNotification,
  sendIncidentNotification,
  testDiscordWebhook
};