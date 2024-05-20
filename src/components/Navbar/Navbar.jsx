import { useContext, useState } from "react";
import "./Navbar.scss";
import { AppContext } from "../../context";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaintbrush, faUser } from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
  const { user, logoutUser, setShowToolbar, showToolbar } =
    useContext(AppContext);
  const [userMenu, setUserMenu] = useState(false);

  const location = useLocation();
  const { pathname } = location;

  const handleLogoutUser = () => {
    logoutUser("/logout");
  };

  return (
    <div className="navbar">
      <div className="navbar_left">
        <Link className="logo" to="/">
          Draw App
        </Link>
      </div>
      <div className="navbar_right">
        {pathname === "/" && (
          <p onClick={() => setShowToolbar(!showToolbar)}>
            Tool <FontAwesomeIcon icon={faPaintbrush} />
          </p>
        )}
        {pathname === "/drawings" && <Link to="/">Canvas</Link>}
        <FontAwesomeIcon
          icon={faUser}
          className="user"
          onClick={() => setUserMenu(!userMenu)}
        />
        <div
          className={
            userMenu ? "user_container userMenuActive" : "user_container"
          }
        >
          <h3>Hello {user}</h3>
          <Link to="/drawings" onClick={() => setUserMenu(false)}>
            My drawings
          </Link>
          <p onClick={handleLogoutUser}>Logout</p>
        </div>
      </div>
    </div>
  );
}
