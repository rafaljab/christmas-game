export const ControlsHint = () => {
    return (
        <>
            <div className="mt-4 text-slate-300 text-base font-medium tracking-wide bg-slate-800/50 px-6 py-2 rounded-full backdrop-blur-sm border border-white/10 shadow-lg flex items-center gap-3">
                <span>Use <kbd className="mx-1 px-2 py-0.5 bg-slate-700 text-white rounded text-sm font-sans font-bold shadow-sm border-b-2 border-slate-900">←</kbd>
                    <kbd className="mx-1 px-2 py-0.5 bg-slate-700 text-white rounded text-sm font-sans font-bold shadow-sm border-b-2 border-slate-900">→</kbd> to guide the Elf</span>
                <span className="w-1 h-1 rounded-full bg-slate-500"></span>
                <span><kbd className="mx-1 px-2 py-0.5 bg-slate-700 text-white rounded text-sm font-sans font-bold shadow-sm border-b-2 border-slate-900">ESC</kbd> to pause</span>
            </div>

            <div className="mt-4 text-slate-500 text-sm font-light tracking-wider opacity-75 hover:opacity-100 transition-opacity select-none">
                (Press <kbd className="font-sans font-bold text-slate-400">F11</kbd> for the best experience ❄️)
            </div>
        </>
    );
};
