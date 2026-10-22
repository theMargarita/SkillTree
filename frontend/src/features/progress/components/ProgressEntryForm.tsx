import { useState } from "react";
import "../styles/progress-entry.css";
import { useProgressEntries } from "../hooks/useProgressEntries";

interface ProgressEntryFormProps {
  subSkillId: string;
}

export default function ProgressEntryForm({
  subSkillId,
}: ProgressEntryFormProps) {
  const { entries, loading, error, addEntry } = useProgressEntries(subSkillId);
  const [text, setText] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  //this will do for now
  const handleImageUploader = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Chose anther format");
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setImage(imageUrl);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      await addEntry(text.trim());
      setText("");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="progress-entries">
      {loading && <p>Loading entries...</p>}
      {error && <p>Error: {error}</p>}

      {!loading && !error && (
        <ul className="progress-entries__list">
          {entries.map((entry) => (
            <li key={entry.id}>
              <p>{entry.contentText}</p>
              <time>{new Date(entry.createdAt).toLocaleDateString()}</time>
            </li>
          ))}
          {entries.length === 0 && (
            <li className="progress-entries__empty">No entries yet.</li>
          )}
        </ul>
      )}

      <form onSubmit={handleSubmit} className="progress-entries__form">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a note about your progress..."
          rows={2}
        />
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleImageUploader}
        />

        {image && (
          <div>
            <img
              src={image}
              alt="Förhandsgranskning"
              style={{
                maxWidth: "330px",
                maxHeight: "400px",
                objectFit: "contain",
              }}
            />
          </div>
        )}
        {submitError && (
          <p className="progress-entries__error">{submitError}</p>
        )}
        <button type="submit" disabled={submitting || !text.trim()}>
          {submitting ? "Adding..." : "Add entry"}
        </button>
      </form>
    </div>
  );
}
