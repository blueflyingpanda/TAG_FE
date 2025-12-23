import { useEffect, useState } from "react";
import type { Theme, User } from "../types";
import {
  addThemeToFavorites,
  getTheme,
  removeThemeFromFavorites,
} from "../utils/themes";

interface ThemeDetailsProps {
  user: User;
  themeId: number;
  onBack: (filters?: URLSearchParams) => void;
  onThemeSelect?: (theme: Theme) => void;
  filters?: URLSearchParams;
}

function renderDifficultyStars(difficulty: number): string {
  const stars = "⭐".repeat(difficulty);
  const emptyStars = "☆".repeat(5 - difficulty);
  return stars + emptyStars;
}

function renderVerificationStatus(verified: boolean): string {
  return verified ? "✅ Verified" : "❌ Unverified";
}

export default function ThemeDetails({
  user,
  themeId,
  onBack,
  onThemeSelect,
  filters,
}: ThemeDetailsProps) {
  const [theme, setTheme] = useState<Theme | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

  useEffect(() => {
    const fetchThemeDetails = async () => {
      try {
        setLoading(true);
        const themeData = await getTheme(themeId);
        setTheme(themeData);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch theme details:", err);
        setError("Failed to load theme details");
      } finally {
        setLoading(false);
      }
    };

    fetchThemeDetails();
  }, [themeId]);

  const handleToggleFavorite = async () => {
    if (!theme || isTogglingFavorite) return;

    try {
      setIsTogglingFavorite(true);
      if (theme.is_favorited) {
        await removeThemeFromFavorites(theme.id);
        setTheme({
          ...theme,
          is_favorited: false,
          likes_count: (theme.likes_count || 0) - 1,
        });
      } else {
        await addThemeToFavorites(theme.id);
        setTheme({
          ...theme,
          is_favorited: true,
          likes_count: (theme.likes_count || 0) + 1,
        });
      }
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
      setError("Failed to update favorite status");
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-xl max-w-4xl w-full mx-auto">
        <div className="text-center text-white">Loading theme details...</div>
      </div>
    );
  }

  if (error || !theme) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-xl max-w-4xl w-full mx-auto">
        <div className="text-center text-red-400 mb-4">
          {error || "Theme not found"}
        </div>
        <button
          onClick={() => onBack(filters)}
          className="px-6 py-2 bg-[#ECACAE] text-[#223164] rounded-lg font-semibold hover:opacity-90 transition"
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-xl max-w-4xl w-full mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => onBack(filters)}
          className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition"
        >
          ← Back
        </button>

        <div className="flex items-center gap-4">
          {user && (
            <button
              onClick={handleToggleFavorite}
              disabled={isTogglingFavorite}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
                theme.is_favorited
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              {theme.is_favorited ? "❤️" : "🤍"} {theme.likes_count || 0}
            </button>
          )}

          {onThemeSelect && (
            <button
              onClick={() => onThemeSelect(theme)}
              className="px-6 py-2 bg-[#ECACAE] text-[#223164] rounded-lg font-semibold hover:opacity-90 transition"
            >
              Select Theme
            </button>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{theme.name}</h1>
          <div className="flex items-center gap-4 text-white/80">
            <span>Language: {theme.language.toUpperCase()}</span>
            <span>Difficulty: {renderDifficultyStars(theme.difficulty)}</span>
            <span>Status: {renderVerificationStatus(theme.verified)}</span>
            <span>Visibility: {theme.public ? "Public" : "Private"}</span>
          </div>
          {theme.creator && (
            <div className="text-white/60 mt-2">
              Created by: {theme.creator.email}
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">
              Teams ({theme.description.teams.length})
            </h2>
            <div className="bg-white/10 rounded-lg p-4 max-h-64 overflow-y-auto">
              <div className="grid grid-cols-2 gap-2">
                {theme.description.teams.map((team, index) => (
                  <div
                    key={index}
                    className="text-white/80 p-2 bg-white/5 rounded"
                  >
                    {team}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-4">
              Words ({theme.description.words.length})
            </h2>
            <div className="bg-white/10 rounded-lg p-4 max-h-64 overflow-y-auto">
              <div className="grid grid-cols-3 gap-2">
                {theme.description.words.slice(0, 50).map((word, index) => (
                  <div
                    key={index}
                    className="text-white/80 p-2 bg-white/5 rounded text-sm"
                  >
                    {word}
                  </div>
                ))}
                {theme.description.words.length > 50 && (
                  <div className="text-white/60 p-2 text-sm col-span-3 text-center">
                    ... and {theme.description.words.length - 50} more words
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {theme.played_count !== undefined && (
          <div className="text-white/60">
            Played {theme.played_count} times
            {theme.last_played &&
              ` • Last played: ${new Date(
                theme.last_played
              ).toLocaleDateString()}`}
          </div>
        )}
      </div>
    </div>
  );
}
