import { useEffect, useRef } from 'react';

export const useGameLoop = (callback: (deltaTime: number) => void) => {
    const requestRef = useRef<number>(0);
    const previousTimeRef = useRef<number>(0);
    const callbackRef = useRef(callback);

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    const loop = (time: number) => {
        if (previousTimeRef.current !== undefined) {
            const deltaTime = time - previousTimeRef.current;
            callbackRef.current(deltaTime);
        }
        previousTimeRef.current = time;
        requestRef.current = requestAnimationFrame(loop);
    };

    useEffect(() => {
        requestRef.current = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(requestRef.current);
    }, []);
};
