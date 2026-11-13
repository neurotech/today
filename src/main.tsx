import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";
import "./index.css";
import { DialogProvider } from "./context/dialog-context.tsx";
import { ConfigProvider } from "./context/config-context.tsx";
import { LightboxProvider } from "./context/lightbox-context.tsx";

const root = document.getElementById("root");

if (root) {
  createRoot(root).render(
    <StrictMode>
      <ConfigProvider>
        <DialogProvider>
          <LightboxProvider>
            <App />
          </LightboxProvider>
        </DialogProvider>
      </ConfigProvider>
    </StrictMode>,
  );
}
