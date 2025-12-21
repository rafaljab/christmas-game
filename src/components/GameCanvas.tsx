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

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Draw Background (Sky)
        ctx.fillStyle = '#1e293b'; // Slate 800
        ctx.fillRect(0, 0, width, height);

        // Draw Santa
        ctx.fillStyle = '#ef4444'; // Red 500
        ctx.fillRect(gameState.santaPosition, santaY, entitySize, entitySize);
        // Santa Eyes
        ctx.fillStyle = 'white';
        ctx.fillRect(gameState.santaPosition + 5, santaY + 10, 10, 10);
        ctx.fillRect(gameState.santaPosition + 25, santaY + 10, 10, 10);


        // Draw Elf
        ctx.fillStyle = '#22c55e'; // Green 500
        ctx.fillRect(gameState.elfPosition, elfY, entitySize, entitySize);
        // Elf Hat
        ctx.beginPath();
        ctx.moveTo(gameState.elfPosition, elfY);
        ctx.lineTo(gameState.elfPosition + entitySize / 2, elfY - 20);
        ctx.lineTo(gameState.elfPosition + entitySize, elfY);
        ctx.fillStyle = '#22c55e'; // Green 500
        ctx.fill();

        // Draw Items
        gameState.items.forEach((item: Item) => {
            if (item.type === 'present') {
                ctx.fillStyle = '#eab308'; // Yellow 500 (Gold)
                // Draw Gift Box
                ctx.fillRect(item.position.x, item.position.y, entitySize, entitySize);
                // Ribbon
                ctx.fillStyle = '#ef4444'; // Red
                ctx.fillRect(item.position.x + entitySize / 2 - 5, item.position.y, 10, entitySize);
                ctx.fillRect(item.position.x, item.position.y + entitySize / 2 - 5, entitySize, 10);
            } else {
                ctx.fillStyle = '#9ca3af'; // Gray 400 (Rod)
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
