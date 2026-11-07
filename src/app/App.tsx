import { FluentProvider } from "@fluentui/react-components";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes";
import { appTheme } from "./theme";
import { GameDataProvider } from "../hooks/GameDataContext";
import "../styles/global.css";

export function App() {
  return (
    <FluentProvider theme={appTheme} className="fluent-root">
      <GameDataProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </GameDataProvider>
    </FluentProvider>
  );
}
