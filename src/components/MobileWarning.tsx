interface MobileWarningProps {
    show: boolean;
    onClose: () => void;
}

export const MobileWarning = ({ show, onClose }: MobileWarningProps) => {
    if (!show) return null;

    return (
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
                    onClick={onClose}
                    className="text-slate-500 hover:text-white text-xs underline transition-colors"
                >
                    I understand, let me try anyway (Experience may be poor)
                </button>
            </div>
        </div>
    );
};
