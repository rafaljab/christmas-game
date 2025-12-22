import { Play } from 'lucide-react';

interface PauseScreenProps {
    onResume: () => void;
}

export const PauseScreen = ({ onResume }: PauseScreenProps) => {
    return (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-slate-900/90 p-8 rounded-2xl border-4 border-slate-700 shadow-2xl flex flex-col items-center gap-6 max-w-sm w-full mx-4">
                <h2 className="text-5xl font-black text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] tracking-wider">
                    PAUSED
                </h2>

                <p className="text-slate-300 text-lg font-medium text-center">
                    Take a breather, Santa! <br /> The game is waiting for you.
                </p>

                <button
                    onClick={onResume}
                    className="group relative px-8 py-4 bg-gradient-to-br from-green-500 to-emerald-700 hover:from-green-400 hover:to-emerald-600 text-white rounded-xl font-bold text-xl shadow-[0_4px_0_rgb(6,95,70)] active:shadow-none active:translate-y-1 transition-all w-full flex items-center justify-center gap-2"
                >
                    <Play className="w-6 h-6 fill-current" />
                    Resume Game
                </button>

                <div className="text-slate-500 text-sm font-medium">
                    Press <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700 text-slate-400">ESC</span> to resume
                </div>
            </div>
        </div>
    );
};
