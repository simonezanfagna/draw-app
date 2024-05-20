import React from "react";
import ReactDOM from "react-dom/client";
import ContextAPI from "./context";
import App from "./App.jsx";
import "./main.scss";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ContextAPI>
      <App />
    </ContextAPI>
  </React.StrictMode>
);
