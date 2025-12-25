# Themed Alias Game (TAG)

A modern, web-based implementation of the popular word-guessing game Alias, built with React, TypeScript, and Framer Motion.

## 🎮 Game Rules

**Alias** is a fun word-guessing game where teams compete to guess as many words as possible within a time limit.

### Basic Gameplay

- Players are divided into teams
- One team player plays at a time while others guess
- The playing team gets a word and must describe it without saying the word itself
- Teammates try to guess the word
- Points are awarded for correct guesses
- The round ends when time runs out or all words are used

### Scoring

- **Correct guess**: +1 point
- **Skip penalty**: -1 point (if enabled)
- First team to reach the target score wins
- If no team reaches the target when words run out, the team with highest score wins

## ✨ Features

### 🎨 Theme Management

#### Theme Creation

- Create custom word themes with your own word lists
- Themes can be marked as public or private (public themes are verified by the admin)
- Share themes with other players

#### Theme Import

- Import themes from external sources in JSON format
- Theme can be created from inside the app using theme constructor

#### Theme Filtering & Search

- **Difficulty**: Filter themes by difficulty level
- **Language**: Filter themes by language
- **My Themes**: Show only themes you created
- **Favorites**: Show only your favorite themes
- **Unverified**: Include/exclude unverified themes
- **Search**: Find themes by name

#### Theme Ordering

- Sort themes by popularity, creation date, or alphabetically

### 📊 Game History & Resumption

#### Game History

- View all your completed games
- See final scores and winners
- Track your gaming statistics

#### Game Resumption

- Resume unfinished games from where you left off
- Games are automatically saved locally and synced to the server

### ⚙️ Game Configuration

#### Points Required

- Set the target score to win the game
- Default: 50 points

#### Round Timer

- Set the time limit for each round
- Range: 15-300 seconds
- Default: 60 seconds

#### Skip Penalty

- Enable/disable point deduction for skipped words
- When enabled: -1 point per skip
- When disabled: no penalty for skips

### 🛡️ Cheating Detection

#### Round Start Time Tracking

- Monitors when players start rounds
- Detects suspicious timing patterns
- Prevents cheating by ensuring fair play

### ✅ Round Result Confirmation

#### Interactive Review

- After each round, review all guessed and skipped words
- Tap words to toggle between correct/incorrect
- Confirm final results before proceeding
- Prevents accidental score errors

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd tag
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Build for production:

```bash
npm run build
```

### Authentication

- Sign in with Google OAuth
- User profiles are managed automatically

## 🎯 How to Play

### 1. Choose a Theme

- Browse available themes
- Use filters to find the perfect theme
- Create your own theme if desired

### 2. Configure Game

- Set number of teams and team names
- Configure points required, round timer, and skip penalty
- Start the game

### 3. Play Rounds

- Current team describes words to teammates
- Click "Guessed" for correct answers, "Skip" for difficult words
- Monitor time remaining and progress

### 4. Confirm Results

- Review round results
- Toggle any incorrect classifications
- Confirm to update scores

### 5. Win Condition

- Game ends when a team reaches the target score
- Or when all words are used (highest score wins)

## 🏗️ Technical Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Build Tool**: Vite
- **Backend**: REST API
- **Authentication**: Google OAuth 2.0
- **Storage**: Local Storage + Server Sync

## 📱 Features Overview

### Responsive Design

- Works on desktop and mobile devices
- Touch-friendly interface for mobile play

### Real-time Updates

- Live score updates
- Timer synchronization
- Automatic game state saving

### Multiplayer Support

- Local multiplayer (same device)
- Future: Online multiplayer support

## 🔧 Configuration Options

### Game Settings

- **Points Required**: 10-500 (default: 50)
- **Round Timer**: 15-300 seconds (default: 60)
- **Skip Penalty**: On/Off (default: On)

### Theme Settings

- **Words per theme**: not less than 100
- **Difficulty levels**: Very Easy, Easy, Medium, Hard, Very Hard
- **Languages**: Multiple language support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Inspired by the classic Alias board game
- Built with modern web technologies
- Community-driven theme creation
