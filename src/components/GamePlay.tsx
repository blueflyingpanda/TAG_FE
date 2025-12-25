import type { PanInfo } from "framer-motion";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { GameState } from "../types";
import {
  checkWinCondition,
  getAvailableWords,
  getCurrentTeam,
  shuffleArray,
} from "../utils/game";

interface GamePlayProps {
  gameState: GameState;
  setGameState: (state: GameState) => void;
  onRoundEnd: (results: { word: string; guessed: boolean }[]) => void;
  onGameEnd: () => void;
}

export default function GamePlay({
  gameState,
  setGameState,
  onRoundEnd,
  onGameEnd,
}: GamePlayProps) {
  const [currentWord, setCurrentWord] = useState<string>("");
  const [roundWords, setRoundWords] = useState<string[]>([]);
  const [roundResults, setRoundResults] = useState<
    { word: string; guessed: boolean }[]
  >([]);
  const [currentTime, setCurrentTime] = useState(0);
  const timerIntervalRef = useRef<number | null>(null);
  const roundResultsRef = useRef<{ word: string; guessed: boolean }[]>([]);

  const [roundEndedByTimeout, setRoundEndedByTimeout] = useState(false);

  // Animation states
  const [cardExitX, setCardExitX] = useState(0);
  const [isCardExiting, setIsCardExiting] = useState(false);
  const [nextWord, setNextWord] = useState<string>("");

  const availableWords = getAvailableWords(
    gameState.settings.theme,
    gameState.wordsUsed
  );
  const currentTeam = getCurrentTeam(gameState);
  const remainingTime =
    gameState.isRoundActive && gameState.roundStartTime
      ? Math.max(
          0,
          Math.ceil(
            (gameState.settings.roundTimer * 1000 -
              (Date.now() - gameState.roundStartTime)) /
              1000
          )
        )
      : 0;

  // Update timer display every second
  useEffect(() => {
    if (gameState.isRoundActive && gameState.roundStartTime !== null) {
      timerIntervalRef.current = window.setInterval(() => {
        const startTime = gameState.roundStartTime;
        if (startTime === null) return;

        const time = Math.max(
          0,
          Math.ceil(
            (gameState.settings.roundTimer * 1000 - (Date.now() - startTime)) /
              1000
          )
        );
        setCurrentTime(time);

        if (time <= 0) {
          endRound(true); // Pass true to indicate timeout
        }
      }, 100);

      return () => {
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
        }
      };
    } else {
      setCurrentTime(0);
    }
  }, [
    gameState.isRoundActive,
    gameState.roundStartTime,
    gameState.settings.roundTimer,
  ]);

  // Auto-start next round if previous round ended by timeout
  useEffect(() => {
    if (
      roundEndedByTimeout &&
      !gameState.isRoundActive &&
      availableWords.length > 0
    ) {
      setRoundEndedByTimeout(false);
      startRound();
    }
  }, [roundEndedByTimeout, gameState.isRoundActive, availableWords.length]);

  const startRound = () => {
    if (availableWords.length === 0) {
      // When no words remain, find team(s) with highest score
      const maxScore = Math.max(...Object.values(gameState.teamScores));
      const winners = Object.entries(gameState.teamScores)
        .filter(([, score]) => score === maxScore)
        .map(([team]) => team);

      if (winners.length > 0) {
        // Don't call onGameEnd - let the winner display handle it
        return;
      }
      // No teams (shouldn't happen) - end the game
      onGameEnd();
      return;
    }

    const shuffled = shuffleArray([...availableWords]);
    setRoundWords(shuffled);
    const firstWord = shuffled[0] || "";
    setCurrentWord(firstWord);
    setRoundResults([]);
    roundResultsRef.current = [];

    setGameState({
      ...gameState,
      isRoundActive: true,
      roundStartTime: Date.now(),
      currentWordIndex: 0,
    });

    // Round start doesn't need API call - only results confirmation does
  };

  const endRound = (timedOut = false) => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    // Capture results IMMEDIATELY before any async operations
    const roundEndResults = [...roundResultsRef.current];

    setRoundEndedByTimeout(timedOut);

    setGameState({
      ...gameState,
      isRoundActive: false,
      roundEndTime: Date.now(),
    });

    // Get the latest results - don't count the last word if timer ended
    setTimeout(() => {
      setRoundResults(roundEndResults);
      onRoundEnd(roundEndResults);
    }, 100);
  };

  const handleWordAction = (guessed: boolean) => {
    if (!currentWord || isCardExiting) return;

    // Set animation direction based on action
    setIsCardExiting(true);
    setCardExitX(guessed ? 300 : -300);

    // Process the word action after animation starts
    setTimeout(() => {
      const newResults = [...roundResults, { word: currentWord, guessed }];
      setRoundResults(newResults);
      roundResultsRef.current = newResults;

      const nextIndex = gameState.currentWordIndex + 1;
      if (nextIndex >= roundWords.length) {
        // No more words - end round
        setIsCardExiting(false);
        setCardExitX(0);
        endRound();
        return;
      }

      const nextWordValue = roundWords[nextIndex];
      setNextWord(nextWordValue);
      setCurrentWord(nextWordValue);
      setGameState({
        ...gameState,
        currentWordIndex: nextIndex,
      });

      // Reset animation state
      setTimeout(() => {
        setIsCardExiting(false);
        setCardExitX(0);
        setNextWord("");
      }, 150);
    }, 200);
  };

  // Check for winners: either reached target score or no words left
  let winners: string[] = [];

  // First check if anyone reached the target score
  const targetWinners = checkWinCondition(gameState);
  if (targetWinners.length > 0) {
    winners = targetWinners;
  } else if (availableWords.length === 0) {
    // No words left - find team(s) with highest score
    const maxScore = Math.max(...Object.values(gameState.teamScores));
    winners = Object.entries(gameState.teamScores)
      .filter(([, score]) => score === maxScore)
      .map(([team]) => team);
  }

  if (winners.length > 0) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-xl max-w-2xl w-full mx-auto text-center">
        <h1 className="text-4xl font-bold text-white mb-4">🎉 Game Over!</h1>
        <h2 className="text-2xl font-semibold text-[#ECACAE] mb-8">
          {winners.length === 1
            ? `${winners[0]} Wins!`
            : `${winners.join(" & ")} Win!`}
        </h2>
        <div className="space-y-2 mb-8">
          {Object.entries(gameState.teamScores).map(([team, score]) => (
            <div key={team} className="flex justify-between text-white text-lg">
              <span>{team}</span>
              <span className="font-semibold">{score} points</span>
            </div>
          ))}
        </div>
        <button
          onClick={onGameEnd}
          className="px-8 py-3 bg-[#ECACAE] text-[#223164] rounded-lg font-semibold hover:opacity-90 transition"
        >
          New Game
        </button>
      </div>
    );
  }

  if (!gameState.isRoundActive) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-xl max-w-2xl w-full mx-auto text-center">
        <h1 className="text-3xl font-bold text-white mb-4">
          Round {gameState.currentRound}
        </h1>
        <h2 className="text-2xl font-semibold text-[#ECACAE] mb-6">
          {currentTeam}
        </h2>

        <div className="mb-6 p-4 bg-white/10 rounded-lg">
          <h3 className="text-white font-semibold mb-3">Current Scores</h3>
          <div className="space-y-2">
            {Object.entries(gameState.teamScores).map(([team, score]) => (
              <div key={team} className="flex justify-between text-white">
                <span
                  className={
                    team === currentTeam ? "font-semibold text-[#ECACAE]" : ""
                  }
                >
                  {team}
                </span>
                <span className="font-semibold">
                  {score} / {gameState.settings.pointsRequired}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/80 mb-8">
          {availableWords.length} words remaining
        </p>
        <button
          onClick={() => startRound()}
          className="px-8 py-4 bg-[#ECACAE] text-[#223164] rounded-lg font-semibold text-xl hover:opacity-90 transition"
        >
          Start Round
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-xl max-w-2xl w-full mx-auto">
      <div className="text-center mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="text-white/80">
            <div className="text-sm">Round {gameState.currentRound}</div>
            <div className="text-lg font-semibold">{currentTeam}</div>
          </div>
          <div className="text-white/80">
            <div className="text-sm">Time</div>
            <motion.div
              className="text-2xl font-bold text-[#ECACAE]"
              animate={{
                scale:
                  (currentTime || remainingTime) <= 5 &&
                  (currentTime || remainingTime) > 0
                    ? [1, 1.2, 1]
                    : 1,
                opacity:
                  (currentTime || remainingTime) <= 5 &&
                  (currentTime || remainingTime) > 0
                    ? [1, 0.5, 1]
                    : 1,
              }}
              transition={{
                duration: 0.5,
                repeat:
                  (currentTime || remainingTime) <= 5 &&
                  (currentTime || remainingTime) > 0
                    ? Infinity
                    : 0,
                repeatType: "loop",
              }}
            >
              {currentTime || remainingTime}s
            </motion.div>
          </div>
        </div>
        <div className="text-white/60 text-sm">
          {roundResults.length} / {roundWords.length} words
        </div>
      </div>

      <motion.div
        className="bg-white/20 rounded-2xl p-12 min-h-[300px] flex items-center justify-center select-none relative overflow-hidden"
        layout
      >
        <AnimatePresence mode="wait">
          {/* Next card (preview) */}
          {nextWord && (
            <motion.div
              key={`next-${nextWord}`}
              className="absolute inset-0 flex items-center justify-center bg-white/10 rounded-2xl"
              initial={{ scale: 0.8, y: 40, opacity: 0.5 }}
              animate={{ scale: 0.9, y: 20, opacity: 0.7 }}
              exit={{ scale: 0.8, y: 40, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-3xl md:text-4xl font-bold text-white/60 text-center">
                {nextWord}
              </div>
            </motion.div>
          )}

          {/* Current card */}
          <motion.div
            key={currentWord}
            className="flex items-center justify-center w-full h-full bg-white/20 rounded-2xl absolute inset-0"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{
              x: cardExitX,
              opacity: 0,
              scale: 0.5,
              rotate: cardExitX > 0 ? 15 : cardExitX < 0 ? -15 : 0,
              transition: { duration: 0.3, ease: "easeOut" },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.7}
            onDragEnd={(_, info: PanInfo) => {
              const swipeThreshold = 100;
              if (info.offset.x > swipeThreshold) {
                handleWordAction(true); // Swipe right = guessed
              } else if (info.offset.x < -swipeThreshold) {
                handleWordAction(false); // Swipe left = skip
              }
            }}
            whileDrag={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white text-center">
              {currentWord}
            </h2>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <div className="mt-6 flex gap-4">
        <motion.button
          onClick={() => handleWordAction(false)}
          className="flex-1 px-6 py-4 bg-red-500/20 text-red-200 rounded-lg font-semibold hover:bg-red-500/30 transition"
          whileTap={{
            scale: 0.85,
            rotate: -2,
            boxShadow: "0 0 20px rgba(239, 68, 68, 0.5)",
          }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          Skip ❌
        </motion.button>
        <motion.button
          onClick={() => handleWordAction(true)}
          className="flex-1 px-6 py-4 bg-green-500/20 text-green-200 rounded-lg font-semibold hover:bg-green-500/30 transition"
          whileTap={{
            scale: 0.85,
            rotate: 2,
            boxShadow: "0 0 20px rgba(34, 197, 94, 0.5)",
          }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          Guessed ✅
        </motion.button>
      </div>
    </div>
  );
}
