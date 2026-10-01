import "./App.css";
// import UsersList from "./api/UserList";
import BoardCanavas from "./api/Boardcanvas";

function App() {
  const test_id = "c4630669-91d9-42d4-8614-f52fe7b01fc2";
  return (
    <div>
      <h1>Skill Tree</h1>
      <BoardCanavas boardId={test_id} />
    </div>
  );
}

export default App;
