import { formatTime } from '../utils/format';

interface GameOverScreenProps {
    score: number;
    timeAlive: number;
    onRestart: () => void;
}

export const GameOverScreen = ({ score, timeAlive, onRestart }: GameOverScreenProps) => {
    return (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center backdrop-blur-sm z-50 animate-fade-in">
            <h2 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-red-500 to-red-600 mb-2 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] tracking-tight">GAME OVER</h2>
            <div className="text-white text-2xl mb-2 font-light tracking-wide">
                Final Score: <span className="font-bold text-yellow-400">{score}</span>
            </div>
            <div className="text-red-400 text-xl mb-4 font-bold tracking-widest uppercase opacity-90">
                You ran out of lives!
            </div>
            <div className="text-slate-400 text-xl mb-8 font-light tracking-wide">
                Time Alive: <span className="font-mono text-cyan-300">{formatTime(timeAlive)}</span>
            </div>
            <button
                onClick={onRestart}
                className="group relative px-8 py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-full text-xl transition-all shadow-[0_4px_0_rgb(21,128,61)] hover:shadow-[0_2px_0_rgb(21,128,61)] active:shadow-none translate-y-0 hover:translate-y-[2px] active:translate-y-[4px]"
            >
                <span className="flex items-center gap-2">
                    Play Again 🔄
                </span>
            </button>
        </div>
    );
};
