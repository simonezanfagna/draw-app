import { Navigate } from "react-router-dom";
import { AppContext } from "../../context";
import { useContext } from "react";

export default function ProtectedRoute({ children }) {
  const { user, isGettingUser } = useContext(AppContext);

  if (isGettingUser) {
    return;
  } else {
    if (user === null) {
      return <Navigate to="landing" />;
    }
    return children;
  }
}
