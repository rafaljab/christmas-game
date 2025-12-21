import React, { useRef, useEffect } from 'react';
import type { GameState, Item } from '../hooks/useGameState';

interface GameCanvasProps {
    gameState: GameState;
    width: number;
    height: number;
    santaY: number;
    elfY: number;
    entitySize: number;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
    gameState,
    width,
    height,
    santaY,
    elfY,
    entitySize,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    // Images
    const santa = useRef<HTMLImageElement>(new Image());
    const elf = useRef<HTMLImageElement>(new Image());
    const present = useRef<HTMLImageElement>(new Image());
    const rod = useRef<HTMLImageElement>(new Image());
    const grinch = useRef<HTMLImageElement>(new Image());

    // Load Sprites with Chroma Key
    useEffect(() => {
        const processImage = (src: string, ref: React.MutableRefObject<HTMLImageElement>) => {
            const img = new Image();
            img.src = src;
            img.onload = () => {
                // Create a temporary canvas to process the image
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) return;

                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;

                // Simple Chroma Key: Remove Magenta (R>200, G<50, B>200)
                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];

                    // Check for Magenta-ish color
                    if (r > 200 && g < 100 && b > 200) {
                        data[i + 3] = 0; // Set Alpha to 0
                    }
                }

                ctx.putImageData(imageData, 0, 0);

                // Create a new image from the processed canvas
                ref.current.src = canvas.toDataURL();
            };
        };

        processImage('/christmas-game/assets/santa.png', santa);
        processImage('/christmas-game/assets/elf.png', elf);
        processImage('/christmas-game/assets/present.png', present);
        processImage('/christmas-game/assets/rod.png', rod);
        processImage('/christmas-game/assets/grinch.png', grinch);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas (transparent)
        ctx.clearRect(0, 0, width, height);

        // Draw Santa (2x larger)
        const santaPos = gameState.santaPosition;
        const santaSize = entitySize * 2;
        const santaOffset = (santaSize - entitySize) / 2;

        if (santa.current && santa.current.complete) {
            ctx.drawImage(santa.current, santaPos - santaOffset, santaY - santaOffset, santaSize, santaSize);
        } else {
            // Fallback
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(santaPos, santaY, entitySize, entitySize);
        }

        // Draw Elf
        const elfPos = gameState.elfPosition;
        if (elf.current && elf.current.complete) {
            ctx.drawImage(elf.current, elfPos, elfY, entitySize, entitySize);
        } else {
            ctx.fillStyle = '#22c55e';
            ctx.fillRect(elfPos, elfY, entitySize, entitySize);
        }

        // Draw Items - Draw Presents first, then Rods to keep Rods in foreground
        const presents = gameState.items.filter(i => i.type === 'present');
        const rods = gameState.items.filter(i => i.type === 'rod');
        const grinches = gameState.items.filter(i => i.type === 'grinch');

        // Draw Presents
        presents.forEach((item: Item) => {
            if (present.current && present.current.complete) {
                ctx.drawImage(present.current, item.position.x, item.position.y, entitySize, entitySize);
            } else {
                ctx.fillStyle = '#fbbf24';
                ctx.fillRect(item.position.x, item.position.y, entitySize, entitySize);
            }
        });

        // Draw Rods
        rods.forEach((item: Item) => {
            if (rod.current && rod.current.complete) {
                ctx.drawImage(rod.current, item.position.x, item.position.y, entitySize, entitySize);
            } else {
                ctx.fillStyle = '#94a3b8';
                ctx.fillRect(item.position.x, item.position.y, entitySize, entitySize);
            }
        });

        // Draw Grinch
        grinches.forEach(item => {
            // Pulsating effect for Grinch
            const pulse = 1 + Math.sin(Date.now() / 200) * 0.1;
            const size = entitySize * pulse;
            const offset = (size - entitySize) / 2;

            if (grinch.current && grinch.current.complete) {
                ctx.drawImage(grinch.current, item.position.x - offset, item.position.y - offset, size, size);
            } else {
                ctx.fillStyle = '#16a34a'; // Green
                ctx.fillRect(item.position.x, item.position.y, entitySize, entitySize);
            }
        });

    }, [gameState, width, height, santaY, elfY, entitySize]);

    return (
        <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className="border-4 border-slate-700 rounded-lg shadow-2xl"
        />
    );
};
