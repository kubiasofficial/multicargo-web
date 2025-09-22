# MultiCargo Web - Setup & Konfigurace

## 🚀 Dokončení instalace

### 1. Environment Variables (.env.local)
Vyplňte skutečné hodnoty v `.env.local`:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=vygenerujte-nahodny-32-znakovy-retezec

# Discord OAuth Configuration (z Discord Developer Portal)
DISCORD_CLIENT_ID=vas-discord-client-id
DISCORD_CLIENT_SECRET=vas-discord-client-secret

# Firebase Configuration (z Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY=vas-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=vas-projekt.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=vas-projekt-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=vas-projekt.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=vas-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=vas-app-id

# Discord Bot Configuration
DISCORD_BOT_TOKEN=vas-discord-bot-token
DISCORD_GUILD_ID=vas-discord-server-id
```

### 2. Firebase Setup
1. Přejděte na [Firebase Console](https://console.firebase.google.com/)
2. Vytvořte nový projekt nebo použijte existující
3. Přidejte webovou aplikaci
4. Zkopírujte konfigurační hodnoty do `.env.local`
5. Nastavte Firestore Database:
   - Přejděte do Firestore Database
   - Vytvořte databázi v production módu
   - Nastavte pravidla pro autentifikované uživatele

### 3. Discord OAuth Setup
1. Přejděte na [Discord Developer Portal](https://discord.com/developers/applications)
2. Vytvořte novou aplikaci
3. V sekci OAuth2:
   - Přidejte redirect URL: `http://localhost:3000/api/auth/callback/discord`
   - Zkopírujte Client ID a Client Secret
4. V sekci Bot:
   - Vytvořte bot token
   - Povolte potřebná oprávnění

### 4. Instalace závislostí
```bash
npm install
```

### 5. Spuštění dev serveru
```bash
npm run dev
```

## 🔧 Discord Bot Integrace

### Propojení s existujícím Discord botem

Do vašeho Discord botu přidejte tento kód pro synchronizaci s webovou aplikací:

```javascript
// V hlavním souboru Discord botu
import { DiscordWebAppIntegration } from './discord-integration.js';

const webAppIntegration = new DiscordWebAppIntegration(
  'http://localhost:3000', // URL webové aplikace
  process.env.DISCORD_BOT_TOKEN
);

// Synchronizace dat každých 5 minut
setInterval(async () => {
  const success = await webAppIntegration.syncDataToWebApp(
    aktivniJizdy,
    dokonceneJizdy,
    userStats
  );
  
  if (success) {
    console.log('✅ Data synchronized with web app');
  }
}, 5 * 60 * 1000);

// Při přidání nové jízdy
async function onNewRide(rideData) {
  await webAppIntegration.updateRideInWebApp(rideData.id, rideData);
}

// Při aktualizaci statistik uživatele
async function onUserStatsUpdate(userId, stats) {
  await webAppIntegration.updateUserStatsInWebApp(userId, stats);
}
```

## 📊 Funkcionality

### ✅ Implementováno
- 🔐 Discord OAuth přihlášení
- 👥 Role management (Admin, Výpravčí, Strojvůdce, Zaměstnanec)
- 📊 Dashboard s real-time statistikami
- 🚂 Live tracking jízd
- 🔥 Firebase Firestore integrace
- 📱 Responsive design s Tailwind CSS
- ⚡ Real-time aktualizace
- 🔄 Discord bot synchronizace

### 🎯 Klíčové komponenty
- **Navbar**: Navigation s Discord přihlášením
- **Dashboard**: Hlavní přehled s aktivními jízdami a statistikami
- **LiveTracking**: Real-time sledování vlaků s progress bary
- **Admin Panel**: Správa uživatelů a jízd (pouze pro adminy)

### 🗃️ Databázová struktura
```
Firestore Collections:
├── users/          # Informace o uživatelích
├── rides/          # Jízdy vlaků
├── assignments/    # Přiřazení jízd strojvůdcům
├── userStats/      # Statistiky uživatelů
└── liveTracking/   # Live tracking data
```

## 🚀 Další kroky

### Pro produkci:
1. **Deployment**: Deploy na Vercel/Netlify
2. **SSL**: Nastavte HTTPS
3. **Environment**: Aktualizujte URLs v production
4. **Firebase Rules**: Nastavte správná bezpečnostní pravidla
5. **Discord Webhook**: Nastavte produkční webhook URL

### Rozšíření funkcionalit:
1. **Push Notifications**: Web push pro nové jízdy
2. **Mobile App**: React Native aplikace
3. **Analytics**: Detailní reporting a grafy
4. **API**: RESTful API pro externí integraci
5. **Backup**: Automatické zálohování dat

## 📝 API Endpoints

- `GET /api/auth/[...nextauth]` - NextAuth endpoints
- `POST/GET /api/discord/sync` - Discord bot synchronizace
- Připraveno pro další API endpointy

## 🛠️ Technologie

- **Framework**: Next.js 14 + TypeScript
- **Styling**: Tailwind CSS
- **Database**: Firebase Firestore
- **Auth**: NextAuth.js + Discord OAuth
- **Icons**: Heroicons
- **Real-time**: Firebase real-time listeners

## 🔍 Troubleshooting

### Časté problémy:
1. **OAuth chyby**: Zkontrolujte redirect URLs v Discord aplikaci
2. **Firebase chyby**: Ověřte API klíče a pravidla databáze
3. **TypeScript chyby**: Spusťte `npm run build` pro kontrolu
4. **Discord role**: Ověřte správné role IDs v .env.local

### Debug tipy:
- Zkontrolujte konzoli prohlížeče
- Sledujte Network tab pro API chyby
- Ověřte Firebase konzoli pro databázové operace
- Testujte Discord OAuth v incognito módu

---

🎉 **Gratulujeme! MultiCargo web aplikace je připravena k použití!**

Pro další podporu nebo rozšíření funkcionalit kontaktujte vývojový tým.