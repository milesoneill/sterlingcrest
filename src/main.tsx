import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initBotId } from "botid/client/core";

initBotId({
  protect: [
    {
      path: "/api/booking",
      method: "POST",
      advancedOptions: { checkLevel: "basic" },
    },
  ],
});

createRoot(document.getElementById("root")!).render(<App />);
