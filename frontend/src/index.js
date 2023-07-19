import React from "react";
import { HelmetProvider } from "react-helmet-async";
import { createRoot } from "react-dom/client";
import App from "./components/App";
import { StoreProvider } from "./Store";

createRoot(document.getElementById("root")).render(
  <StoreProvider>
    <HelmetProvider>
      <App tab="home" />
    </HelmetProvider>
  </StoreProvider>
);
