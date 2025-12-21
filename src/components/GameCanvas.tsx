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
    const santa = useRef<HTMLImageElement | null>(null);
    const elf = useRef<HTMLImageElement | null>(null);
    const present = useRef<HTMLImageElement | null>(null);
    const rod = useRef<HTMLImageElement | null>(null);

    // Load Sprites with Chroma Key
    useEffect(() => {
        const processImage = (src: string, ref: React.MutableRefObject<HTMLImageElement | null>) => {
            const img = new Image();
            img.src = src;
            img.onload = () => {
                // Create a temporary canvas to process the image
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = img.width;
                tempCanvas.height = img.height;
                const ctx = tempCanvas.getContext('2d');
                if (ctx) {
                    ctx.drawImage(img, 0, 0);
                    const imageData = ctx.getImageData(0, 0, img.width, img.height);
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
                    const processedImg = new Image();
                    processedImg.src = tempCanvas.toDataURL();
                    ref.current = processedImg;
                }
            };
        };

        processImage('/christmas-game/assets/santa.png', santa);
        processImage('/christmas-game/assets/elf.png', elf);
        processImage('/christmas-game/assets/present.png', present);
        processImage('/christmas-game/assets/rod.png', rod);
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

        // Draw Presents
        presents.forEach((item: Item) => {
            if (present.current && present.current.complete) {
                ctx.drawImage(present.current, item.position.x, item.position.y, entitySize, entitySize);
            } else {
                ctx.fillStyle = '#eab308';
                ctx.fillRect(item.position.x, item.position.y, entitySize, entitySize);
            }
        });

        // Draw Rods
        rods.forEach((item: Item) => {
            if (rod.current && rod.current.complete) {
                ctx.drawImage(rod.current, item.position.x, item.position.y, entitySize, entitySize);
            } else {
                ctx.fillStyle = '#9ca3af';
                ctx.fillRect(item.position.x + 15, item.position.y, 10, entitySize);
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
