import { useState } from "react";
import type { SkillResponse } from "../../shared/types/skills";
import BoardCanvas from "../../features/board/components/BoardCanvas";
// import SkillDetailPanel from "../../features/skill-detail/components/SkillDetailPanel";
import AddSkillModal from "../../features/skill/components/AddSkillModal";
import RemoveSkillModal from "../../features/skill/components/RemoveSkillModal";
import SkillModal from "../../features/skill/components/SkillCard.tsx/SkillModal";

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
    </>
  );
}
