import { BrowserRouter, Route, Routes } from "react-router-dom";
// import BoardPage from "./pages/board/BoardPage";
import DashboardPage from "./features/board/dashboard/DashboardPage";
import BoardRoute from "./features/board/components/BoardRoute";
import "./shared/styles/globals.css";
import { Analytics } from "@vercel/analytics/react";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/boards/:boardId" element={<BoardRoute />} />
        </Routes>
      </BrowserRouter>

      <Analytics />
    </>
  );
}

export default App;
