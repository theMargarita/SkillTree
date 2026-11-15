import { useState } from "react";
import "../styles/progress-entry.css";
import { useProgressEntries } from "../hooks/useProgressEntries";
import ImagePicker from "../../../shared/components/ImagePicker";

interface ProgressEntryFormProps {
  subSkillId: string;
}

export default function ProgressEntryForm({
  subSkillId,
}: ProgressEntryFormProps) {
  const { entries, loading, error, addEntry } = useProgressEntries(subSkillId);
  const [text, setText] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageBusy, setImageBusy] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    if (!text.trim() && !imageUrl) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      await addEntry(text.trim(), imageUrl);
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
              {entry.contentText && <p>{entry.contentText}</p>}

              {entry.imageUrl && (
                <img
                  src={entry.imageUrl}
                  alt="Progress evidence"
                  className="progress-entry__image"
                />
              )}
              

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
        <ImagePicker
          value={imageUrl}
          onChange={setImageUrl}
          onBusyChange={setImageBusy}
        />

        {submitError && (
          <p className="progress-entries__error">{submitError}</p>
        )}
        <button
          type="submit"
          disabled={submitting || (!text.trim() && !imageUrl)}
        >
          {submitting ? "Adding..." : "Add entry"}
        </button>
      </form>
    </div>
  );
}
