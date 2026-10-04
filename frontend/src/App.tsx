import { useState } from "react";
import "./App.css";
// import UsersList from "./api/UserList";
import BoardCanavas from "./api/Boardcanvas";
import type { SkillResponse } from "./types/skills";
import SkillDetailPanel from "./features/SkilldetailPanel";

const test_id = "c4630669-91d9-42d4-8614-f52fe7b01fc2";
function App() {
  const [selectSkill, setSelectSkill] = useState<SkillResponse | null>(null);
  return (
    <div>
      <h1>Skill Tree</h1>
      <BoardCanavas boardId={test_id} onSkillClick={setSelectSkill} />

      {selectSkill && (
        <SkillDetailPanel
          skillId={selectSkill.id}
          skillName={selectSkill.name}
          onClose={() => setSelectSkill(null)}
        />
      )}
    </div>
  );
}

export default App;
