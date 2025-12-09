"use client";

import { useWallets } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { getBalance } from "@/lib/solana";
import { formatAddress } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function AccountBalance() {
  const { wallets } = useWallets();
  const solanaWallet = wallets.find(
    (w) => w.walletClientType === "privy" && w.chainId?.startsWith("solana:"),
  );

  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    if (!solanaWallet?.address) return;
    setLoading(true);
    setError(null);
    try {
      const amount = await getBalance(solanaWallet.address);
      setBalance(`${amount.toFixed(4)} SOL`);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to fetch balance.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solanaWallet?.address]);

  if (!solanaWallet?.address) {
    return (
      <div className="rounded-2xl border border-slate-200 p-4 text-sm text-slate-600">
        Connect or create a Solana wallet to view balance (embedded wallets are auto-created on login).
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase text-slate-500">Account Balance</p>
          <p className="text-sm text-slate-600">
            {formatAddress(solanaWallet.address)}
          </p>
        </div>
        <Button
          onClick={refresh}
          variant="outline"
          disabled={loading}
          className="text-xs"
        >
          {loading ? "Refreshing…" : "Refresh"}
        </Button>
      </div>
      <p className="mt-3 text-2xl font-semibold text-slate-900">
        {balance ?? "—"}
      </p>
      {error && <p className="mt-2 text-xs text-rose-600">{error}</p>}
    </div>
  );
}

