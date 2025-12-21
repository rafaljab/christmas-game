import { useGameLoop } from './hooks/useGameLoop';
import { useGameState } from './hooks/useGameState';
import { GameCanvas } from './components/GameCanvas';

function App() {
  const { gameState, update, CONSTANTS } = useGameState();

  useGameLoop((deltaTime: number) => {
    update(deltaTime);
  });

  return (
    <div className="w-full min-h-screen bg-slate-900 bg-gradient-to-br from-slate-900 via-purple-950 to-black flex flex-col items-center justify-center font-sans text-center selection:bg-pink-500 selection:text-white py-4">
      {/* UI Overlay */}
      <div className="absolute top-8 left-8">
        <div className="glass-panel px-6 py-3 rounded-2xl border border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.5)] backdrop-blur-md bg-white/5">
          <span className="text-slate-300 text-lg uppercase tracking-widest font-bold mr-2">Score</span>
          <span className={`text-3xl font-black drop-shadow-lg ${gameState.score >= 0 ? "text-green-400" : "text-red-400"}`}>{gameState.score}</span>
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

          {/* Start / Game Over Overlay */}
          {gameState.gameOver && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center backdrop-blur-sm z-50 animate-fade-in">
              <h2 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-red-500 to-red-600 mb-2 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] tracking-tight">GAME OVER</h2>
              <div className="text-white text-2xl mb-8 font-light tracking-wide">
                Final Score: <span className="font-bold text-yellow-400">{gameState.score}</span>
              </div>
              <button
                onClick={() => window.location.reload()}
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
