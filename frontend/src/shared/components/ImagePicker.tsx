import { useRef, useState } from "react";
import { fileToResizedDataUrl } from "../utils/image";

interface ImagePickerProps {
  value: string | null;
  onChange: (value: string | null) => void;
  onBusyChange?: (busy: boolean) => void;
}

export default function ImagePicker({
  value,
  onChange,
  onBusyChange,
}: ImagePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // so choosing the same file again still fires
    if (!file) return;

    setError(null);
    setBusy(true);
    onBusyChange?.(true);
    try {
      onChange(await fileToResizedDataUrl(file));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not read the image.",
      );
    } finally {
      setBusy(false);
      onBusyChange?.(false);
    }
  }

  return (
    <div className="image-picker">
      <span className="modal__label">Goal image (optional)</span>

      {value && (
        <img className="image-picker__preview" src={value} alt="Preview" />
      )}

      <div className="image-picker__actions">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
        >
          {busy ? "Processing..." : value ? "Replace image" : "Choose image"}
        </button>
        {value && (
          <button type="button" onClick={() => onChange(null)} disabled={busy}>
            Remove
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        onChange={handleFile}
        hidden
      />

      {error && <p className="modal__error">{error}</p>}
    </div>
  );
}
