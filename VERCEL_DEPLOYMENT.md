# Vercel Deployment Guide pro MultiCargo

## 🚀 Nasazení na Vercel

### 1. Příprava před deploymentem

1. **Dokončit Firebase setup** (získat apiKey a appId)
2. **Vygenerovat NEXTAUTH_SECRET**:
   ```bash
   openssl rand -base64 32
   ```

### 2. Deployment na Vercel

1. **Přejděte na [vercel.com](https://vercel.com)**
2. **Přihlaste se pomocí GitHub/GitLab**
3. **Import Git Repository** nebo **Deploy from folder**

### 3. Environment Variables na Vercel

V Vercel dashboard → Settings → Environment Variables přidejte:

```env
# NextAuth Configuration
NEXTAUTH_URL=https://vase-domena.vercel.app
NEXTAUTH_SECRET=vas-vygenerovany-secret

# Discord OAuth Configuration
DISCORD_CLIENT_ID=1389861261260492921
DISCORD_CLIENT_SECRET=9aBvy6Kd-0JR-7I6NxNJrUI__14HwZUH

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=vas-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=multicargo-33b1.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=multicargo-33b1
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=multicargo-33b1.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=434293134586
NEXT_PUBLIC_FIREBASE_APP_ID=vas-app-id

# Discord Bot Configuration
DISCORD_BOT_TOKEN=your-discord-bot-token
DISCORD_GUILD_ID=your-discord-guild-id

# Discord Channel IDs
DISCORD_DISPATCHER_CHANNEL_ID=1418624695829532764
DISCORD_ACTIVE_RIDES_CHANNEL_ID=1419230177585528842

# Discord Role IDs
DISCORD_ADMIN_ROLE_ID=1418603886218051635
DISCORD_EMPLOYEE_ROLE_ID=1418604088693882900
DISCORD_STROJVUDCE_ROLE_ID=1418875308811223123
DISCORD_VYPRAVCI_ROLE_ID=1418875376855158825
```

### 4. Discord OAuth - aktualizace redirect URL

V Discord Developer Portal → OAuth2:
- Přidejte: `https://vase-domena.vercel.app/api/auth/callback/discord`

### 5. Firebase Security Rules pro produkci

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read and write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /rides/{rideId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (request.auth.token.roles.hasAny(['ADMIN', 'VYPRAVCI']) || 
         resource.data.assignedUserId == request.auth.uid);
    }
    
    match /userStats/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (request.auth.token.roles.hasAny(['ADMIN']) || request.auth.uid == userId);
    }
    
    match /liveTracking/{rideId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        request.auth.token.roles.hasAny(['ADMIN', 'STROJVUDCE', 'EMPLOYEE']);
    }
  }
}
```

### 6. Automatický deployment workflow

Vercel automaticky:
- Builduje při každém push do main/master branch
- Vytváří preview pro pull requesty
- Invaliduje cache při změnách

### 7. Custom doména (volitelné)

V Vercel → Settings → Domains:
- Přidejte vlastní doménu
- Aktualizujte `NEXTAUTH_URL` a Discord OAuth redirect URL

---

## ⚡ Pro rychlý start:

1. Získejte Firebase `apiKey` a `appId`
2. Vygenerujte `NEXTAUTH_SECRET` 
3. Pushněte kód na GitHub
4. Připojte GitHub repo k Vercelu
5. Nastavte environment variables

**Aplikace bude dostupná na: `https://multicargo-web.vercel.app`**