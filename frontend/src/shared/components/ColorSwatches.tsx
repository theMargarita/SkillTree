const SWATCHES: (string | null)[] = [
  null,
  "#2bd4c4",
  "#f4c542",
  "#ff5a1f",
  "#6c8cff",
  "#b56cff",
  "#e8e6e1",
];

interface ColorSwatchesProps {
  value: string | null;
  onChange: (color: string | null) => void;
}

export default function ColorSwatches({ value, onChange }: ColorSwatchesProps) {
  return (
    <div className="swatches">
      {SWATCHES.map((s) => (
        <button
          type="button"
          key={s ?? "none"}
          className={`swatch ${value === s ? "is-selected" : ""} ${s === null ? "swatch--none" : ""}`}
          style={s ? { background: s } : undefined}
          onClick={() => onChange(s)}
          aria-label={s ?? "No colour"}
          title={s ?? "No colour"}
        />
      ))}
    </div>
  );
}
