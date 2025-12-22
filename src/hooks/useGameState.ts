import { useState, useCallback, useRef, useEffect } from 'react';
import { playSound, initAudio } from '../utils/SoundManager';

export interface Position {
    x: number;
    y: number;
}

export interface Item {
    id: number;
    type: 'present' | 'rod' | 'grinch';
    position: Position;
    speedMultiplier: number;
}

export interface GameState {
    santaPosition: number; // x position
    elfPosition: number; // x position
    items: Item[];
    score: number;
    gameOver: boolean;
    timeAlive: number;
    gameStarted: boolean;
    lives: number;
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
        gameStarted: false,
        lives: 3,
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

    const startGame = useCallback(() => {
        setGameState(prev => ({
            ...prev,
            gameStarted: true,
            gameOver: false,
            score: 0,
            timeAlive: 0,
            lives: 3,
            items: [],
            santaPosition: CONSTANTS.CANVAS_WIDTH / 2,
            elfPosition: CONSTANTS.CANVAS_WIDTH / 2,
        }));
        initAudio(); // Ensure audio context is ready
    }, []);

    const update = useCallback((deltaTime: number) => {
        if (gameState.gameOver || !gameState.gameStarted) return;

        setGameState((prevState) => {
            // 0. Update Timer
            const newTimeAlive = prevState.timeAlive + deltaTime;

            // Calculate Difficulty Multipliers
            const secondsAlive = newTimeAlive / 1000;

            // Spawn Difficulty: Scales indefinitely (linear increase every 10s)
            const spawnDifficulty = 1 + (secondsAlive / 10) * 0.1;

            // Movement Difficulty: Caps at 60 seconds (1 minute)
            // This prevents Santa from moving impossibly fast
            const cappedSeconds = Math.min(secondsAlive, 60);
            const movementDifficulty = 1 + (cappedSeconds / 10) * 0.1;

            // 1. Move Santa
            // Apply MOVEMENT difficulty to speed
            let newSantaX = prevState.santaPosition + Math.sin(Date.now() / 1000) * (CONSTANTS.SANTA_SPEED * movementDifficulty) * deltaTime;
            // Clamp Santa
            newSantaX = Math.max(0, Math.min(CONSTANTS.CANVAS_WIDTH - CONSTANTS.ENTITY_SIZE, newSantaX));

            // Simple bounce movement logic
            // Use timeAlive instead of Date.now() to avoid massive phase jumps when difficulty changes
            const time = newTimeAlive;
            // Scale time by MOVEMENT difficulty to make oscillation faster
            const timeScale = 0.002 * movementDifficulty;
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
            // Base Rod Probability is 30%. Increases by 5% for every 1.0 difficulty increase (every 10s)
            // Cap at 50% rods maximum.
            const baseRodProb = 0.3;
            // Use SPAWN difficulty for item types
            const difficultyFactor = (spawnDifficulty - 1) * 0.5;
            const rodProbability = Math.min(0.5, baseRodProb + difficultyFactor);

            // Grinch Probability
            // Starts at 2%. scales up to 20% max.
            // Increases significantly with difficulty to replace Coals.
            const grinchProbability = Math.min(0.20, 0.02 + (spawnDifficulty - 1) * 0.05);

            // Spawn rate increases with difficulty
            if (Math.random() < CONSTANTS.ITEM_DROP_RATE * spawnDifficulty) {
                const rand = Math.random();
                let type: Item['type'] = 'present';

                if (rand < grinchProbability) {
                    type = 'grinch'; // High risk!
                } else if (rand < grinchProbability + rodProbability) {
                    type = 'rod';
                }

                let speedMultiplier = 1.0;
                if (type === 'rod') speedMultiplier = 1.2;
                if (type === 'grinch') speedMultiplier = 1.4;

                newItems.push({
                    id: Date.now() + Math.random(),
                    type: type,
                    position: { x: santaPos, y: CONSTANTS.SANTA_Y },
                    speedMultiplier,
                });
            }

            // 4. Update Items & Collision
            let newScore = prevState.score;
            let newLives = prevState.lives;
            let isGameOver = false;

            const updatedItems = newItems.filter((item) => {
                // Item fall speed increases with difficulty
                item.position.y += CONSTANTS.ITEM_SPEED * item.speedMultiplier * spawnDifficulty * deltaTime;

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
                    } else if (item.type === 'rod') {
                        newScore -= 10;
                        playSound('penalty');
                    } else if (item.type === 'grinch') {
                        newLives -= 1;
                        playSound('grinch');
                    }
                    return false; // Remove item
                }

                // Remove if off screen
                return item.position.y < CONSTANTS.CANVAS_HEIGHT;
            });

            if (newLives <= 0) {
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
                gameStarted: true,
                lives: newLives,
            };
        });
    }, [gameState.gameOver, gameState.gameStarted]);

    return {
        gameState,
        update,
        startGame,
        CONSTANTS
    };
};
