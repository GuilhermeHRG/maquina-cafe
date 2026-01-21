import { useMemo, useState } from "react";
import { PRODUCTS, type AllowedWeekday, type ProductKey } from "../domain/products";
import { createLogSchema } from "../domain/validators";
import type { CreateCoffeeLogInput } from "../domain/types";
import { SegmentedWeekday } from "./SegmentedWeekday";

function todayYYYYMMDD() {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
}



function emptyRestocked(): Record<ProductKey, boolean> {
    return Object.fromEntries(PRODUCTS.map((p) => [p.key, false])) as Record<ProductKey, boolean>;
}

export function LogForm({
    onSubmit,
    loading,
}: {
    onSubmit: (input: CreateCoffeeLogInput) => Promise<void>;
    loading: boolean;
}) {
    const [date, setDate] = useState(todayYYYYMMDD());
    const [weekday, setWeekday] = useState<AllowedWeekday>("MON");
    const [cleaned, setCleaned] = useState(true);
    const [cleanedBy, setCleanedBy] = useState("");
    const [restocked, setRestocked] = useState<Record<ProductKey, boolean>>(emptyRestocked());
    const [notes, setNotes] = useState("");

    const payload = useMemo<CreateCoffeeLogInput>(() => {
        const base: CreateCoffeeLogInput = { date, weekday, cleaned, cleanedBy, restocked };

        const trimmed = notes.trim();
        return trimmed ? { ...base, notes: trimmed } : base;
    }, [date, weekday, cleaned, cleanedBy, restocked, notes]);



    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const parsed = createLogSchema.safeParse(payload);
        if (!parsed.success) return;

        await onSubmit(parsed.data as CreateCoffeeLogInput);


        setCleanedBy("");
        setRestocked(emptyRestocked());
        setNotes("");
    }

    return (
        <div className="card">
            <div style={{ fontWeight: 800 }}>Novo registro</div>
            <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>
                Registre a limpeza e o que foi reabastecido
            </div>

            <hr />

            <form onSubmit={handleSubmit} className="grid" style={{ gap: 10 }}>
                <div className="grid" style={{ gap: 10 }}>
                    <div>
                        <label>Data</label>
                        <input value={date} onChange={(e) => setDate(e.target.value)} placeholder="YYYY-MM-DD" readOnly />
                    </div>

                    <div>
                        <label>Dia da semana</label>
                        <div style={{ marginTop: 8 }}>
                            <SegmentedWeekday value={weekday} onChange={setWeekday} />
                        </div>
                    </div>
                </div>

                <div className="grid" style={{ gap: 10 }}>
                    <div className="row space">
                        <div>
                            <div style={{ fontWeight: 700 }}>Máquina foi limpa?</div>
                            <div style={{ color: "var(--muted)", fontSize: 12 }}>Marque se a limpeza foi feita</div>
                        </div>
                        <input
                            style={{ width: 20, height: 20 }}
                            type="checkbox"
                            checked={cleaned}
                            onChange={(e) => setCleaned(e.target.checked)}
                        />
                    </div>

                    <div>
                        <label>Nome de quem limpou</label>
                        <input value={cleanedBy} onChange={(e) => setCleanedBy(e.target.value)} placeholder="Ex: Guilherme" />
                    </div>
                </div>

                <div>
                    <label>Produtos reabastecidos</label>
                    <div className="grid" style={{ gap: 8, marginTop: 8 }}>
                        {PRODUCTS.map((p) => (
                            <div key={p.key} className="row space">
                                <div style={{ fontWeight: 700 }}>{p.label}</div>
                                <input
                                    style={{ width: 20, height: 20 }}
                                    type="checkbox"
                                    checked={!!restocked[p.key]}
                                    onChange={(e) => setRestocked((prev) => ({ ...prev, [p.key]: e.target.checked }))}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <label>Observações (opcional)</label>
                    <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Ex: Acabou café..." />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? "Salvando..." : "Salvar registro"}
                </button>
            </form>
        </div>
    );
}
