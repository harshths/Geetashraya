import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { PlayerContextProvider } from "./context/PlayerContext.jsx";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./context/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <PlayerContextProvider>
        <App />
      </PlayerContextProvider>
    </AuthProvider>
  </BrowserRouter>,
);
