import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Scroll-reveal "before" states only apply once this is set, so if the
// script is slow or fails, content renders in place instead of hidden.
document.documentElement.classList.add("motion-ok");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
