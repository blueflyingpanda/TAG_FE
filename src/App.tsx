import { useEffect, useState } from "react";
import CreateTheme from "./components/CreateTheme";
import GameHistory from "./components/GameHistory";
import GamePlay from "./components/GamePlay";
import GameSetup from "./components/GameSetup";
import Login from "./components/Login";
import RoundResults from "./components/RoundResults";
import ThemeSelection from "./components/ThemeSelection";
import type { GameSettings, GameState, Theme } from "./types";
import { checkWinCondition, initializeGameState } from "./utils/game";
import { storage } from "./utils/storage";

type AppScreen =
  | "login"
  | "theme-selection"
  | "game-setup"
  | "game-play"
  | "round-results"
  | "game-history"
  | "create-theme";

function App() {
  const initialUser = storage.getUser();
  const [screen, setScreen] = useState<AppScreen>(() => {
    // Require authentication - if no user, always show login
    if (!initialUser) return "login";
    const savedState = storage.getGameState();
    if (savedState) return "game-play";
    return "theme-selection";
  });
  const [user, setUser] = useState(initialUser);
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(() => {
    // Only restore game state if user is authenticated
    return initialUser ? storage.getGameState() : null;
  });
  const [gameId, setGameId] = useState<string | null>(() => {
    // Generate or restore game ID
    const saved = localStorage.getItem("tag_current_game_id");
    return saved || null;
  });

  useEffect(() => {
    // Enforce authentication - redirect to login if user is not logged in
    if (!user && screen !== "login") {
      setScreen("login");
    }
  }, [user, screen]);

  useEffect(() => {
    // Sync game state if it exists and user is authenticated
    if (user) {
      const savedState = storage.getGameState();
      if (savedState && !gameState) {
        setGameState(savedState);
        setScreen("game-play");
      }
    }
  }, [gameState, user]);

  useEffect(() => {
    if (gameState) {
      storage.saveGameState(gameState);
      // TODO: Save to backend via API when backend is ready
    }
  }, [gameState]);

  const handleLogin = (userData: {
    id: string;
    email: string;
    username: string;
  }) => {
    storage.saveUser(userData);
    setUser(userData);
    setScreen("theme-selection");
  };

  const handleLogout = () => {
    storage.clearUser();
    setUser(null);
    setScreen("login");
  };

  const handleThemeSelect = (theme: Theme) => {
    setSelectedTheme(theme);
    setScreen("game-setup");
  };

  const handleGameStart = (settings: GameSettings) => {
    const newGameId = `game_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    setGameId(newGameId);
    localStorage.setItem("tag_current_game_id", newGameId);

    // Ensure round timer respects minimum (15s) even if caller passed a lower value
    const safeSettings = {
      ...settings,
      roundTimer: Math.max(settings.roundTimer, 15),
    };
    const newGameState = initializeGameState(safeSettings);
    setGameState(newGameState);
    setScreen("game-play");
  };

  const handleRoundEnd = (results: { word: string; guessed: boolean }[]) => {
    if (!gameState) return;
    // Ignore late or duplicate end signals if the game already has a winner
    // (for example a pending timeout firing after the round was already
    // confirmed) — in that case the game should have stopped.
    const existingWinner = checkWinCondition(gameState);
    if (existingWinner) return;

    // If we've already stored/processed round results for this round and
    // this incoming results array is empty, treat it as a duplicate/late
    // signal and ignore it. This prevents briefly showing an empty
    // RoundResults after the game has already transitioned.
    if (
      results.length === 0 &&
      gameState.roundResults &&
      gameState.roundResults.length === 0
    ) {
      return;
    }

    // Otherwise, show round results for the team to confirm their answers.
    // The winner check must run only after the team confirms in
    // `handleRoundResultsConfirm`.
    setGameState({ ...gameState, roundResults: results });
    setScreen("round-results");
  };

  const handleRoundResultsConfirm = (
    finalResults: { word: string; guessed: boolean }[]
  ) => {
    if (!gameState) return;

    const updatedState = { ...gameState };
    const currentTeam =
      gameState.settings.selectedTeams[gameState.currentTeamIndex];
    let scoreChange = 0;

    finalResults.forEach((result) => {
      if (result.guessed) {
        scoreChange += 1;
      } else if (gameState.settings.skipPenalty) {
        scoreChange -= 1;
      }
    });

    updatedState.teamScores[currentTeam] += scoreChange;
    updatedState.wordsUsed.push(...finalResults.map((r) => r.word));

    // Check if win condition is reached after updating score
    const winner = checkWinCondition(updatedState);

    if (winner) {
      // Game ends - show winner screen immediately
      storage.clearGameState();
      setGameState(updatedState);
      setScreen("game-play"); // Will show winner screen
      return;
    }

    // Move to next team
    updatedState.currentTeamIndex =
      (updatedState.currentTeamIndex + 1) %
      updatedState.settings.selectedTeams.length;

    // Only increment round when all teams have had their turn (back to first team)
    if (updatedState.currentTeamIndex === 0) {
      updatedState.currentRound += 1;
    }

    updatedState.roundResults = [];
    updatedState.isRoundActive = false;
    updatedState.roundStartTime = null;
    updatedState.currentWordIndex = 0;

    setGameState(updatedState);
    setScreen("game-play");
  };

  const handleGameEnd = () => {
    // TODO: Save completed game to backend via API when backend is ready
    // if (gameState && gameId) {
    //   const winner = checkWinCondition(gameState);
    //   await fetch('/api/games', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //       themeName: gameState.settings.theme.name,
    //       themeLang: gameState.settings.theme.lang,
    //       teams: gameState.settings.selectedTeams,
    //       finalScores: gameState.teamScores,
    //       pointsRequired: gameState.settings.pointsRequired,
    //       winner: winner,
    //     }),
    //   });
    // }

    storage.clearGameState();
    localStorage.removeItem("tag_current_game_id");
    setGameState(null);
    setGameId(null);
    setSelectedTheme(null);
    setScreen("theme-selection");
  };

  return (
    <div className="min-h-screen w-full bg-[#223164] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        {user && (
          <div className="mb-4 flex justify-between items-center text-white">
            <button
              onClick={() => {
                setScreen("theme-selection");
                setSelectedTheme(null);
              }}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                screen === "theme-selection"
                  ? "bg-white/20 text-white cursor-default"
                  : "bg-[#ECACAE] text-[#223164] hover:opacity-90"
              }`}
              disabled={screen === "theme-selection"}
            >
              Home
            </button>
            <div className="flex gap-4 items-center">
              <span className="text-sm">{user.email}</span>
              <button
                onClick={() => setScreen("game-history")}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  screen === "game-history"
                    ? "bg-white/20 text-white cursor-default"
                    : "bg-[#ECACAE] text-[#223164] hover:opacity-90"
                }`}
                disabled={screen === "game-history"}
              >
                History
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-[#ECACAE] text-[#223164] rounded-lg font-semibold hover:opacity-90 transition"
              >
                Logout
              </button>
            </div>
          </div>
        )}

        {screen === "login" && <Login onLogin={handleLogin} />}
        {screen === "theme-selection" && user && (
          <ThemeSelection
            user={user}
            onThemeSelect={handleThemeSelect}
            onImportTheme={(theme) => {
              storage.saveTheme(theme);
              handleThemeSelect(theme);
            }}
            onCreateTheme={() => setScreen("create-theme")}
          />
        )}
        {screen === "create-theme" && user && (
          <CreateTheme
            user={user}
            onBack={() => setScreen("theme-selection")}
            onThemeCreated={(theme) => {
              // Theme will be registered on backend (verified=false)
              // For now, just save locally and show success message
              console.log("Theme created and registered:", theme);
              setScreen("theme-selection");
            }}
          />
        )}
        {screen === "game-setup" && user && selectedTheme && (
          <GameSetup
            theme={selectedTheme}
            onStart={handleGameStart}
            onBack={() => setScreen("theme-selection")}
          />
        )}
        {screen === "game-play" && user && gameState && (
          <GamePlay
            gameState={gameState}
            setGameState={setGameState}
            onRoundEnd={handleRoundEnd}
            onGameEnd={handleGameEnd}
          />
        )}
        {screen === "round-results" && user && gameState && (
          <RoundResults
            results={gameState.roundResults}
            onConfirm={handleRoundResultsConfirm}
            onBack={() => setScreen("game-play")}
          />
        )}
        {screen === "game-history" && user && (
          <GameHistory
            onBack={() => setScreen("theme-selection")}
            onResumeGame={(gameState) => {
              const newGameId = `game_${Date.now()}_${Math.random()
                .toString(36)
                .substr(2, 9)}`;
              setGameId(newGameId);
              localStorage.setItem("tag_current_game_id", newGameId);
              setGameState(gameState);
              setScreen("game-play");
            }}
          />
        )}
      </div>
    </div>
  );
}

export default App;
