import { useEffect, useRef, useCallback } from 'react';

export interface UseResizingCanvasOptions {
  onDraw?: (ctx: CanvasRenderingContext2D, width: number, height: number) => void;
  onAnimationFrame?: (deltaTime: number, width: number, height: number) => void;
  animate?: boolean;
}

/**
 * A hook that manages a canvas element that automatically resizes with its container
 * and provides drawing context with animation support
 */
export function useResizingCanvas(options: UseResizingCanvasOptions = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(Date.now());

  const updateCanvasSize = useCallback(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvasRef.current.width = rect.width * dpr;
    canvasRef.current.height = rect.height * dpr;

    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
    }
  }, []);

  const animate = useCallback(() => {
    if (!canvasRef.current || !options.animate) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const now = Date.now();
    const deltaTime = now - lastTimeRef.current;
    lastTimeRef.current = now;

    const width = canvasRef.current.width / (window.devicePixelRatio || 1);
    const height = canvasRef.current.height / (window.devicePixelRatio || 1);

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Call animation callback
    if (options.onAnimationFrame) {
      options.onAnimationFrame(deltaTime, width, height);
    }

    // Call draw callback
    if (options.onDraw) {
      options.onDraw(ctx, width, height);
    }

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [options]);

  useEffect(() => {
    updateCanvasSize();

    const resizeObserver = new ResizeObserver(() => {
      updateCanvasSize();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [updateCanvasSize]);

  useEffect(() => {
    if (options.animate) {
      lastTimeRef.current = Date.now();
      animationFrameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [options.animate, animate]);

  return { canvasRef, containerRef };
}

/**
 * A component that provides a resizing canvas for animations
 * Automatically scales to fit its container
 */
export function ResizingCanvas({
  onDraw,
  onAnimationFrame,
  animate = true,
  className = '',
}: UseResizingCanvasOptions & {
  className?: string;
}) {
  const { canvasRef, containerRef } = useResizingCanvas({
    onDraw,
    onAnimationFrame,
    animate,
  });

  return (
    <div
      ref={containerRef}
      className={`w-full h-full ${className}`}
      style={{ overflow: 'hidden' }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
}
