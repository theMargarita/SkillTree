import BoardPage from "./features/board/BoardPage";

const testBoardId = "8a0bf5b5-a768-4681-b32c-478fae3a47b4";

function App() {
  return (
    <div>
      <h1>Skill Tree</h1>
      <BoardPage boardId={testBoardId} />
    </div>
  );
}

export default App;
