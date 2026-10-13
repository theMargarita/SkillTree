import { useState } from "react";
import "./App.css";
// import UsersList from "./api/UserList";
import BoardCanavas from "./api/Boardcanvas";
import type { SkillResponse } from "./types/skills";
import SkillDetailPanel from "./features/SkilldetailPanel";

const test_id = "8a0bf5b5-a768-4681-b32c-478fae3a47b4";
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
