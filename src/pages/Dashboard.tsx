import { useEffect, useMemo, useState } from "react";
import { Layout } from "../components/Layout";
import { InventoryCard } from "../components/InventoryCard";
import { LogForm } from "../components/LogForm";
import { LogList } from "../components/LogList";
import { getInventory, updateInventory } from "../firebase/inventory.repo";
import { createLog, listLogs } from "../firebase/logs.repo";
import { PRODUCTS, type ProductKey } from "../domain/products";
import type { CoffeeLog, CreateCoffeeLogInput } from "../domain/types";

function emptyInventory(): Record<ProductKey, number> {
  return Object.fromEntries(PRODUCTS.map((p) => [p.key, 0])) as Record<ProductKey, number>;
}

export default function Dashboard() {
  const [inv, setInv] = useState<Record<ProductKey, number>>(emptyInventory());
  const [logs, setLogs] = useState<CoffeeLog[]>([]);
  const [loadingInv, setLoadingInv] = useState(false);
  const [loadingLog, setLoadingLog] = useState(false);

  const lowStock = useMemo(() => {
    // regra simples: <= 2 é baixo (você ajusta depois)
    return PRODUCTS.filter((p) => inv[p.key] <= 2).map((p) => p.label);
  }, [inv]);

  async function refresh() {
    const [inventory, lastLogs] = await Promise.all([getInventory(), listLogs(30)]);
    setInv(inventory.items);
    setLogs(lastLogs);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleSaveInventory() {
    setLoadingInv(true);
    try {
      await updateInventory(inv);
      await refresh();
    } finally {
      setLoadingInv(false);
    }
  }

  async function handleSubmitLog(input: CreateCoffeeLogInput) {
    setLoadingLog(true);
    try {
      await createLog(input);
      await refresh();
    } finally {
      setLoadingLog(false);
    }
  }

  return (
    <Layout>
      {lowStock.length ? (
        <div className="card" style={{ marginBottom: 12 }}>
          <div style={{ fontWeight: 800 }}>Atenção: estoque baixo</div>
          <div style={{ color: "var(--muted)", marginTop: 4 }}>
            {lowStock.join(", ")}
          </div>
        </div>
      ) : null}

      <div className="grid cols-2">
        <InventoryCard
          items={inv}
          loading={loadingInv}
          onChange={(key, next) =>
            setInv((prev) => ({ ...prev, [key]: Number.isFinite(next) ? next : 0 }))
          }
          onSave={handleSaveInventory}
        />

        <LogForm onSubmit={handleSubmitLog} loading={loadingLog} />
      </div>

      <div style={{ marginTop: 12 }}>
        <LogList logs={logs} />
      </div>
    </Layout>
  );
}
