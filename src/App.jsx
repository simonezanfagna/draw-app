import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import Register from "./pages/Register/Register";
import SharedLayout from "./pages/Dashboard/SharedLayout";
import ProtectedRoute from "./pages/Dashboard/ProtectedRoute";
import Landing from "./pages/Landing/Landing";
import Error from "./pages/Error/Error";
import "./App.scss";
import Drawings from "./pages/Dashboard/Drawings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <SharedLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="drawings" element={<Drawings />} />
        </Route>
        <Route path="register" element={<Register />} />
        <Route path="landing" element={<Landing />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
