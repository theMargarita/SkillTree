import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
// import BoardPage from "./features/board/BoardPage";
import DashboardPage from "./features/dashboardPage/dashboardPage";
import BoardRoute from "./features/board/BoardRoute";

// const testBoardId = "8a0bf5b5-a768-4681-b32c-478fae3a47b4";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/boards/:boardId" element={<BoardRoute />} />
        <Route
          path="*"
          element={
            <p>
              Page not found. <Link to="/">Back to boards</Link>
            </p>
          }
        />
      </Routes>
    </BrowserRouter>
    // <div>
    //   <h1>Skill Tree</h1>
    //   <BoardPage boardId={testBoardId} />
    // </div>
  );
}

export default App;
