# Privy Auth Template

This template lets you authenticate Solana dApps with social logins and automatic wallet creation, no custom infra required. 

We built this for Solana builders who want auth + wallets to “just work” so they can focus on product.

## Why This Template / What Problem It Solves
- Wallet-only onboarding blocks new users; social login + auto-wallet removes that barrier.
- Privy handles auth, sessions, embedded wallets, and external wallets in one flow.
- You get a working Next.js + Solana starter that shows protected routes, session inspection, and wallet management.

## Use Cases
- ✅ You want social login + instant Solana wallet creation (embedded) out of the box.
- ✅ You want to demo or start a Solana app without wiring auth from scratch.
- ❌ You need a full backend or database layer (not included).
- ❌ You want a production wallet UX with recovery UI already built (not included).

## Features
- Privy authentication with social login + wallets in one flow
- Embedded Solana wallets auto-created for users without wallets
- External wallet linking (Phantom/Solflare) with link/unlink
- Protected route + session inspector showing user object and decoded JWT
- Example Solana actions: balance read and tiny self-transfer

## Prerequisites
- Node.js 18+
- Privy account + App ID (required)
- Solana wallet extension (optional) if you want to test external wallets

## Built With
- [Next.js](https://nextjs.org) (App Router) + TypeScript
- [Tailwind CSS](https://tailwindcss.com) (Shadcn-style primitives via local UI components)
- [Privy React SDK](https://docs.privy.io/) (`@privy-io/react-auth`)
- Solana libraries: [`@solana/kit`](https://www.npmjs.com/package/@solana/kit), [`@solana/web3.js`](https://solana-labs.github.io/solana-web3.js/)

## How It Works (short)
1. User opens `/` → Privy initializes.
2. Click “Login” → choose email, social, or wallet.
3. If no wallet exists, Privy auto-creates an embedded Solana wallet.
4. Home shows profile + wallet info; “Protected” link appears.
5. `/protected` renders session/user objects and a decoded JWT.
6. Link/unlink external wallets; session persists across refreshes.

## Quick Start

### 0) Clone or fork
```bash
git clone https://github.com/solana-foundation/templates.git
cd templates/community/privy-auth
```

### 1) Create a Privy App (required)
- Sign up at [privy.io](https://privy.io) and open the [Privy Dashboard](https://dashboard.privy.io).
- Create an app and copy the **App ID**.
- In Privy Dashboard, go to → User Management → Authentication → External wallets
  - Toggle “External wallets” on
  - Check “Solana wallets”
  - Add Allowed Origins: `http://localhost:3000` (and `http://127.0.0.1:3000`)

![Check Solana Wallet](https://res.cloudinary.com/resourcefulmind-inc/image/upload/v1764974645/Screenshot_2025-12-05_at_11.43.18_PM_hnpc15.png)

### 2) Environment variables
Copy the example file and add your App ID:
```bash
cp .env.example .env.local
```
Then edit `.env.local`:
```env
# Required: Your Privy App ID from the Privy dashboard
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id_here

# Optional: Custom Solana mainnet RPC (defaults to public mainnet if omitted)
# NEXT_PUBLIC_SOLANA_MAINNET_RPC_URL=https://your-rpc-provider-url
```
If `NEXT_PUBLIC_PRIVY_APP_ID` is missing, the app throws a clear error on startup.
After changing env vars, restart the dev server so values reload.

### 3) Install & run
```bash
pnpm install   # or npm install / yarn install
pnpm dev       # or npm run dev / yarn dev
```
Visit http://localhost:3000

### 4) Minimum setup vs full setup
- Minimum: Privy App ID only. Email + Wallet login work immediately (no OAuth).
- Optional: Enable Google/Twitter/Discord in Privy Dashboard (each requires its own OAuth app; see Privy docs).
- Optional: Custom RPC if you need better rate limits/observability.

## What it looks like when it works
- Login completes without modal errors.
- Home shows your wallet badge (Embedded/External), address, and “Logout”.
- “Protected” link appears; `/protected` shows session/user objects and decoded token.
- Linked wallets list shows your wallet; link/unlink buttons respond.
- Example cards (balance / send demo) become active once a wallet is connected.
- Visual reference: success state with external wallet and Protected link visible.

![Success state - Successfully Connected](https://res.cloudinary.com/resourcefulmind-inc/image/upload/v1764975772/Screenshot_2025-12-06_at_12.01.07_AM_mxvd0o.png)
![Success state - Successfully Connected Dashboard](https://res.cloudinary.com/resourcefulmind-inc/image/upload/v1765296807/Screenshot_2025-12-05_at_11.25.03_PM_opjbrs.png)

## What to Expect
- Login → wallet (embedded or external) → profile → protected route.
- Email + Wallet work immediately after setting the Privy App ID.
- Example cards in the UI show balance and a tiny self-transfer (for builders).
- 
## Environment Variables
| Variable | Required | Source | Purpose |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_PRIVY_APP_ID` | Yes | Privy Dashboard → App ID | Enables Privy auth and embedded wallets |
| `NEXT_PUBLIC_SOLANA_MAINNET_RPC_URL` | No | Your RPC provider (Helius/QuickNode/etc.) | Overrides default public mainnet RPC |
## Solana Configuration
- Default RPC: Public Solana mainnet (`https://api.mainnet-beta.solana.com`).
- Override: Set `NEXT_PUBLIC_SOLANA_MAINNET_RPC_URL` to use your own RPC (better rate limits/observability).
- Networks: Mainnet and devnet are pre-configured in `app/components/providers.tsx`. To switch networks in the UI, add a selector and pass the chosen RPC into your calls.

## Privy Configuration
- Defined in `app/components/providers.tsx`.
- PrivyProvider wires auth + Solana chains and creates embedded wallets when users log in without one (`createOnLogin: "users-without-wallets"`).
- Login methods: email, wallet, Google, Twitter, Discord (toggle in Privy Dashboard).
- Wallet types: **Embedded** (auto-created) and **External** (Phantom, Solflare, etc. via connectors).
- Advanced features demoed:
  - Link/unlink wallets (see `user-profile.tsx`)
  - Session inspector (`/protected`) showing user object + decoded JWT
- To customize: edit `loginMethods`, `embeddedWallets`, `externalWallets`, or the Solana RPC map in `providers.tsx`.
  
## Examples

- `app/components/examples/account-balance.tsx` - shows how to read/display a wallet balance.
- `app/components/examples/send-transaction-example.tsx` - shows a minimal self-transfer using the connected wallet.
  
> These are starting points; adapt them and harden error handling and amounts for production.
## External Services & Setup

- Privy (required): App ID is mandatory.
- Social OAuth (optional): Google/Twitter/Discord each need an OAuth app configured in Privy. See [Privy social login docs](https://docs.privy.io/authentication/user-authentication/login-methods/overview).
- Email + Wallet login: work immediately after setting the App ID (no OAuth needed).
- Custom RPC (optional): Use when you need better rate limits/reliability; otherwise the default public RPC works.
- External wallets (Phantom/Solana):
  - In Privy Dashboard, go to → User Management → Authentication → External wallets
  - Toggle “External wallets” on
  - Check “Solana wallets”
  - (Optional) Also allow other wallets as needed

![Check Solana Wallet](https://res.cloudinary.com/resourcefulmind-inc/image/upload/v1764974645/Screenshot_2025-12-05_at_11.43.18_PM_hnpc15.png)

## Troubleshooting (quick)

| Issue | Fix |
| --- | --- |
| Missing `NEXT_PUBLIC_PRIVY_APP_ID` | Add it to `.env.local`; restart dev server. |
| OAuth misconfig (redirect/credentials) | Re-check provider redirect URLs in Privy dashboard. |
| Network/RPC errors | Try a custom RPC; check rate limits and CORS. |
| Wallet connection errors | Install a Solana wallet for external wallets; embedded wallets work automatically. |
| Phantom/Solana login 403/origin mismatch | Add `http://localhost:3000` (and `http://127.0.0.1:3000`) to Privy Allowed Origins and enable External wallets → Solana. |

## Project Structure (quick reference)

```
app/
├── components/
│   ├── examples/              # Balance + send-tx examples
│   ├── login-screen.tsx       # Login UI
│   ├── user-profile.tsx       # Profile + wallet management + examples
│   ├── providers.tsx          # PrivyProvider configuration
│   └── ui/                    # UI primitives
├── lib/
│   └── solana.ts              # RPC helpers (balance, send)
├── protected/page.tsx         # Session inspector (protected route)
├── layout.tsx                 # Root layout + providers
└── page.tsx                   # Home
```

## Scripts

- `pnpm dev` — start dev server
- `pnpm build` — build for production
- `pnpm start` — run production build
- `pnpm lint` — run ESLint

## Learn More
- [Privy React Auth](https://docs.privy.io/authentication/user-authentication/login-methods/wallet)
- [Privy Solana](https://docs.privy.io/wallets/connectors/solana/web3-integrations)
- [Solana JSON RPC](https://docs.solana.com/developing/clients/jsonrpc-api)

## Acknowledgments

This template builds on:

- Privy￼ for authentication and wallet infrastructure.
- Solana Templates￼ for the base template structure.
- The broader Solana + Privy ecosystem for examples and best practices.

Curated and refined by [Opeyemi Bangkok](https://x.com/devvgbg) for improved developer onboarding and DX.

## License

MIT
