import { PRODUCTS } from "../domain/products";
import type { CoffeeLog } from "../domain/types";

function weekdayLabel(key: string) {
  if (key === "SUN") return "Domingo";
  if (key === "MON") return "Segunda";
  if (key === "TUE") return "Terça";
  if (key === "WED") return "Quarta";
  if (key === "THU") return "Quinta";
  if (key === "FRI") return "Sexta";
  if (key === "SAT") return "Sábado";
  return key;
}

function formatDateBR(date: string) {
  if (!date) return "";

  if (date.includes("/")) return date;

  const [year, month, day] = date.split("-");
  if (!year || !month || !day) return date;

  return `${day}/${month}/${year}`;
}

function formatDateTimeBR(date?: Date | null) {
  if (!date) return "-";

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

export function LogList({ logs }: { logs: CoffeeLog[] }) {
  return (
    <div className="card">
      <div className="row space">
        <div>
          <div style={{ fontWeight: 800 }}>Últimos registros</div>
          <div style={{ color: "var(--muted)", fontSize: 13 }}>
            Histórico recente
          </div>
        </div>
        <span className="badge">{logs.length} itens</span>
      </div>

      <hr />

      <div className="grid" style={{ gap: 10 }}>
        {logs.map((l) => {
          const restockedLabels = PRODUCTS.filter((p) => l.restocked?.[p.key]).map((p) => p.label);

          return (
            <div key={l.id} className="card" style={{ padding: 12 }}>
              <div className="row space">
                <div style={{ fontWeight: 800 }}>
                  {formatDateBR(l.date)} • {weekdayLabel(l.weekday)}
                </div>
                <span className="badge">{l.cleaned ? "LIMPA" : "NÃO LIMPA"}</span>
              </div>

              <div style={{ marginTop: 8, color: "var(--muted)" }}>
                <div>
                  <b style={{ color: "var(--text)" }}>Responsável:</b> {l.cleanedBy || "-"}
                </div>

                <div>
                  <b style={{ color: "var(--text)" }}>Criado em:</b> {formatDateTimeBR(l.createdAt)}
                </div>

                <div>
                  <b style={{ color: "var(--text)" }}>Reabasteceu:</b>{" "}
                  {restockedLabels.length ? restockedLabels.join(", ") : "Nenhum"}
                </div>

                {l.notes ? (
                  <div style={{ marginTop: 6 }}>
                    <b style={{ color: "var(--text)" }}>Obs:</b> {l.notes}
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}