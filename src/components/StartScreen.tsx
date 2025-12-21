interface StartScreenProps {
    onStart: () => void;
}

export const StartScreen = ({ onStart }: StartScreenProps) => {
    return (
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center backdrop-blur-sm z-50 animate-fade-in">
            <h2 className="text-6xl font-black text-white mb-6 drop-shadow-lg tracking-tight">Ready? 🎅</h2>
            <button
                onClick={onStart}
                className="group relative px-10 py-5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-full text-2xl transition-all shadow-[0_4px_0_rgb(185,28,28)] hover:shadow-[0_2px_0_rgb(185,28,28)] active:shadow-none translate-y-0 hover:translate-y-[2px] active:translate-y-[4px] animate-bounce-slow"
            >
                <span className="flex items-center gap-3">
                    Start Game 🎁
                </span>
            </button>

            {/* Legend */}
            <div className="mt-12 flex gap-8 text-center bg-black/40 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
                <div className="flex flex-col items-center gap-2 group cursor-help transition-transform hover:scale-110">
                    <img src="/christmas-game/assets/present.png" alt="Present" className="w-12 h-12 image-pixelated drop-shadow-md" />
                    <span className="text-green-400 font-bold text-sm text-shadow">+10 Pts</span>
                </div>
                <div className="flex flex-col items-center gap-2 group cursor-help transition-transform hover:scale-110">
                    <img src="/christmas-game/assets/rod.png" alt="Coal" className="w-12 h-12 image-pixelated drop-shadow-md" />
                    <span className="text-slate-400 font-bold text-sm text-shadow">-10 Pts</span>
                </div>
                <div className="flex flex-col items-center gap-2 group cursor-help transition-transform hover:scale-110">
                    <img src="/christmas-game/assets/grinch.png" alt="Grinch" className="w-12 h-12 image-pixelated drop-shadow-lg animate-pulse" />
                    <span className="text-red-500 font-bold text-sm text-shadow">-1 Life!</span>
                </div>
            </div>
        </div>
    );
};
