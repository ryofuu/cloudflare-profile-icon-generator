import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { App } from "@/ui/app";
import { AdminPage } from "@/ui/pages/admin";
import "@/ui/styles.css";

function Router() {
  if (window.location.pathname === "/admin") {
    return <AdminPage />;
  }
  return <App />;
}

const container = document.getElementById("root");
if (!container) {
  throw new Error("Root element was not found.");
}

const content = (
  <StrictMode>
    <Router />
  </StrictMode>
);

if (container.childElementCount > 0) {
  hydrateRoot(container, content);
} else {
  createRoot(container).render(content);
}
