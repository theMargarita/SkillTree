import "./App.css";
import Boards from "./features/boards";

const test_id = "8a0bf5b5-a768-4681-b32c-478fae3a47b4";

function App() {
  return (
    <div>
      <h1>Skill Tree</h1>
      <Boards boardId={test_id} />
    </div>
  );
}

export default App;
