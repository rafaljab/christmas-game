import { useState, useCallback, useRef, useEffect } from 'react';

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
}

const CONSTANTS = {
    SANTA_SPEED: 0.2,
    ELF_SPEED: 0.5,
    ITEM_DROP_RATE: 0.02, // Probability per frame (approx)
    ITEM_SPEED: 0.3,
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
    });

    const keysPressed = useRef<{ [key: string]: boolean }>({});

    // Input handling
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
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
            // 1. Move Santa
            let newSantaX = prevState.santaPosition + Math.sin(Date.now() / 1000) * CONSTANTS.SANTA_SPEED * deltaTime;
            // Clamp Santa
            newSantaX = Math.max(0, Math.min(CONSTANTS.CANVAS_WIDTH - CONSTANTS.ENTITY_SIZE, newSantaX));

            // Simple bounce movement logic (just oscillating for now, can be improved)
            // Or just simply moving back and forth. Let's make it move randomly or oscillating.
            // Using sin wave based on time is jerky if frames skip. 
            // Better: store velocity in state. For simplicity, let's just make Santa move back and forth.
            // But we can't store velocity in local var here.
            // Let's just oscillate based on time for now as it's stateless. 
            const time = Date.now();
            const santaPos = (Math.sin(time * 0.002) + 1) / 2 * (CONSTANTS.CANVAS_WIDTH - CONSTANTS.ENTITY_SIZE);


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
            if (Math.random() < CONSTANTS.ITEM_DROP_RATE) {
                newItems.push({
                    id: Date.now() + Math.random(),
                    type: Math.random() > 0.3 ? 'present' : 'rod', // 70% presents
                    position: { x: santaPos, y: CONSTANTS.SANTA_Y },
                });
            }

            // 4. Update Items & Collision
            let newScore = prevState.score;
            let isGameOver = false;

            const updatedItems = newItems.filter((item) => {
                item.position.y += CONSTANTS.ITEM_SPEED * deltaTime;

                // Collision with Elf
                const hitElf =
                    item.position.x < newElfX + CONSTANTS.ENTITY_SIZE &&
                    item.position.x + CONSTANTS.ENTITY_SIZE > newElfX &&
                    item.position.y < CONSTANTS.ELF_Y + CONSTANTS.ENTITY_SIZE &&
                    item.position.y + CONSTANTS.ENTITY_SIZE > CONSTANTS.ELF_Y;

                if (hitElf) {
                    if (item.type === 'present') {
                        newScore += 10;
                    } else {
                        newScore -= 10;
                    }
                    return false; // Remove item
                }

                // Remove if off screen
                return item.position.y < CONSTANTS.CANVAS_HEIGHT;
            });

            if (newScore < 0) {
                // Optional: Game Over if score < 0? 
                // Re-reading requirements: just "Santa drops Rods -> -10 points".
                // Mechanics usually imply a fail state, but user didn't specify one other than "Game Over screen". 
                // Let's assume Game Over if score < -50 or maybe based on time? 
                // User said "UI overlay (Score, Game Over screen)".
                // Typically "catch bombs" games end on hitting a bomb or missing too many presents.
                // Let's say Game Over if you hit 3 Rods? Or just score < 0? 
                // For now let's just keep playing unless updated.
                // Wait, user explicitly asked for "Game Over screen".
                // I'll make it Game Over if you catch a Rod? No, that's -10 points.
                // Maybe if score drops below 0? Or maybe a time limit?
                // Let's assume "Game Over" occurs if score < 0 (and you started with 0?). 
                // That would end the game immediately. 
                // Let's add a "lives" system? N/A in requirements.
                // Let's just create a manual "Stop" or "Game Over" trigger for now, or maybe make -100 score game over.
                if (newScore <= -50) isGameOver = true;
            }

            return {
                ...prevState,
                santaPosition: santaPos,
                elfPosition: newElfX,
                items: updatedItems,
                score: newScore,
                gameOver: isGameOver,
            };
        });
    }, [gameState.gameOver]); // Depend on gameOver to stop updating? NO, useGameLoop calls this.

    return {
        gameState,
        update,
        CONSTANTS
    };
};
