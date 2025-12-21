// Simple synthesized sound effects using Web Audio API

const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();

export type SoundType = 'score' | 'penalty' | 'gameOver';

export const initAudio = () => {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
};

export const playSound = (type: SoundType) => {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    switch (type) {
        case 'score':
            // High pitch "Ding"
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(523.25, now); // C5
            oscillator.frequency.exponentialRampToValueAtTime(880, now + 0.1); // A5
            gainNode.gain.setValueAtTime(0.3, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
            oscillator.start(now);
            oscillator.stop(now + 0.5);
            break;

        case 'penalty':
            // Low pitch "Buzz"
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(150, now);
            oscillator.frequency.linearRampToValueAtTime(100, now + 0.3);
            gainNode.gain.setValueAtTime(0.3, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            oscillator.start(now);
            oscillator.stop(now + 0.3);
            break;

        case 'gameOver':
            // Descending glissando
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(440, now);
            oscillator.frequency.linearRampToValueAtTime(110, now + 1.5);
            gainNode.gain.setValueAtTime(0.5, now);
            gainNode.gain.linearRampToValueAtTime(0.01, now + 1.5);
            oscillator.start(now);
            oscillator.stop(now + 1.5);
            break;
    }
};
