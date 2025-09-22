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
        
        // Temporarily skip role fetching to test basic auth
        console.log('Basic Discord auth successful for user:', discordProfile.username);
        token.roles = ['EMPLOYEE']; // Default role for now
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