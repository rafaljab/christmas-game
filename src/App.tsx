import { useGameLoop } from './hooks/useGameLoop';
import { useGameState } from './hooks/useGameState';
import { GameCanvas } from './components/GameCanvas';

function App() {
  const { gameState, update, CONSTANTS } = useGameState();

  useGameLoop((deltaTime: number) => {
    update(deltaTime);
  });

  return (
    <div className="w-screen h-screen bg-slate-900 flex flex-col items-center justify-center font-sans overflow-hidden">
      {/* UI Overlay */}
      <div className="absolute top-4 left-4 text-white text-2xl font-bold bg-slate-800 p-4 rounded-lg shadow-lg border border-slate-700 z-10 w-48">
        Score: <span className={gameState.score >= 0 ? "text-green-400" : "text-red-400"}>{gameState.score}</span>
      </div>

      {/* Game Canvas */}
      <div className="relative">
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
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center rounded-lg">
            <h2 className="text-6xl font-bold text-red-500 mb-4 drop-shadow-lg">GAME OVER</h2>
            <p className="text-white text-2xl mb-8">Final Score: {gameState.score}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-full text-xl transition-all transform hover:scale-105 shadow-xl cursor-pointer"
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 text-slate-400 text-sm">
        Use <span className="font-bold text-white">Left/Right Arrow Keys</span> to move the Elf. Catch Presents, avoid Rods!
      </div>
    </div>
  );
}

export default App;
