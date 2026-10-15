import { useState } from "react";
import type { SkillResponse } from "../../types/skills";
import BoardCanvas from "./BoardCanvas";
import SkillDetailPanel from "./SkillDetailPanel";

interface BoardPageProps {
  boardId: string;
}

export default function BoardPage({ boardId }: BoardPageProps) {
  const [selected, setSelected] = useState<SkillResponse | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  return (
    <>
      <BoardCanvas
        boardId={boardId}
        reloadKey={reloadKey}
        onSkillClick={setSelected}
      />
      {selected && (
        <SkillDetailPanel
          key={selected.id}
          skillId={selected.id}
          skillName={selected.name}
          onClose={() => setSelected(null)}
          onChanged={() => setReloadKey((key) => key + 1)}
        />
      )}
    </>
  );
}
