import { formatTime } from '../utils/format';

interface GameOverlayProps {
    score: number;
    timeAlive: number;
    lives: number;
}

export const GameOverlay = ({ score, timeAlive, lives }: GameOverlayProps) => {
    return (
        <div className="absolute top-8 left-8 flex flex-col gap-2 items-start">
            {/* Score Display */}
            <div className="glass-panel px-4 py-2 rounded-xl border border-white/5 shadow-md backdrop-blur-sm bg-black/20 flex items-center">
                <span className="text-slate-400 text-sm uppercase tracking-wider font-bold mr-2">Score</span>
                <span className={`text-xl font-black drop-shadow-md ${score >= 0 ? "text-green-400" : "text-red-400"}`}>{score}</span>
            </div>
            {/* Time Display */}
            <div className="glass-panel px-4 py-2 rounded-xl border border-white/5 shadow-md backdrop-blur-sm bg-black/20 flex items-center">
                <span className="text-slate-400 text-sm uppercase tracking-wider font-bold mr-2">Time</span>
                <span className="text-xl font-mono text-cyan-300">{formatTime(timeAlive)}</span>
            </div>
            {/* Lives Display */}
            <div className="glass-panel px-4 py-2 rounded-xl border border-white/5 shadow-md backdrop-blur-sm bg-black/20 flex items-center gap-1">
                <span className="text-slate-400 text-sm uppercase tracking-wider font-bold mr-2">Lives</span>
                {Array.from({ length: 3 }).map((_, i) => (
                    <span key={i} className={`text-2xl transition-all ${i < lives ? 'opacity-100 scale-100' : 'opacity-20 scale-75 grayscale'}`}>
                        ❤️
                    </span>
                ))}
            </div>
        </div>
    );
};
