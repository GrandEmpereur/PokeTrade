<p align="center">
  <img src="./public/assets/images/readme/logo2.png" width="450" height="450" alt="Logo" />
</p>


## 🧠 Architecture du projet 

```
```

# 🧪 PokeTrade

**PokeTrade** est une plateforme de Pokémon trading inspirée de TradingView. Les prix des Pokémon évoluent dans un marché simulé. Les utilisateurs peuvent acheter, vendre et suivre les fluctuations comme de vrais traders.

---

## 🚀 Stack Technique

- **Framework** : [Next.js 15 (App Router)](https://nextjs.org)
- **Backend-as-a-Service** : [Supabase](https://supabase.com)
- **Base de données** : PostgreSQL (via Supabase)
- **UI/UX** : Tailwind CSS, shadcn/ui
- **Form validation** : Zod
- **Tests** : Jest, Cypress
- **CI/CD** : GitHub Actions
- **Paiement** : Stripe

---

## 🎯 Fonctionnalités

- 🔐 Authentification Supabase
- 📈 Graphiques de prix pour chaque Pokémon
- 🛒 Système de trading (achat, vente)
- 💳 Paiement d’abonnement avec Stripe
- 💼 Portefeuille utilisateur
- 📊 Historique des transactions
- ✅ UI responsive & stylée

---

## 🧱 Architecture SOLID

Le projet suit les principes SOLID :
- **S** : Domaines séparés dans `/core/domain`
- **O** : Entités extensibles avec Zod
- **L** : Interfaces clairement définies pour les services
- **I** : Interfaces spécifiques aux fonctionnalités
- **D** : Les dépendances sont injectées dans les cas d’usage

---

## 🛠️ Installation

```bash
git clone https://github.com/ton-compte/poketrade.git
cd poketrade
npm install
cp .env.example 
rename .env copy.example to .env.local
```

Configure `.env.local` :

```env
NEXT_PUBLIC_SUPABASE_URL=''
NEXT_PUBLIC_SUPABASE_ANON_KEY=''
```

---

## 🔎 Lancer le projet

```bash
npm run dev
```

---

## ✅ Tests

### Jest (unitaires)

```bash
npm run test
```

### Cypress (end-to-end)

```bash
npx cypress open
```

---

## 🧪 CI/CD

Les tests sont lancés automatiquement via GitHub Actions :

- Lint + Jest à chaque `push`
- Déploiement via Vercel ou autre selon config

---

## 🧩 Technologies clés

| Tech        | Utilisation                  |
|-------------|------------------------------|
| Next.js     | App router, SSR/ISR          |
| Supabase    | Auth, DB, Realtime           |
| Stripe      | Paiement des abonnements     |
| Zod         | Schémas et validation        |
| Jest        | Tests unitaires              |
| Cypress     | Tests E2E                    |
| Tailwind    | Design système CSS           |
| shadcn/ui   | Composants UI                |

---

## 🧠 Contributeurs

- [Ton Nom](https://github.com/ton-github)
- Tu peux apparaître ici ! 😉

---

## 📜 Licence

MIT
