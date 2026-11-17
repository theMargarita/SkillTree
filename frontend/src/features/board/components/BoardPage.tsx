import { useState } from "react";
import type { SkillResponse } from "../../../shared/types/skills";
import BoardCanvas from "./BoardCanvas";
import SkillModal from "../../skill/components/SkillCard/SkillModal";
import AddSkillModal from "../../skill/components/AddSkillModal";
import RemoveSkillModal from "../../skill/components/RemoveSkillModal";

interface BoardPageProps {
  boardId: string;
}

export default function BoardPage({ boardId }: BoardPageProps) {
  const [selected, setSelected] = useState<SkillResponse | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [addingAt, setAddingAt] = useState<number | null>(null);
  const [removing, setRemoving] = useState<SkillResponse | null>(null);
  const [connecting, setConnecting] = useState<{
    fromSkillId: string;
    toSkillId: string;
  } | null>(null);
  const [instructionsOpen, setInstructionsOpen] = useState(false);

  const onConnectionRequested = () => {
    setConnecting({
      fromSkillId: selected?.id || "",
      toSkillId: "",
    });
  };

  return (
    <>
      <BoardCanvas
        boardId={boardId}
        reloadKey={reloadKey}
        onSkillClick={setSelected}
        onAddSkill={(existingCount) => {
          setSelected(null); //the side panel sit behind the modal
          setAddingAt(existingCount);
        }}
      />

      {selected && (
        <SkillModal
          key={selected.id}
          skill={selected}
          // skillId={selected.id}
          // skillName={selected.name}
          onClose={() => setSelected(null)}
          onChanged={() => setReloadKey((k) => k + 1)}
          onSkillUpdated={(updated) => {
            setSelected(updated);
          }}
          onRemovingRequested={() => {
            setRemoving(selected);
            setSelected(null);
          }}
        />
      )}

      {addingAt !== null && (
        <AddSkillModal
          boardId={boardId}
          existingCount={addingAt}
          onClose={() => setAddingAt(null)}
          onCreated={() => {
            setAddingAt(null);
            setReloadKey((k) => k + 1); //refetch so teh new skill appears
          }}
        />
      )}

      {removing && (
        <RemoveSkillModal
          skillId={removing.id}
          skillName={removing.name}
          onClose={() => setRemoving(null)}
          onRemoved={() => {
            setRemoving(null);
            setReloadKey((key) => key + 1);
          }}
        />
      )}

      {connecting && (
        <div>
          <p>
            Connecting {connecting.fromSkillId} to {connecting.toSkillId}...
          </p>
          <button onClick={onConnectionRequested}>Cancel</button>
        </div>
      )}

      <button
        type="button"
        className="help-button"
        onClick={() => setInstructionsOpen(true)}
        aria-label="Open instructions"
      >
        ?
      </button>

      {instructionsOpen && (
        <aside className="instructions-panel" aria-label="How to use SkillTree">
          <div className="instructions-panel__header">
            <h2>How to use SkillTree</h2>

            <button
              type="button"
              onClick={() => setInstructionsOpen(false)}
              aria-label="Close instructions"
            >
              ×
            </button>
          </div>

          <ol>
            <li>Click a skill to open its details.</li>
            <li>Drag a skill to move it around the board.</li>
            <li>Use the connection handle to connect skills.</li>
            <li>Click a subskill to view its progress.</li>
            <li>Add notes or images in the progress section.</li>
            <li>Click an image to enlarge it.</li>
          </ol>
        </aside>
      )}
    </>
  );
}
