# 🚂 MultiCargo Web

Moderní webová aplikace pro správu železničních jízd s real-time sledováním a Discord integrací.

![Next.js](https://img.shields.io/badge/Next.js-15-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Firebase](https://img.shields.io/badge/Firebase-10-orange) ![Tailwind](https://img.shields.io/badge/Tailwind-3-cyan)

## 🌟 Funkcionality

- 🔐 **Discord OAuth přihlášení** s automatickou synchronizací rolí
- 👥 **Role management** (Admin, Výpravčí, Strojvůdce, Zaměstnanec)
- 📊 **Real-time dashboard** s pokročilými statistikami
- 🚂 **Live tracking vlaků** s progress bary
- 🔥 **Firebase Firestore** pro real-time data
- 📱 **Responsive design** optimalizovaný pro všechna zařízení
- ⚡ **Next.js 14** s TypeScript pro maximální výkon

## 🛠️ Technologie

- **Framework**: Next.js 14 + TypeScript
- **Styling**: Tailwind CSS
- **Database**: Firebase Firestore
- **Authentication**: NextAuth.js + Discord OAuth
- **Icons**: Heroicons
- **Deployment**: Vercel
- **Real-time**: Firebase real-time listeners

## 🚀 Quick Start

### 1. Instalace závislostí
```bash
npm install
```

### 2. Environment variables
Vytvořte `.env.local` soubor:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret
DISCORD_CLIENT_ID=your-discord-client-id
DISCORD_CLIENT_SECRET=your-discord-client-secret
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
# ... další Firebase config
```

### 3. Spuštění dev serveru
```bash
npm run dev
```

Aplikace bude dostupná na [http://localhost:3000](http://localhost:3000)

## 📁 Struktura projektu

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API endpoints
│   ├── dashboard/         # Dashboard stránka
│   ├── admin/            # Admin panel
│   └── globals.css       # Globální styly
├── components/           # React komponenty
│   ├── Navbar.tsx        # Hlavní navigace
│   ├── Dashboard.tsx     # Dashboard komponenta
│   └── LiveTracking.tsx  # Live tracking vlaků
├── lib/                  # Utility knihovny
│   ├── firebase.ts       # Firebase konfigurace
│   ├── firestore.ts      # Databázové operace
│   ├── auth.ts          # Auth helper funkce
│   └── discord-integration.ts # Discord bot integrace
└── types/               # TypeScript definice
    └── index.ts         # Hlavní typy
```

## 🎯 Klíčové komponenty

### Dashboard
- Real-time statistiky uživatelů
- Přehled aktivních jízd
- Live tracking s progress bary
- Historie dokončených jízd

### Admin Panel
- Správa uživatelů a rolí
- Management jízd vlaků
- Systémové statistiky
- Přístup pouze pro administrátory

### Live Tracking
- Real-time pozice vlaků
- Automatické aktualizace každých 30 sekund
- Progress indikátory cesty
- Upozornění na zpoždění

## 🔧 Discord Bot Integrace

Aplikace je připravena pro synchronizaci s Discord botem:

```javascript
// Synchronizace dat z Discord botu
await webAppIntegration.syncDataToWebApp(
  aktivniJizdy,
  dokonceneJizdy, 
  userStats
);
```

### Podporované Discord role:
- **Admin** - Plný přístup ke všem funkcím
- **Výpravčí** - Správa jízd a přiřazování
- **Strojvůdce** - Přebírání a sledování jízd
- **Zaměstnanec** - Základní přístup k jízdám

## 📊 Databázová struktura

### Firestore kolekce:
- **users** - Informace o uživatelích a jejich rolích
- **rides** - Jízdy vlaků s kompletními detaily
- **assignments** - Přiřazení jízd strojvůdcům
- **userStats** - Statistiky a body uživatelů
- **liveTracking** - Real-time pozice a postup vlaků

## 🌍 Deployment

### Vercel (doporučeno)
```bash
# Push na GitHub
git push origin main

# Deploy na Vercel se automaticky spustí
```

### Environment variables pro produkci:
- Nastavte všechny env vars ve Vercel dashboard
- Aktualizujte `NEXTAUTH_URL` na produkční URL
- Přidejte produkční URL do Discord OAuth redirect URLs

## 📈 Monitoring & Analytics

- Firebase Analytics pro sledování používání
- Real-time error monitoring
- Performance metrics
- User behavior tracking

## 🔒 Bezpečnost

- Discord OAuth s ověřenými redirect URLs
- Firebase Security Rules pro kontrolu přístupu
- TypeScript pro type safety
- Environment variables pro citlivé údaje

## 🤝 Přispívání

1. Fork repositáře
2. Vytvořte feature branch (`git checkout -b feature/nova-funkcionalita`)
3. Commit změny (`git commit -m 'Přidání nové funkcionality'`)
4. Push branch (`git push origin feature/nova-funkcionalita`)
5. Otevřete Pull Request

## 📄 Licence

MIT License - viz [LICENSE](LICENSE) soubor

---

Vytvořeno s ❤️ pro MultiCargo tým 🚂
