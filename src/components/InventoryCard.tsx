import { useMemo, useState } from "react";
import type { ProductKey } from "../domain/products";
import { PRODUCTS } from "../domain/products";
import { parseDecimalInput } from "../domain/number";

// Formata o valor para exibir como "2 + 3/4" quando for múltiplo de 0.25
function formatQuarterFriendly(value: number): string {
    const v = Number(value ?? 0);
    if (!Number.isFinite(v)) return "0";

    // evita 2.7499999
    const rounded = Math.round(v * 100) / 100;

    // converte para "quartos" e valida encaixe exato
    const q = Math.round(rounded * 4);
    const back = q / 4;

    // se não encaixar perfeitamente em 1/4, mostra decimal normal
    if (Math.abs(rounded - back) > 1e-9) {
        return String(rounded);
    }

    const whole = Math.floor(q / 4);
    const num = q % 4;

    if (num === 0) return String(whole);
    if (whole === 0) return `${num}/4`;
    return `${whole} + ${num}/4`;
}

export function InventoryCard({
    items,
    onChange,
    onSave,
    loading,
}: {
    items: Record<ProductKey, string>;
    onChange: (key: ProductKey, next: string) => void;
    onSave: () => void;
    loading: boolean;
}) {
    const displayByKey = useMemo(() => {
        const out = {} as Record<ProductKey, string>;
        PRODUCTS.forEach((p) => {
            out[p.key] = items[p.key] ?? "";
        });
        return out;
    }, [items]);



    // ✅ guarda só o que o usuário está digitando (override)
    const [draftOverrides, setDraftOverrides] = useState<Partial<Record<ProductKey, string>>>({});

    return (
        <div className="card">
            <div className="row space">
                <div>
                    <div style={{ fontWeight: 800 }}>Estoque atual</div>
                    <div style={{ color: "var(--muted)", fontSize: 13 }}>
                        Ajuste manual do estoque
                    </div>
                </div>
                <button type="button" onClick={onSave} disabled={loading}>
                    {loading ? "Salvando..." : "Salvar"}
                </button>
            </div>

            <hr />

            <div className="grid" style={{ gap: 10 }}>
                {PRODUCTS.map((p) => {
                    const value = draftOverrides[p.key] ?? displayByKey[p.key] ?? "0";

                    return (
                        <div key={p.key} className="row space">
                            <div>
                                <div style={{ fontWeight: 700 }}>{p.label}</div>
                                <div style={{ color: "var(--muted)", fontSize: 12 }}>{p.key}</div>
                            </div>

                            <div style={{ width: 120 }}>
                                <input
                                    type="text"
                                    inputMode="text" // <- troque aqui (ou remova essa linha)
                                    placeholder="ex: 2 + 3/4"
                                    value={value}
                                    onChange={(e) => {
                                        const val = e.target.value;

                                        setDraftOverrides((d) => ({
                                            ...d,
                                            [p.key]: val,
                                        }));

                                        // atualiza o estado do Dashboard imediatamente
                                        onChange(p.key, val);
                                    }}
                                    onBlur={() => {
                                        const raw = (draftOverrides[p.key] ?? "").trim();

                                        setDraftOverrides((d) => ({
                                            ...d,
                                            [p.key]: raw,
                                        }));
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}