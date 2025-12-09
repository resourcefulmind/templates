import { createSolanaRpc } from "@solana/kit";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";

const DEFAULT_MAINNET_RPC =
  process.env.NEXT_PUBLIC_SOLANA_MAINNET_RPC_URL ||
  "https://api.mainnet-beta.solana.com";

/**
 * Returns the Solana RPC client configured for this template.
 * Override with NEXT_PUBLIC_SOLANA_MAINNET_RPC_URL to use a custom RPC.
 */
export function getSolanaRpc(rpcUrl = DEFAULT_MAINNET_RPC) {
  return createSolanaRpc(rpcUrl);
}

/**
 * Fetches the SOL balance (in SOL) for a given address.
 */
export async function getBalance(address: string, rpcUrl?: string) {
  const rpc = getSolanaRpc(rpcUrl);
  const pubkey = new PublicKey(address);
  const { value } = await rpc.getBalance(pubkey, { commitment: "confirmed" });
  return value / LAMPORTS_PER_SOL;
}

type SolanaPrivyWallet = {
  address: string;
  chainType?: string | null;
  signAndSendTransaction: (
    tx: Transaction,
  ) => Promise<{ signature: string } | string>;
};

type SendLamportsOptions = {
  wallet: SolanaPrivyWallet;
  toAddress: string;
  amountSol: number;
  rpcUrl?: string;
};

/**
 * Sends SOL using the connected Privy wallet.
 * Keeps the example small and copy/paste-friendly for builders.
 */
export async function sendLamports({
  wallet,
  toAddress,
  amountSol,
  rpcUrl,
}: SendLamportsOptions) {
  if (!wallet?.address) {
    throw new Error("A connected Solana wallet is required.");
  }

  const rpc = getSolanaRpc(rpcUrl);
  const { value: latestBlockhash } = await rpc.getLatestBlockhash({
    commitment: "confirmed",
  });

  const fromPubkey = new PublicKey(wallet.address);
  const toPubkey = new PublicKey(toAddress);
  const lamports = Math.max(0, Math.floor(amountSol * LAMPORTS_PER_SOL));

  const transaction = new Transaction({
    recentBlockhash: latestBlockhash.blockhash,
    feePayer: fromPubkey,
  }).add(
    SystemProgram.transfer({
      fromPubkey,
      toPubkey,
      lamports,
    }),
  );

  const result = await wallet.signAndSendTransaction(transaction);
  return typeof result === "string" ? result : result.signature;
}

/**
 * Formats a lamport amount into SOL with 4 decimal places.
 */
export function formatSol(lamports: number) {
  return (lamports / LAMPORTS_PER_SOL).toFixed(4);
}

