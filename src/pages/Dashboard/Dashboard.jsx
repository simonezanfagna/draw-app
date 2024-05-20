import Canvas from "../../components/Canvas/Canvas";
import Toolbar from "../../components/Toolbar/Toolbar";
import "./Dashboard.scss";

export default function Dashboard() {
  return (
    <div className="draw_container">
      <Toolbar />
      <Canvas />
    </div>
  );
}
