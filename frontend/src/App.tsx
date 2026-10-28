// import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
// import DashboardPage from "../pages/dashboard/DashboardPage";
// import BoardRoute from "../pages/board/BoardRoute";

import BoardPage from "./pages/board/BoardPage";

const testBoardId = "8a0bf5b5-a768-4681-b32c-478fae3a47b4";

function App() {
  return (
    // <BrowserRouter>
    //   <Routes>
    //     <Route path="/" element={<DashboardPage />} />
    //     <Route path="/boards/:boardId" element={<BoardRoute />} />
    //     <Route
    //       path="*"
    //       element={
    //         <p>
    //           Page not found. <Link to="/">Back to boards</Link>
    //         </p>
    //       }
    //     />
    //   </Routes>
    // </BrowserRouter>
    <div>
      <BoardPage boardId={testBoardId} />
    </div>
  );
}

export default App;
