import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import "./i18n/config";
import App from "./App.tsx";
import { AccessGate } from "./components/AccessGate";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <AccessGate>
      <App />
    </AccessGate>
  </HelmetProvider>
);
