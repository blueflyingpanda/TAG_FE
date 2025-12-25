import { motion } from "framer-motion";

export default function Rules() {
  return (
    <motion.div
      className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-xl max-w-4xl w-full mx-auto"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -20, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-4xl font-bold text-white mb-8 text-center">
        🎮 Alias Game Rules
      </h1>

      <div className="space-y-6 text-white">
        <div className="bg-white/5 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-[#ECACAE] mb-4">
            🎯 Basic Gameplay
          </h2>
          <p className="text-white/80 mb-3">
            <strong>Alias</strong> is a fun word-guessing game where teams
            compete to guess as many words as possible within a time limit.
          </p>
          <ul className="list-disc list-inside space-y-2 text-white/80">
            <li>Players are divided into teams</li>
            <li>One team player plays at a time while others guess</li>
            <li>
              The playing team gets a word and must describe it without saying
              the word itself
            </li>
            <li>Teammates try to guess the word</li>
            <li>Points are awarded for correct guesses</li>
            <li>The round ends when time runs out or all words are used</li>
          </ul>
        </div>

        <div className="bg-white/5 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-[#ECACAE] mb-4">
            🏆 Scoring
          </h2>
          <ul className="space-y-2 text-white/80">
            <li>
              <strong>Correct guess</strong>: +1 point
            </li>
            <li>
              <strong>Skip penalty</strong>: -1 point (if enabled)
            </li>
            <li>
              <strong>Win condition</strong>: First team to reach the target
              score wins
            </li>
            <li>
              <strong>Tiebreaker</strong>: If no team reaches the target when
              words run out, the team with highest score wins
            </li>
          </ul>
        </div>

        <div className="bg-white/5 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-[#ECACAE] mb-4">
            ⚙️ Game Configuration
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-white mb-2">Points Required</h3>
              <p className="text-white/70 text-sm">
                Set the target score to win the game (default: 50 points)
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Round Timer</h3>
              <p className="text-white/70 text-sm">
                Time limit for each round (15-300 seconds, default: 60)
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Skip Penalty</h3>
              <p className="text-white/70 text-sm">
                Enable/disable point deduction for skipped words
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Teams</h3>
              <p className="text-white/70 text-sm">
                2-10 teams can play simultaneously
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-[#ECACAE] mb-4">
            🎨 Theme Management
          </h2>
          <div className="space-y-3 text-white/80">
            <p>
              <strong>Theme Creation:</strong> Create custom word themes with
              your own word lists
            </p>
            <p>
              <strong>Theme Import:</strong> Import themes from external sources
              in JSON format
            </p>
            <p>
              <strong>Filtering:</strong> Filter by difficulty, language, your
              themes, favorites, verified status
            </p>
            <p>
              <strong>Search:</strong> Find themes by name or description
            </p>
            <p>
              <strong>Minimum words:</strong> Each theme must have at least 100
              words
            </p>
          </div>
        </div>

        <div className="bg-white/5 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-[#ECACAE] mb-4">
            📊 Game Features
          </h2>
          <div className="grid md:grid-cols-2 gap-4 text-white/80">
            <div>
              <h3 className="font-semibold text-white mb-2">Game History</h3>
              <p className="text-sm">
                View all completed games and track statistics
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Game Resumption</h3>
              <p className="text-sm">
                Resume unfinished games from where you left off
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">
                Cheating Detection
              </h3>
              <p className="text-sm">
                Monitors round start times to prevent unfair play
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">
                Result Confirmation
              </h3>
              <p className="text-sm">
                Review and confirm round results before scoring
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-[#ECACAE] mb-4">
            🎯 How to Play
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-white/80">
            <li>Choose a theme with words to guess</li>
            <li>Configure game settings (points, timer, teams)</li>
            <li>Take turns describing words to your team</li>
            <li>
              Click "Guessed" for correct answers, "Skip" for difficult words
            </li>
            <li>Review and confirm results after each round</li>
            <li>Continue until a team reaches the target score</li>
          </ol>
        </div>

        <div className="bg-white/5 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-[#ECACAE] mb-4">
            🏅 Difficulty Levels
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-center">
            <div className="bg-green-500/20 text-green-200 px-3 py-2 rounded">
              Very Easy
            </div>
            <div className="bg-green-500/30 text-green-200 px-3 py-2 rounded">
              Easy
            </div>
            <div className="bg-yellow-500/30 text-yellow-200 px-3 py-2 rounded">
              Medium
            </div>
            <div className="bg-red-500/30 text-red-200 px-3 py-2 rounded">
              Hard
            </div>
            <div className="bg-red-500/20 text-red-200 px-3 py-2 rounded">
              Very Hard
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
