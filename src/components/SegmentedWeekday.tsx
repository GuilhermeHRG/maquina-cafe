import { WEEKDAYS, type AllowedWeekday } from "../domain/products";

export function SegmentedWeekday({
  value,
  onChange,
}: {
  value: AllowedWeekday;
  onChange: (v: AllowedWeekday) => void;
}) {
  return (
    <div className="row" style={{ gap: 8, flexWrap: "wrap" }} >
      {WEEKDAYS.map((w) => (
        <button
          key={w.key}
          type="button"
          className={value === w.key ? "" : "secondary"}
          onClick={() => onChange(w.key)}
          style={{ padding: "8px 10px" }}
        >
          {w.label}
        </button>
      ))}
    </div>
  );
}
