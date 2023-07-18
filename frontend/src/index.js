import React from "react";
import { HelmetProvider } from "react-helmet-async";
import { createRoot } from "react-dom/client";
import App from "./components/App";

createRoot(document.getElementById("root")).render(
  <HelmetProvider>
    <App tab="home" />
  </HelmetProvider>
);
