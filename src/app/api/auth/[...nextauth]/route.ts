import NextAuth from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import { UserRole } from '@/types';

const handler = NextAuth({
  debug: true,
  secret: process.env.NEXTAUTH_SECRET,
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
    async jwt({ token, account, profile, user }) {
      console.log('[NextAuth JWT] Called with:', { 
        hasToken: !!token, 
        hasAccount: !!account, 
        hasProfile: !!profile, 
        hasUser: !!user,
        tokenSub: token?.sub 
      });
      
      if (account && profile) {
        console.log('[NextAuth JWT] First time login, setting up token');
        const discordProfile = profile as Record<string, unknown>;
        token.discordId = discordProfile.id as string;
        token.username = discordProfile.username as string;
        token.discriminator = discordProfile.discriminator as string;
        token.avatar = discordProfile.avatar as string;
        
        console.log('[NextAuth JWT] Discord profile:', {
          id: discordProfile.id,
          username: discordProfile.username
        });
        
        // Use existing bot to fetch roles
        try {
          console.log('[NextAuth JWT] Fetching roles for user:', discordProfile.id);
          
          const guildMemberResponse = await fetch(
            `https://discord.com/api/v10/guilds/${process.env.DISCORD_GUILD_ID}/members/${discordProfile.id}`,
            {
              headers: {
                Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`
              }
            }
          );
          
          console.log('[NextAuth JWT] Guild member response status:', guildMemberResponse.status);
          
          if (guildMemberResponse.ok) {
            const guildMember = await guildMemberResponse.json();
            console.log('[NextAuth JWT] Guild member roles:', guildMember.roles);
            
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
            console.log('[NextAuth JWT] Final user roles:', token.roles);
          } else {
            console.log('[NextAuth JWT] User not found in guild, assigning EMPLOYEE role');
            token.roles = ['EMPLOYEE'];
          }
        } catch (error) {
          console.error('[NextAuth JWT] Error fetching Discord roles:', error);
          token.roles = ['EMPLOYEE'];
        }
      }
      
      console.log('[NextAuth JWT] Returning token with sub:', token.sub);
      return token;
    },
    async session({ session, token }) {
      console.log('[NextAuth Session] Called with token sub:', token?.sub);
      
      if (token?.sub) {
        session.user.id = token.sub;
        session.user.discordId = token.discordId as string;
        session.user.username = token.username as string;
        session.user.discriminator = token.discriminator as string;
        session.user.avatar = token.avatar as string;
        session.user.roles = token.roles as UserRole[];
        
        console.log('[NextAuth Session] Returning session for user:', session.user.id);
      } else {
        console.log('[NextAuth Session] No token sub found');
      }
      
      return session;
    }
  },
  pages: {
    signIn: '/'
  },
  session: {
    strategy: 'jwt'
  },
  logger: {
    error(code, metadata) {
      console.error('NextAuth Error:', code, metadata);
    },
    warn(code) {
      console.warn('NextAuth Warning:', code);
    },
    debug(code, metadata) {
      console.log('NextAuth Debug:', code, metadata);
    }
  }
});

export { handler as GET, handler as POST };