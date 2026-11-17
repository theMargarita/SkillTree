import { BrowserRouter, Route, Routes } from "react-router-dom";
// import BoardPage from "./pages/board/BoardPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import BoardRoute from "./pages/board/BoardRoute";
import "./shared/styles/globals.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/boards/:boardId" element={<BoardRoute />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
