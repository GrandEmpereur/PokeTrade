<p align="center">
  <img src="./public/assets/images/readme/logo2.png" width="450" height="450" alt="Logo" />
</p>

# 🏆 PokeTrade

**PokeTrade** is a Pokémon trading platform inspired by TradingView. Pokémon prices fluctuate in a simulated market
where users can buy, sell, and track price trends just like real traders.

---

## 🏗️ Project Architecture

```
├── .env.example
├── .gitignore
├── .husky
    ├── .gitignore
    ├── commit-msg
    └── pre-commit
├── .prettierignore
├── .prettierrc
├── README.md
├── bun.lock
├── commitlint.config.js
├── components.json
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── public
    ├── assets
    │   └── images
    │   │   ├── auth
    │   │       └── auth-bg.png
    │   │   └── readme
    │   │       ├── logo.png
    │   │       └── logo2.png
    ├── file.svg
    ├── globe.svg
    ├── next.svg
    ├── vercel.svg
    └── window.svg
├── src
    ├── app
    │   ├── (auth)
    │   │   ├── layout.tsx
    │   │   ├── login
    │   │   │   └── page.tsx
    │   │   └── register
    │   │   │   └── page.tsx
    │   ├── (root)
    │   │   ├── layout.tsx
    │   │   └── page.tsx
    │   ├── favicon.ico
    │   ├── globals.css
    │   └── layout.tsx
    ├── components
    │   └── ui
    │   │   ├── button.tsx
    │   │   ├── card.tsx
    │   │   ├── chart.tsx
    │   │   ├── checkbox.tsx
    │   │   ├── form.tsx
    │   │   ├── input-otp.tsx
    │   │   ├── input.tsx
    │   │   ├── label.tsx
    │   │   ├── select.tsx
    │   │   ├── separator.tsx
    │   │   ├── skeleton.tsx
    │   │   ├── sonner.tsx
    │   │   ├── switch.tsx
    │   │   └── textarea.tsx
    ├── lib
    │   ├── services
    │   │   └── pokeApi.service.ts
    │   ├── types
    │   │   └── pokemon.types.ts
    │   ├── utils.ts
    │   └── validators
    │   │   └── authSchema.ts
    └── utils
    │   └── supabase
    │       ├── client.ts
    │       ├── middleware.ts
    │       └── serveur.ts
└── tsconfig.json

```

## 🚀 Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org)
- **Backend-as-a-Service**: [Supabase](https://supabase.com)
- **Database**: PostgreSQL (via Supabase)
- **UI/UX**: Tailwind CSS, shadcn/ui
- **Form Validation**: Zod
- **Testing**: Jest, Cypress
- **CI/CD**: GitHub Actions
- **Payments**: Stripe

---

## 🎯 Features

- 🔐 Supabase Authentication
- 📈 Price charts for each Pokémon
- 🛒 Trading system (buy/sell)
- 💳 Subscription payments via Stripe
- 💼 User portfolio management
- 📊 Transaction history
- ✅ Responsive & stylish UI

---

## 🧱 SOLID Architecture

This project follows SOLID principles:

- **S**: Separate domains in `/core/domain`
- **O**: Extendable entities using Zod
- **L**: Clearly defined interfaces for services
- **I**: Interfaces specific to each feature
- **D**: Dependency injection for use cases

---

## 🔍 Conventional Commits

This project follows the **Conventional Commits** standard to maintain a consistent commit message format. Commit
messages must follow this structure:

```
<type>(<scope>): <subject>
```

### Commit Message Structure

- **type**: Describes the type of change (e.g., `feat`, `fix`, `docs`)
- **scope**: Specifies the affected area (e.g., `auth`, `build`)
- **subject**: A concise description of the change

### Allowed Types

| Type     | Description                                 |
|----------|---------------------------------------------|
| feat     | A new feature                               |
| fix      | A bug fix                                   |
| docs     | Documentation updates                       |
| style    | Code formatting (no logic changes)          |
| refactor | Code restructuring without behavior changes |
| perf     | Performance improvements                    |
| test     | Adding or updating tests                    |
| chore    | Build process or auxiliary tool changes     |
| ci       | CI configuration changes                    |
| build    | Build system updates                        |
| revert   | Reverting a previous commit                 |

### Examples

- `feat(auth): Add login functionality`
- `fix(api): Resolve timeout issue`
- `docs(readme): Update setup instructions`
- `chore(deps): Update dependency versions`
- `style(button): Adjust padding for better alignment`

Commit messages that do not follow this format will be rejected to ensure a clean, readable history.

---

## 🛠️ Installation

```bash
git clone https://github.com/your-username/poketrade.git
cd poketrade
npm install
cp .env.example .env.local
```

Configure `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=''
NEXT_PUBLIC_SUPABASE_ANON_KEY=''
```

---

## 🚀 Running the Project

```bash
npm run dev
```

---

## ✅ Testing

### Jest (Unit Tests)

```bash
npm run test
```

### Cypress (End-to-End Tests)

```bash
npx cypress open
```

---

## 🔄 CI/CD

GitHub Actions automatically runs tests:

- Linting + Jest on each `push`
- Deployment via Vercel (or another platform, depending on configuration)

---

## 🧩 Key Technologies

| Technology | Usage                 |
|------------|-----------------------|
| Next.js    | App router, SSR/ISR   |
| Supabase   | Auth, DB, Realtime    |
| Stripe     | Subscription payments |
| Zod        | Schema validation     |
| Jest       | Unit testing          |
| Cypress    | End-to-end testing    |
| Tailwind   | CSS design system     |
| shadcn/ui  | UI components         |

---

## 👥 Contributors

- [Your Name](https://github.com/your-github)
- You can be listed here too! 😉

---

## 📜 License

MIT
