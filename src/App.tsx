import { useState, useEffect } from 'react';
import { useGameLoop } from './hooks/useGameLoop';
import { useGameState } from './hooks/useGameState';
import { GameCanvas } from './components/GameCanvas';
import { MobileWarning } from './components/MobileWarning';
import { GameOverlay } from './components/GameOverlay';
import { PauseScreen } from './components/PauseScreen';
import { StartScreen } from './components/StartScreen';
import { GameOverScreen } from './components/GameOverScreen';
import { ControlsHint } from './components/ControlsHint';
import { GithubLink } from './components/GithubLink';

function App() {
  const { gameState, update, startGame, togglePause, CONSTANTS } = useGameState();

  useGameLoop((deltaTime: number) => {
    update(deltaTime);
  });

  const [showMobileWarning, setShowMobileWarning] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      // Check if screen is too narrow (canvas is 800px) or if it's likely a mobile device
      const isNarrow = window.innerWidth < 1024;
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      // Show warning if narrow or touch (likely mobile/tablet)
      setShowMobileWarning(isNarrow || isTouch);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return (
    <div className="w-full min-h-screen bg-slate-900 bg-gradient-to-br from-slate-900 via-purple-950 to-black flex flex-col items-center justify-center font-sans text-center selection:bg-pink-500 selection:text-white py-4">
      <MobileWarning show={showMobileWarning} onClose={() => setShowMobileWarning(false)} />

      <GameOverlay
        score={gameState.score}
        timeAlive={gameState.timeAlive}
        lives={gameState.lives}
      />

      {/* Game Title */}
      <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-red-500 to-red-600 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)] mb-4 tracking-tight rotate-[-2deg] hover:rotate-2 transition-transform cursor-default">
        Christmas Catch 🎄
      </h1>

      {/* Game Canvas Container */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-green-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative rounded-xl overflow-hidden shadow-2xl border-4 border-slate-800/80 bg-slate-900">
          <GameCanvas
            gameState={gameState}
            width={CONSTANTS.CANVAS_WIDTH}
            height={CONSTANTS.CANVAS_HEIGHT}
            santaY={CONSTANTS.SANTA_Y}
            elfY={CONSTANTS.ELF_Y}
            entitySize={CONSTANTS.ENTITY_SIZE}
          />

          {!gameState.gameStarted && !gameState.gameOver && (
            <StartScreen onStart={startGame} />
          )}

          {gameState.isPaused && (
            <PauseScreen onResume={togglePause} />
          )}

          {gameState.gameOver && (
            <GameOverScreen
              score={gameState.score}
              timeAlive={gameState.timeAlive}
              onRestart={startGame}
            />
          )}
        </div>
      </div>

      <ControlsHint />

      <GithubLink />
    </div>
  );
}

export default App;

