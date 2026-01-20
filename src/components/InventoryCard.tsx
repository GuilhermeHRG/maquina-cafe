import type { ProductKey } from "../domain/products";
import { PRODUCTS } from "../domain/products";
import { parseDecimalInput } from "../domain/number";

export function InventoryCard({
    items,
    onChange,
    onSave,
    loading,
}: {
    items: Record<ProductKey, number>;
    onChange: (key: ProductKey, next: number) => void;
    onSave: () => void;
    loading: boolean;
}) {
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
                {PRODUCTS.map((p) => (
                    <div key={p.key} className="row space">
                        <div>
                            <div style={{ fontWeight: 700 }}>{p.label}</div>
                            <div style={{ color: "var(--muted)", fontSize: 12 }}>{p.key}</div>
                        </div>

                        <div style={{ width: 120 }}>
                            <input
                                type="number"
                                step="0.01"   
                                min="0"
                                value={String(items[p.key] ?? 0)}
                                onChange={(e) => onChange(p.key, parseDecimalInput(e.target.value))}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
