import { useState } from "react";
import type { SkillResponse } from "../types/skills";
import BoardCanvas from "../api/Boardcanvas";
import SkillDetailPanel from "./SkilldetailPanel";

interface BoardPageProps {
  boardId: string;
}

export default function ({ boardId }: BoardPageProps) {
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
          skillName={selected.id}
          onClose={() => setSelected(null)}
          onChanged={() => setReloadKey((k) => k + 1)}
        />
      )}
    </>
  );
}
