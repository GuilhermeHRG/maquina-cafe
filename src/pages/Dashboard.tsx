import { useEffect, useMemo, useState } from "react";
import { Layout } from "../components/Layout";
import { InventoryCard } from "../components/InventoryCard";
import { LogForm } from "../components/LogForm";
import { LogList } from "../components/LogList";
import { getInventory, updateInventory } from "../firebase/inventory.repo";
import { createLog, listLogs } from "../firebase/logs.repo";
import { PRODUCTS, type ProductKey } from "../domain/products";
import type { CoffeeLog, CreateCoffeeLogInput } from "../domain/types";

function emptyInventory(): Record<ProductKey, string> {
  return Object.fromEntries(
    PRODUCTS.map((p) => [p.key, ""])
  ) as Record<ProductKey, string>;
}

function toStartOfDay(dateStr: string) {
  const d = new Date(`${dateStr}T00:00:00`);
  return isNaN(d.getTime()) ? null : d;
}

function toEndOfDay(dateStr: string) {
  const d = new Date(`${dateStr}T23:59:59.999`);
  return isNaN(d.getTime()) ? null : d;
}

export default function Dashboard() {
  const [inv, setInv] = useState<Record<ProductKey, string>>(emptyInventory());
  const [logs, setLogs] = useState<CoffeeLog[]>([]);
  const [loadingInv, setLoadingInv] = useState(false);
  const [loadingLog, setLoadingLog] = useState(false);

  const [responsibleFilter, setResponsibleFilter] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");

  const lowStock = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const val = inv[p.key];
      const n = parseFloat(val);
      return !isNaN(n) && n <= 2;
    }).map((p) => p.label);
  }, [inv]);

  async function refresh() {
    const [inventory, lastLogs] = await Promise.all([
      getInventory(),
      listLogs(100),
    ]);

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

  const filteredLogs = useMemo(() => {
    const responsible = responsibleFilter.trim().toLowerCase();
    const start = startDateFilter ? toStartOfDay(startDateFilter) : null;
    const end = endDateFilter ? toEndOfDay(endDateFilter) : null;

    return logs.filter((log) => {
      const matchesResponsible =
        !responsible ||
        (log.cleanedBy ?? "").toLowerCase().includes(responsible);

      const createdAt = log.createdAt ?? null;

      const matchesStart =
        !start || (createdAt ? createdAt.getTime() >= start.getTime() : false);

      const matchesEnd =
        !end || (createdAt ? createdAt.getTime() <= end.getTime() : false);

      return matchesResponsible && matchesStart && matchesEnd;
    });
  }, [logs, responsibleFilter, startDateFilter, endDateFilter]);

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
            setInv((prev) => ({
              ...prev,
              [key]: next,
            }))
          }
          onSave={handleSaveInventory}
        />

        <LogForm onSubmit={handleSubmitLog} loading={loadingLog} />
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <div style={{ fontWeight: 800 }}>Filtros do histórico</div>
        <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>
          Filtre por responsável e intervalo de criação do registro
        </div>

        <hr />

        <div className="grid cols-2" style={{ gap: 10 }}>
          <div>
            <label>Responsável</label>
            <input
              value={responsibleFilter}
              onChange={(e) => setResponsibleFilter(e.target.value)}
              placeholder="Ex: Guilherme"
            />
          </div>

          <div>
            <label>Data inicial</label>
            <input
              type="date"
              value={startDateFilter}
              onChange={(e) => setStartDateFilter(e.target.value)}
            />
          </div>

          <div>
            <label>Data final</label>
            <input
              type="date"
              value={endDateFilter}
              onChange={(e) => setEndDateFilter(e.target.value)}
            />
          </div>

          <div className="row" style={{ alignItems: "end" }}>
            <button
              type="button"
              onClick={() => {
                setResponsibleFilter("");
                setStartDateFilter("");
                setEndDateFilter("");
              }}
            >
              Limpar filtros
            </button>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <LogList logs={filteredLogs} />
      </div>
    </Layout>
  );
}