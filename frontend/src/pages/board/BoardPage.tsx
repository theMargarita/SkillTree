import { useState } from "react";
import type { SkillResponse } from "../../shared/types/skills";
import BoardCanvas from "../../features/board/components/BoardCanvas";
import SkillDetailPanel from "../../features/skill-detail/components/SkillDetailPanel";
import AddSkillModal from "../../features/skill/components/AddSkillModal";

interface BoardPageProps {
  boardId: string;
}

export default function BoardPage({ boardId }: BoardPageProps) {
  const [selected, setSelected] = useState<SkillResponse | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [addingAt, setAddingAt] = useState<number | null>(null);

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
        <SkillDetailPanel
          key={selected.id}
          skillId={selected.id}
          skillName={selected.name}
          onClose={() => setSelected(null)}
          onChanged={() => setReloadKey((k) => k + 1)}
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
    </>
  );
}
