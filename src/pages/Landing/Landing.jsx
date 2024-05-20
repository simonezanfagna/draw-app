import { Link } from "react-router-dom";
import "./Landing.scss";

export default function Landing() {
  return (
    <div className="landing_container">
      <h1>Draw App</h1>
      <div className="landing_main">
        <div className="landing_main_content">
          <h2>Draw in black and white</h2>
          <p>
            Welcome to Draw App, your web app for creating black and white
            drawings with ease and creativity.
          </p>
          <Link to="/register" className="btn_white">
            Login/Register
          </Link>
        </div>
      </div>
    </div>
  );
}
