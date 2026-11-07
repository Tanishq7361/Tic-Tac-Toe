import { Avatar, Button, Tab, TabList, Toolbar, ToolbarButton, Tooltip } from "@fluentui/react-components";
import {
  GridRegular,
  HistoryRegular,
  HomeRegular,
  SettingsRegular,
} from "@fluentui/react-icons";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Link, useLocation, useNavigate, useOutlet } from "react-router-dom";
import { useGameData } from "../hooks/GameDataContext";

const navigation = [
  { route: "/", label: "Dashboard", icon: <HomeRegular /> },
  { route: "/play", label: "Play", icon: <GridRegular /> },
  { route: "/history", label: "Game History", icon: <HistoryRegular /> },
  { route: "/settings", label: "Settings", icon: <SettingsRegular /> },
];

export function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const outlet = useOutlet();
  const reducedMotion = useReducedMotion();
  const { data, startNewGame } = useGameData();
  const selected = navigation.find(({ route }) => route === location.pathname)?.route ?? "/";
  const animate = !reducedMotion && data.settings.motion;

  return (
    <div className={`app-shell ${data.settings.motion ? "" : "motion-disabled"}`}>
      <header className="app-header">
        <Toolbar aria-label="App toolbar" className="header-toolbar">
          <Link to="/" className="brand-link" aria-label="Tic-Tac-Toe dashboard">
            <span className="brand-mark" aria-hidden="true"><GridRegular /></span>
            <span>Tic-Tac-Toe</span>
          </Link>
          <span className="header-context">Your personal game hub</span>
          <div className="header-player">
            <span className="header-player-label">Player dashboard</span>
            <Avatar name="Jordan" color="brand" />
          </div>
          <Tooltip content="Settings" relationship="label">
            <ToolbarButton
              aria-label="Open settings"
              icon={<SettingsRegular />}
              onClick={() => navigate("/settings")}
            />
          </Tooltip>
        </Toolbar>
      </header>

      <nav className="primary-nav" aria-label="Main navigation">
        <TabList
          selectedValue={selected}
          onTabSelect={(_, data) => navigate(String(data.value))}
          className="navigation-tabs"
        >
          {navigation.map((item) => (
            <Tab key={item.route} value={item.route} icon={item.icon}>
              {item.label}
            </Tab>
          ))}
        </TabList>
        <Button className="nav-quick-play" appearance="primary" icon={<GridRegular />} onClick={() => { startNewGame(); navigate("/play"); }}>
          New game
        </Button>
      </nav>

      <div className="route-viewport">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            className="route-content"
            initial={animate ? { opacity: 0, y: 12 } : false}
            animate={{ opacity: 1, y: 0 }}
            exit={animate ? { opacity: 0, y: -8 } : undefined}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
          >
            {outlet}
          </motion.div>
        </AnimatePresence>
      </div>

      <footer className="app-footer">
        <span>Tic-Tac-Toe · Your personal game dashboard</span>
        <span>Every move tells a story.</span>
      </footer>
    </div>
  );
}
