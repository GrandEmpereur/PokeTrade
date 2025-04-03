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
├── .github
    └── workflows
    │   └── ci-cd.yml
├── .gitignore
├── .husky
    ├── .gitignore
    ├── commit-msg
    └── pre-commit
├── .prettierignore
├── .prettierrc
├── Dockerfile
├── Makefile
├── README.md
├── artifacts
    ├── @openzeppelin
    │   └── contracts
    │   │   ├── access
    │   │       └── Ownable.sol
    │   │       │   ├── Ownable.dbg.json
    │   │       │   └── Ownable.json
    │   │   ├── interfaces
    │   │       └── draft-IERC6093.sol
    │   │       │   ├── IERC1155Errors.dbg.json
    │   │       │   ├── IERC1155Errors.json
    │   │       │   ├── IERC20Errors.dbg.json
    │   │       │   ├── IERC20Errors.json
    │   │       │   ├── IERC721Errors.dbg.json
    │   │       │   └── IERC721Errors.json
    │   │   ├── token
    │   │       └── ERC721
    │   │       │   ├── ERC721.sol
    │   │       │       ├── ERC721.dbg.json
    │   │       │       └── ERC721.json
    │   │       │   ├── IERC721.sol
    │   │       │       ├── IERC721.dbg.json
    │   │       │       └── IERC721.json
    │   │       │   ├── IERC721Receiver.sol
    │   │       │       ├── IERC721Receiver.dbg.json
    │   │       │       └── IERC721Receiver.json
    │   │       │   ├── extensions
    │   │       │       └── IERC721Metadata.sol
    │   │       │       │   ├── IERC721Metadata.dbg.json
    │   │       │       │   └── IERC721Metadata.json
    │   │       │   └── utils
    │   │       │       └── ERC721Utils.sol
    │   │       │           ├── ERC721Utils.dbg.json
    │   │       │           └── ERC721Utils.json
    │   │   └── utils
    │   │       ├── Context.sol
    │   │           ├── Context.dbg.json
    │   │           └── Context.json
    │   │       ├── Panic.sol
    │   │           ├── Panic.dbg.json
    │   │           └── Panic.json
    │   │       ├── Strings.sol
    │   │           ├── Strings.dbg.json
    │   │           └── Strings.json
    │   │       ├── introspection
    │   │           ├── ERC165.sol
    │   │           │   ├── ERC165.dbg.json
    │   │           │   └── ERC165.json
    │   │           └── IERC165.sol
    │   │           │   ├── IERC165.dbg.json
    │   │           │   └── IERC165.json
    │   │       └── math
    │   │           ├── Math.sol
    │   │               ├── Math.dbg.json
    │   │               └── Math.json
    │   │           ├── SafeCast.sol
    │   │               ├── SafeCast.dbg.json
    │   │               └── SafeCast.json
    │   │           └── SignedMath.sol
    │   │               ├── SignedMath.dbg.json
    │   │               └── SignedMath.json
    ├── build-info
    │   └── 9ba667d9b79de03ef483634e19f63ab2.json
    └── contracts
    │   └── PaymentNFT.sol
    │       ├── PaymentNFT.dbg.json
    │       └── PaymentNFT.json
├── commitlint.config.js
├── components.json
├── contracts
    └── PaymentNFT.sol
├── docker-compose.yml
├── eslint.config.mjs
├── global.d.ts
├── hardhat.config.ts
├── jest.config.ts
├── jest.setup.js
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── prisma
    ├── schema.prisma
    └── seed.ts
├── public
    └── assets
    │   └── images
    │       ├── auth
    │           └── auth-bg.png
    │       ├── landing
    │           ├── dashboard.png
    │           └── hero-banner.png
    │       ├── readme
    │           ├── UML.png
    │           ├── logo.png
    │           └── logo2.png
    │       └── tech
    │           ├── cursor.svg
    │           ├── faker.svg
    │           ├── framermotion.svg
    │           ├── nextjs.svg
    │           ├── prisma.svg
    │           ├── react.svg
    │           ├── shadcnui.svg
    │           ├── stripe.svg
    │           ├── supabase.svg
    │           ├── tailwind.svg
    │           ├── vercel.svg
    │           └── x.svg
├── scripts
    └── deploy.js
├── src
    ├── abis
    │   └── PaymentNFT.abi.json
    ├── app
    │   ├── (auth)
    │   │   ├── auth
    │   │   │   ├── callback
    │   │   │   │   └── route.ts
    │   │   │   └── confirm
    │   │   │   │   └── route.ts
    │   │   ├── layout.tsx
    │   │   ├── login
    │   │   │   └── page.tsx
    │   │   └── register
    │   │   │   └── page.tsx
    │   ├── (dasboard)
    │   │   ├── dashboard
    │   │   │   ├── airdrops
    │   │   │   │   └── page.tsx
    │   │   │   ├── analytics
    │   │   │   │   └── page.tsx
    │   │   │   ├── collection
    │   │   │   │   └── page.tsx
    │   │   │   ├── communaute
    │   │   │   │   └── page.tsx
    │   │   │   ├── data.json
    │   │   │   ├── historique
    │   │   │   │   └── page.tsx
    │   │   │   ├── marketplace
    │   │   │   │   └── page.tsx
    │   │   │   ├── notifications
    │   │   │   │   └── page.tsx
    │   │   │   ├── page.tsx
    │   │   │   ├── pokedex
    │   │   │   │   ├── [slug]
    │   │   │   │   │   └── page.tsx
    │   │   │   │   └── page.tsx
    │   │   │   ├── settings
    │   │   │   │   └── page.tsx
    │   │   │   ├── support
    │   │   │   │   └── page.tsx
    │   │   │   ├── tendances
    │   │   │   │   └── page.tsx
    │   │   │   ├── trading
    │   │   │   │   └── page.tsx
    │   │   │   ├── wallet
    │   │   │   │   └── page.tsx
    │   │   │   └── wishlist
    │   │   │   │   └── page.tsx
    │   │   └── layout.tsx
    │   ├── (root)
    │   │   ├── layout.tsx
    │   │   └── page.tsx
    │   ├── api
    │   │   ├── orders
    │   │   │   └── route.ts
    │   │   ├── pokemon
    │   │   │   └── search
    │   │   │   │   └── route.ts
    │   │   └── portfolio
    │   │   │   └── route.ts
    │   ├── favicon.ico
    │   ├── globals.css
    │   └── layout.tsx
    ├── components
    │   ├── app-sidebar.tsx
    │   ├── chart-area-interactive.tsx
    │   ├── data-table.tsx
    │   ├── footer.tsx
    │   ├── mint-button.tsx
    │   ├── nav-documents.tsx
    │   ├── nav-main.tsx
    │   ├── nav-secondary.tsx
    │   ├── nav-user.tsx
    │   ├── navBar.tsx
    │   ├── pokemon
    │   │   └── pokemon-price-chart.tsx
    │   ├── section-cards.tsx
    │   ├── site-header.tsx
    │   └── ui
    │   │   ├── accordion.tsx
    │   │   ├── alert-dialog.tsx
    │   │   ├── alert.tsx
    │   │   ├── aspect-ratio.tsx
    │   │   ├── avatar.tsx
    │   │   ├── badge.tsx
    │   │   ├── breadcrumb.tsx
    │   │   ├── button.tsx
    │   │   ├── calendar.tsx
    │   │   ├── card.tsx
    │   │   ├── chart.tsx
    │   │   ├── checkbox.tsx
    │   │   ├── collapsible.tsx
    │   │   ├── command.tsx
    │   │   ├── context-menu.tsx
    │   │   ├── dialog.tsx
    │   │   ├── drawer.tsx
    │   │   ├── dropdown-menu 2.tsx
    │   │   ├── dropdown-menu.tsx
    │   │   ├── form.tsx
    │   │   ├── hover-card.tsx
    │   │   ├── input-otp.tsx
    │   │   ├── input.tsx
    │   │   ├── label.tsx
    │   │   ├── menubar.tsx
    │   │   ├── navigation-menu.tsx
    │   │   ├── pagination.tsx
    │   │   ├── popover.tsx
    │   │   ├── progress.tsx
    │   │   ├── radio-group.tsx
    │   │   ├── resizable.tsx
    │   │   ├── scroll-area.tsx
    │   │   ├── select.tsx
    │   │   ├── separator.tsx
    │   │   ├── sheet.tsx
    │   │   ├── sidebar.tsx
    │   │   ├── skeleton.tsx
    │   │   ├── slider 2.tsx
    │   │   ├── slider.tsx
    │   │   ├── sonner.tsx
    │   │   ├── switch.tsx
    │   │   ├── table.tsx
    │   │   ├── tabs 2.tsx
    │   │   ├── tabs.tsx
    │   │   ├── textarea.tsx
    │   │   ├── toggle-group.tsx
    │   │   ├── toggle.tsx
    │   │   └── tooltip.tsx
    ├── hooks
    │   ├── use-mobile.ts
    │   └── useAuth.ts
    ├── lib
    │   └── utils.ts
    ├── mappers
    │   └── pokemon
    │   │   └── mapPokemonType.ts
    ├── middleware.ts
    ├── services
    │   ├── auth.service.ts
    │   ├── order.service.ts
    │   ├── pokeApi.server.ts
    │   └── pokeApi.service.ts
    ├── test
    │   └── services
    │   │   └── pokeApi.service.test.ts
    ├── types
    │   └── pokemon
    │   │   └── pokemon.types.ts
    ├── utils
    │   ├── prisma
    │   │   └── prisma.ts
    │   └── supabase
    │   │   ├── client.ts
    │   │   ├── middleware.ts
    │   │   └── server.ts
    └── validators
    │   ├── auth.validators.ts
    │   └── authSchema.ts
├── tsconfig.hardhat.json
├── tsconfig.json
├── yarn 2.lock
└── yarn.lock

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

## 🧱 UML Architecture

<p align="center">
  <img src="./public/assets/images/readme/UML.png" width="1000" height="1000" alt="Logo" />
</p>

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

## 🔗 NFT Smart Contract Development and Integration

# 1. Designing and Developing Smart Contracts to Accept Payments in the Form of NFTs

**Main Contract: `PaymentNFT.sol`**

- Allows a user to pay in Ether (`payAndMint()`) to receive an NFT.  
- Emits a `NFTMinted(address indexed minter, uint256 indexed tokenId, uint256 amount)` event.  
- Includes a `withdraw()` function enabling the owner to withdraw funds.

### Progress

**Current state**:  
- The contract is developed in Solidity
- It compiles successfully (Hardhat).  
- Basic unit tests confirm NFT minting, amount verification, and fund withdrawal.

**Note**:  
- Utilizing OpenZeppelin ensures compliance with the ERC721 standard and applies best practices for Ownable management.
- The `payAndMint()` method does not necessarily enforce a fixed amount (you are free to implement `require(msg.value == ...)` if needed).

---

# 2. Deployment on a Test Network and Preparing for the Main Network

**Targeted Testnet**: Sepolia, via `hardhat.config.js`.

**Configuration**:
```js
networks: {
  sepolia: {
    url: process.env.SEPOLIA_RPC_URL,
    accounts: [process.env.PRIVATE_KEY]
  },
}
```
Deployment script: ```scripts/deploy.js```

### Progress
**Current state**:  

- The Hardhat configuration (```hardhat.config.js```) is ready.
- Unit tests (locally) pass successfully.
- Missing: test ETH (Sepolia ETH) to actually deploy on the test network.

**Next steps**:

1. Obtain test ETH via a faucet (e.g., [sepoliafaucet.com](https://sepoliafaucet.com) or [faucetlink.to/sepolia](https://faucetlink.to/sepolia)).

2. Run the command:
```bash
npx hardhat run scripts/deploy.js --network sepolia
```
3. Check the contract address on an explorer (e.g., [sepolia.etherscan.io](https://sepolia.etherscan.io)).

**Mainnet migration**:

- Same logic, adding a ```mainnet``` block in ```hardhat.config.js``` and providing real ETH.
- Do this after final validation (tests, audit, etc.).

# 3. Integration with the Supabase Back End

**Objective**:

- Listen for the ```NFTMinted``` event from the contract to link the NFT transaction to a user profile 
- Insert into a table: the minter’s address, the tokenId, the transaction, etc.

### Progress
**Current state**:  

- The event-listening logic (```contract.on("NFTMinted", ...)```) has been explained but not yet implemented in the existing code.
- We have an example of inserting data into Supabase (```supabase.from("...").insert([...])```).

**Next steps**:

1. Create or adapt a script (Node/Next.js) that listens to the blockchain (Ethers.js) via a provider (Sepolia).
2. Insert data into the Supabase database.
3. Implement front-end or back-end display to show minted NFTs.

# 4. Implementation of Unit and Integration Tests (Security and Robustness)

**Unit Tests**:

- Placed in ```test/PaymentNFT.test.ts```.
- Confirm the following behaviors:
  - Mints an NFT if the user pays the required Ether
  - Reverts if the user sends zero Ether
  - Allows the contract owner to withdraw collected funds

These tests confirm that the essential functionalities of your smart contract (payment for NFT, revert in case of no payment, and fund withdrawal) work correctly and behave as intended.

**Integration Tests**:

- **Locally**: A "simplified" test checks if the owner can retrieve funds (contract balance = 0, owner balance increases).
- **Next steps**: test real integration with Supabase (event listening).
- **Optionally**: test on **Sepolia** for more realistic behavior.

# 5. Documentation of the Architecture and Workflow
##### 1. Smart Contracts (Solidity)

- ✅ `PaymentNFT` contract developed, handles minting an NFT in exchange for payment.
- ✅ Hardhat unit tests to verify basic logic (payment/mint, withdrawal).
- ❌ Adding Pokemon metadata (name, image, etc.) not yet integrated in the contract to generate the NFT.

##### 2. Testnet Deployment

- ✅ Obtained test ETH on **Sepolia**.
- ✅ Deployed via Hardhat (`scripts/deploy.js`).
- ✅ Verified the address and code on Etherscan.

##### 3. Supabase Integration

- ❌ Create a listener script (`contract.on("NFTMinted", ...)`), insert into DB.
- ❌ Connect with the front-end (display minted NFT in **PokeTrade**).

##### 4. Security & Audit

- ❌ Check for reentrancy (if needed), correct use of **Ownable**, etc.
- ❌ Optional: third-party audit before deploying to mainnet.

##### 5. Documentation

- ✅ Partial documentation exists (testing, configuration).
- ❌ Finalize a more complete README or Wiki, include diagrams, testnet/mainnet deployment instructions.


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
