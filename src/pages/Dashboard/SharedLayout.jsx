import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";

export default function SharedLayout() {
  return (
    <div className="dashboard_container">
      <Navbar />
      <Outlet />
    </div>
  );
}
