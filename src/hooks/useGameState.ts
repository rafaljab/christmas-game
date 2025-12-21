import { useState, useCallback, useRef, useEffect } from 'react';
import { playSound, initAudio } from '../utils/SoundManager';

export interface Position {
    x: number;
    y: number;
}

export interface Item {
    id: number;
    type: 'present' | 'rod';
    position: Position;
}

export interface GameState {
    santaPosition: number; // x position
    elfPosition: number; // x position
    items: Item[];
    score: number;
    gameOver: boolean;
    timeAlive: number;
}

const CONSTANTS = {
    SANTA_SPEED: 0.1, // Reduced from 0.2
    ELF_SPEED: 0.3,   // Reduced from 0.5
    ITEM_DROP_RATE: 0.01, // Reduced from 0.02
    ITEM_SPEED: 0.15, // Reduced from 0.3
    CANVAS_WIDTH: 800,
    CANVAS_HEIGHT: 600,
    SANTA_Y: 50,
    ELF_Y: 550,
    ENTITY_SIZE: 40,
};

export const useGameState = () => {
    const [gameState, setGameState] = useState<GameState>({
        santaPosition: CONSTANTS.CANVAS_WIDTH / 2,
        elfPosition: CONSTANTS.CANVAS_WIDTH / 2,
        items: [],
        score: 0,
        gameOver: false,
        timeAlive: 0,
    });

    const keysPressed = useRef<{ [key: string]: boolean }>({});

    // Input handling
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            initAudio();
            if (['ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
            }
            keysPressed.current[e.key] = true;
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            keysPressed.current[e.key] = false;
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    const update = useCallback((deltaTime: number) => {
        if (gameState.gameOver) return;

        setGameState((prevState) => {
            // 0. Update Timer
            const newTimeAlive = prevState.timeAlive + deltaTime;

            // Calculate difficulty multiplier based on score
            // Starts at 1.0, adds 0.1 for every 50 points
            const difficulty = 1 + Math.max(0, prevState.score) / 50 * 0.1;

            // 1. Move Santa
            // Apply difficulty to speed
            let newSantaX = prevState.santaPosition + Math.sin(Date.now() / 1000) * (CONSTANTS.SANTA_SPEED * difficulty) * deltaTime;
            // Clamp Santa
            newSantaX = Math.max(0, Math.min(CONSTANTS.CANVAS_WIDTH - CONSTANTS.ENTITY_SIZE, newSantaX));

            // Simple bounce movement logic
            const time = Date.now();
            // Scale time by difficulty to make oscillation faster
            const timeScale = 0.002 * difficulty;
            const santaPos = (Math.sin(time * timeScale) + 1) / 2 * (CONSTANTS.CANVAS_WIDTH - CONSTANTS.ENTITY_SIZE);


            // 2. Move Elf
            let newElfX = prevState.elfPosition;
            if (keysPressed.current['ArrowLeft']) {
                newElfX -= CONSTANTS.ELF_SPEED * deltaTime;
            }
            if (keysPressed.current['ArrowRight']) {
                newElfX += CONSTANTS.ELF_SPEED * deltaTime;
            }
            newElfX = Math.max(0, Math.min(CONSTANTS.CANVAS_WIDTH - CONSTANTS.ENTITY_SIZE, newElfX));

            // 3. Spawning Items
            const newItems = [...prevState.items];

            // Dynamic Item Probabilities
            // Base Rod Probability is 30%. Increases by 5% for every 1.0 difficulty increase (every 500 points)
            // Cap at 60% rods maximum.
            const baseRodProb = 0.3;
            const difficultyFactor = (difficulty - 1) * 0.5; // +0.05 per 0.1 difficulty
            const rodProbability = Math.min(0.6, baseRodProb + difficultyFactor);

            // Spawn rate increases with difficulty
            if (Math.random() < CONSTANTS.ITEM_DROP_RATE * difficulty) {
                newItems.push({
                    id: Date.now() + Math.random(),
                    type: Math.random() > (1 - rodProbability) ? 'rod' : 'present', // Use calculated probability
                    position: { x: santaPos, y: CONSTANTS.SANTA_Y },
                });
            }

            // 4. Update Items & Collision
            let newScore = prevState.score;
            let isGameOver = false;

            const updatedItems = newItems.filter((item) => {
                // Item fall speed increases with difficulty
                item.position.y += CONSTANTS.ITEM_SPEED * difficulty * deltaTime;

                // Collision with Elf
                const hitElf =
                    item.position.x < newElfX + CONSTANTS.ENTITY_SIZE &&
                    item.position.x + CONSTANTS.ENTITY_SIZE > newElfX &&
                    item.position.y < CONSTANTS.ELF_Y + CONSTANTS.ENTITY_SIZE &&
                    item.position.y + CONSTANTS.ENTITY_SIZE > CONSTANTS.ELF_Y;

                if (hitElf) {
                    if (item.type === 'present') {
                        newScore += 10;
                        playSound('score');
                    } else {
                        newScore -= 10;
                        playSound('penalty');
                    }
                    return false; // Remove item
                }

                // Remove if off screen
                return item.position.y < CONSTANTS.CANVAS_HEIGHT;
            });

            if (newScore <= -50) {
                if (!isGameOver) playSound('gameOver');
                isGameOver = true;
            }

            return {
                ...prevState,
                santaPosition: santaPos,
                elfPosition: newElfX,
                items: updatedItems,
                score: newScore,
                gameOver: isGameOver,
                timeAlive: newTimeAlive,
            };
        });
    }, [gameState.gameOver]);

    return {
        gameState,
        update,
        CONSTANTS
    };
};
