import NextAuth from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import { UserRole } from '@/types';

const handler = NextAuth({
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'identify email'
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        const discordProfile = profile as Record<string, unknown>;
        token.discordId = discordProfile.id as string;
        token.username = discordProfile.username as string;
        token.discriminator = discordProfile.discriminator as string;
        token.avatar = discordProfile.avatar as string;
        
        // Use existing bot to fetch roles
        try {
          console.log('Fetching roles for user:', discordProfile.id);
          
          const guildMemberResponse = await fetch(
            `https://discord.com/api/v10/guilds/${process.env.DISCORD_GUILD_ID}/members/${discordProfile.id}`,
            {
              headers: {
                Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`
              }
            }
          );
          
          if (guildMemberResponse.ok) {
            const guildMember = await guildMemberResponse.json();
            const userRoles: UserRole[] = [];
            
            // Check for specific roles
            if (guildMember.roles.includes(process.env.DISCORD_ADMIN_ROLE_ID)) {
              userRoles.push('ADMIN');
            }
            if (guildMember.roles.includes(process.env.DISCORD_EMPLOYEE_ROLE_ID)) {
              userRoles.push('EMPLOYEE');
            }
            if (guildMember.roles.includes(process.env.DISCORD_STROJVUDCE_ROLE_ID)) {
              userRoles.push('STROJVUDCE');
            }
            if (guildMember.roles.includes(process.env.DISCORD_VYPRAVCI_ROLE_ID)) {
              userRoles.push('VYPRAVCI');
            }
            
            // If no specific roles, give default EMPLOYEE
            token.roles = userRoles.length > 0 ? userRoles : ['EMPLOYEE'];
          } else {
            console.log('User not found in guild, assigning EMPLOYEE role');
            token.roles = ['EMPLOYEE'];
          }
        } catch (error) {
          console.error('Error fetching Discord roles:', error);
          token.roles = ['EMPLOYEE'];
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.sub!;
      session.user.discordId = token.discordId as string;
      session.user.username = token.username as string;
      session.user.discriminator = token.discriminator as string;
      session.user.avatar = token.avatar as string;
      session.user.roles = token.roles as UserRole[];
      
      return session;
    }
  },
  pages: {
    signIn: '/'
  },
  session: {
    strategy: 'jwt'
  }
});

export { handler as GET, handler as POST };