import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";
import "./index.css";
import { DialogProvider } from "./context/dialog-context.tsx";
import { ConfigProvider } from "./context/config-context.tsx";

const root = document.getElementById("root");

if (root) {
  createRoot(root).render(
    <StrictMode>
      <ConfigProvider>
        <DialogProvider>
          <App />
        </DialogProvider>
      </ConfigProvider>
    </StrictMode>,
  );
}
