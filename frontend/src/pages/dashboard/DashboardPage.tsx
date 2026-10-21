import { Link } from "react-router-dom";

export default function DashboardPage() {
  return (
    <div>
      <h1>My boards</h1>
      <Link to="/boards/c4630669-91d9-42d4-8614-f52fe7b01fc2">
        Concept Art Board
      </Link>
    </div>
  );
}
