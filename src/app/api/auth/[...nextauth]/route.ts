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
          scope: 'identify email guilds guilds.members.read'
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
        
        // Fetch user roles from Discord Guild
        try {
          console.log('Fetching guild member for user:', discordProfile.id);
          console.log('Guild ID:', process.env.DISCORD_GUILD_ID);
          console.log('Bot token exists:', !!process.env.DISCORD_BOT_TOKEN);
          
          const guildMemberResponse = await fetch(
            `https://discord.com/api/v10/guilds/${process.env.DISCORD_GUILD_ID}/members/${discordProfile.id}`,
            {
              headers: {
                Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`
              }
            }
          );
          
          console.log('Guild member response status:', guildMemberResponse.status);
          
          if (guildMemberResponse.ok) {
            const guildMember = await guildMemberResponse.json();
            console.log('Guild member roles:', guildMember.roles);
            
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
            
            token.roles = userRoles;
            console.log('Assigned roles:', userRoles);
          } else {
            console.log('Failed to fetch guild member, response:', await guildMemberResponse.text());
            token.roles = ['EMPLOYEE']; // Default role if can't fetch from Discord
          }
        } catch (error) {
          console.error('Error fetching Discord guild member:', error);
          token.roles = ['EMPLOYEE']; // Default role if error occurs
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
    signIn: '/',
    error: '/auth/error'
  },
  session: {
    strategy: 'jwt'
  }
});

export { handler as GET, handler as POST };