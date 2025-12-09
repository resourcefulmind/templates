"use client";

import { useWallets } from "@privy-io/react-auth";
import { useState } from "react";
import { sendLamports } from "@/lib/solana";
import { formatAddress } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function SendTransactionExample() {
  const { wallets } = useWallets();
  const solanaWallet = wallets.find(
    (w) => w.walletClientType === "privy" && w.chainId?.startsWith("solana:"),
  );

  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!solanaWallet?.address) {
      setError("Connect or create a Solana wallet first.");
      return;
    }
    setSending(true);
    setStatus(null);
    setError(null);

    try {
      // Demo: send a tiny amount to yourself. Adjust the address/amount as needed.
      // Requires enough SOL in the wallet to cover amount + fees.
      const signature = await sendLamports({
        wallet: solanaWallet as any,
        toAddress: solanaWallet.address,
        amountSol: 0.000001,
      });
      setStatus(`Sent. Signature: ${signature}`);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to send transaction.";
      setError(message);
    } finally {
      setSending(false);
    }
  };

  if (!solanaWallet?.address) {
    return (
      <div className="rounded-2xl border border-slate-200 p-4 text-sm text-slate-600">
        Connect or create a Solana wallet to run the send example.
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase text-slate-500">Send Transaction</p>
          <p className="text-sm text-slate-600">
            Demo: sends a tiny transfer to your own address
          </p>
          <p className="mt-1 text-xs text-slate-500">
            From/To: {formatAddress(solanaWallet.address)}
          </p>
        </div>
        <Button onClick={handleSend} disabled={sending} className="text-xs">
          {sending ? "Sending…" : "Send 0.000001 SOL"}
        </Button>
      </div>
      {status && <p className="text-xs text-emerald-700">{status}</p>}
      {error && <p className="text-xs text-rose-600">{error}</p>}
      <p className="text-[11px] text-slate-500">
        Note: This example may fail if the wallet has insufficient SOL or if the
        RPC rate limits requests.
      </p>
    </div>
  );
}

