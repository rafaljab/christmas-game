import { useState, useEffect } from 'react';
import { useGameLoop } from './hooks/useGameLoop';
import { useGameState } from './hooks/useGameState';
import { GameCanvas } from './components/GameCanvas';

function App() {
  const { gameState, update, startGame, CONSTANTS } = useGameState();

  useGameLoop((deltaTime: number) => {
    update(deltaTime);
  });

  // Helper to format time (ms -> MM:SS)
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
      {/* Mobile/Tablet Warning Modal */}
      {showMobileWarning && (
        <div className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md bg-slate-800 border border-white/10 rounded-2xl p-8 shadow-2xl text-center">
            <div className="text-6xl mb-6">💻 + ⌨️</div>
            <h2 className="text-3xl font-black text-amber-400 mb-4 drop-shadow-md">Desktop Required</h2>
            <p className="text-slate-300 text-lg leading-relaxed mb-6">
              <strong className="text-white block mb-2">Welcome to Christmas Catch! 🎄</strong>
              This game requires a <span className="text-cyan-300 font-bold">Physical Keyboard</span> (Arrow Keys) and a larger screen for the best experience.
            </p>
            <p className="text-slate-400 text-sm mb-8 bg-black/20 p-3 rounded-lg">
              Please open this page on a Desktop or Laptop computer.<br />
              (Recommended Width: 1024px+)
            </p>
            <button
              onClick={() => setShowMobileWarning(false)}
              className="text-slate-500 hover:text-white text-xs underline transition-colors"
            >
              I understand, let me try anyway (Experience may be poor)
            </button>
          </div>
        </div>
      )}

      {/* UI Overlay */}
      <div className="absolute top-8 left-8 flex flex-col gap-2 items-start">
        <div className="glass-panel px-6 py-3 rounded-2xl border border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.5)] backdrop-blur-md bg-white/5">
          <span className="text-slate-300 text-lg uppercase tracking-widest font-bold mr-2">Score</span>
          <span className={`text-3xl font-black drop-shadow-lg ${gameState.score >= 0 ? "text-green-400" : "text-red-400"}`}>{gameState.score}</span>
        </div>
        <div className="glass-panel px-4 py-2 rounded-xl border border-white/5 shadow-md backdrop-blur-sm bg-black/20">
          <span className="text-slate-400 text-sm uppercase tracking-wider font-bold mr-2">Time</span>
          <span className="text-xl font-mono text-cyan-300">{formatTime(gameState.timeAlive)}</span>
        </div>
      </div>

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

          {/* Start Game Screen */}
          {!gameState.gameStarted && !gameState.gameOver && (
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center backdrop-blur-sm z-50 animate-fade-in">
              <h2 className="text-6xl font-black text-white mb-6 drop-shadow-lg tracking-tight">Ready? 🎅</h2>
              <button
                onClick={startGame}
                className="group relative px-10 py-5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-full text-2xl transition-all shadow-[0_4px_0_rgb(185,28,28)] hover:shadow-[0_2px_0_rgb(185,28,28)] active:shadow-none translate-y-0 hover:translate-y-[2px] active:translate-y-[4px] animate-bounce-slow"
              >
                <span className="flex items-center gap-3">
                  Start Game 🎁
                </span>
              </button>
            </div>
          )}

          {/* Game Over Overlay */}
          {gameState.gameOver && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center backdrop-blur-sm z-50 animate-fade-in">
              <h2 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-red-500 to-red-600 mb-2 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] tracking-tight">GAME OVER</h2>
              <div className="text-white text-2xl mb-2 font-light tracking-wide">
                Final Score: <span className="font-bold text-yellow-400">{gameState.score}</span>
              </div>
              <div className="text-slate-400 text-xl mb-8 font-light tracking-wide">
                Time Alive: <span className="font-mono text-cyan-300">{formatTime(gameState.timeAlive)}</span>
              </div>
              <button
                onClick={startGame}
                className="group relative px-8 py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-full text-xl transition-all shadow-[0_4px_0_rgb(21,128,61)] hover:shadow-[0_2px_0_rgb(21,128,61)] active:shadow-none translate-y-0 hover:translate-y-[2px] active:translate-y-[4px]"
              >
                <span className="flex items-center gap-2">
                  Play Again 🔄
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 text-slate-300 text-base font-medium tracking-wide bg-slate-800/50 px-6 py-2 rounded-full backdrop-blur-sm border border-white/10 shadow-lg">
        Use <kbd className="mx-1 px-2 py-0.5 bg-slate-700 text-white rounded text-sm font-sans font-bold shadow-sm border-b-2 border-slate-900">←</kbd> <kbd className="mx-1 px-2 py-0.5 bg-slate-700 text-white rounded text-sm font-sans font-bold shadow-sm border-b-2 border-slate-900">→</kbd> to guide the Elf.
        <span className="ml-4 text-amber-400 font-bold">Catch 🎁 Avoid ⚫</span>
      </div>

      <div className="mt-4 text-slate-500 text-sm font-light tracking-wider opacity-75 hover:opacity-100 transition-opacity select-none">
        (Press <kbd className="font-sans font-bold text-slate-400">F11</kbd> for the best experience ❄️)
      </div>
    </div>
  );
}

export default App;
