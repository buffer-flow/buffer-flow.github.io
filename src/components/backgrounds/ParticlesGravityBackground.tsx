
import { useRef } from 'react';
import { ResizingCanvas } from './ResizingCanvas';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  mass: number;
}

export interface ParticlesGravityBackgroundProps {
  /** Milliseconds between particle spawns (default: 200) */
  spawnIntervalMs?: number;
  /** Minimum particle size in pixels (default: 1) */
  minParticleSize?: number;
  /** Maximum particle size in pixels (default: 4) */
  maxParticleSize?: number;
  /** Probability (0-1) that a spawned particle is large (default: 0.1) */
  largeSizeProbability?: number;
  /** Size of large particles (default: 8) */
  largeParticleSize?: number;
  /** Gravity strength multiplier (default: 0.5) */
  gravityStrength?: number;
  /** Maximum number of particles (default: 500) */
  maxParticles?: number;
  /** Particle color (CSS color, default: 'rgba(200, 150, 255, 0.6)') */
  particleColor?: string;
  /** Margin outside canvas from which particles spawn (default: 50) */
  spawnMargin?: number;
  /** Initial velocity range for particles (default: 20-60 pixels/second) */
  initialVelocityRange?: [min: number, max: number];
  /** Damping factor (0-1, default: 0.99) - reduces velocity over time */
  damping?: number;
}

export function ParticlesGravityBackground({
  spawnIntervalMs = 400,
  minParticleSize = 0.5,
  maxParticleSize = 3,
  largeSizeProbability = 0.05,
  largeParticleSize = 5,
  gravityStrength = 50000,
  maxParticles = 500,
  spawnMargin = 50,
  initialVelocityRange = [60, 120],
  damping = 0.999,
}: ParticlesGravityBackgroundProps = {}) {
  const particlesRef = useRef<Particle[]>([]);
  const lastSpawnTimeRef = useRef<number>(Date.now());


  const spawnParticle = (width: number, height: number) => {
    if (particlesRef.current.length >= maxParticles) return;

    const size = Math.random() < largeSizeProbability ? largeParticleSize : minParticleSize + Math.random() * (maxParticleSize - minParticleSize);
    const mass = (size * size * size);

    // Spawn from outside canvas edges
    let x, y, vx, vy;

    const edge = Math.floor(Math.random() * 4);
    const speed =
      initialVelocityRange[0] +
      Math.random() * (initialVelocityRange[1] - initialVelocityRange[0]);

    switch (edge) {
      case 0: // top
        x = Math.random() * (width + 2 * spawnMargin) - spawnMargin;
        y = -spawnMargin;
        vx = (Math.random() - 0.5) * speed;
        vy = speed * (0.3 + Math.random() * 0.4); // downward tendency
        break;
      case 1: // right
        x = width + spawnMargin;
        y = Math.random() * (height + 2 * spawnMargin) - spawnMargin;
        vx = -speed * (0.3 + Math.random() * 0.4); // leftward tendency
        vy = (Math.random() - 0.5) * speed;
        break;
      case 2: // bottom
        x = Math.random() * (width + 2 * spawnMargin) - spawnMargin;
        y = height + spawnMargin;
        vx = (Math.random() - 0.5) * speed;
        vy = -speed * (0.3 + Math.random() * 0.4); // upward tendency
        break;
      case 3: // left
      default:
        x = -spawnMargin;
        y = Math.random() * (height + 2 * spawnMargin) - spawnMargin;
        vx = speed * (0.3 + Math.random() * 0.4); // rightward tendency
        vy = (Math.random() - 0.5) * speed;
        break;
    }

    particlesRef.current.push({
      x,
      y,
      vx,
      vy,
      size,
      mass,
    });
  };

  const updateParticles = (deltaTime: number, width: number, height: number) => {
    if (width <= 0 || height <= 0) return;
    const dt = Math.min(deltaTime / 1000, 0.016); // cap at 60fps frame time

    // Spawn new particles
    const now = Date.now();
    if (now - lastSpawnTimeRef.current > spawnIntervalMs) {
      spawnParticle(width, height);
      lastSpawnTimeRef.current = now;
    }

    const particles = particlesRef.current;
    const G = gravityStrength * 0.1; // Gravity constant
    const collisionMargin = spawnMargin + 100; // Allow particles to travel beyond spawn margin
    const toRemove = new Set<number>(); // Track particles to merge

    // Check for collisions first
    for (let i = 0; i < particles.length; i++) {
      if (toRemove.has(i)) continue;
      const p = particles[i];

      for (let j = i + 1; j < particles.length; j++) {
        if (toRemove.has(j)) continue;
        const other = particles[j];

        const dx = other.x - p.x;
        const dy = other.y - p.y;
        const distSq = dx * dx + dy * dy;
        const minDist = (p.size + other.size) * 0.5;
        const minDistSq = minDist * minDist;

        // Check for collision and merge particles
        if (distSq <= minDistSq) {
          const totalMass = p.mass + other.mass;
          const massRatio = p.mass / totalMass;
          const otherMassRatio = other.mass / totalMass;

          p.x = p.x * massRatio + other.x * otherMassRatio;
          p.y = p.y * massRatio + other.y * otherMassRatio;

          // Combine velocity using momentum conservation
          p.vx = p.vx * massRatio + other.vx * otherMassRatio;
          p.vy = p.vy * massRatio + other.vy * otherMassRatio;
          p.mass = totalMass;

          // Update size based on new mass
          p.size = Math.cbrt(p.mass);

          // Mark other particle for removal
          toRemove.add(j);
        }
      }
    }

    // Remove merged particles
    particlesRef.current = particles.filter((_, index) => !toRemove.has(index));

    // Update remaining particles with physics
    for (let i = 0; i < particlesRef.current.length; i++) {
      const p = particlesRef.current[i];
      let ax = 0;
      let ay = 0;

      // Calculate gravitational forces from all other particles
      for (let j = 0; j < particlesRef.current.length; j++) {
        if (i === j) continue;

        const other = particlesRef.current[j];
        const dx = other.x - p.x;
        const dy = other.y - p.y;
        const distSq = dx * dx + dy * dy;
        const minDist = (p.size + other.size) * 0.5;
        const minDistSq = minDist * minDist;

        // Only apply gravity if particles are reasonably far apart
        if (distSq > minDistSq && distSq < 100000) {
          const dist = Math.sqrt(distSq);
          const force = (G * other.mass) / distSq;

          ax += (force * dx) / dist / p.mass;
          ay += (force * dy) / dist / p.mass;
        }
      }

      // Update velocity with acceleration
      p.vx += ax * dt;
      p.vy += ay * dt;

      // Apply damping
      p.vx *= damping;
      p.vy *= damping;

      // Update position
      p.x += p.vx * dt;
      p.y += p.vy * dt;
    }

    // Remove particles that are out of bounds
    particlesRef.current = particlesRef.current.filter(
      (p) =>
        p.x > -collisionMargin &&
        p.x < width + collisionMargin &&
        p.y > -collisionMargin &&
        p.y < height + collisionMargin
    );
  };

  const drawParticles = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) => {
    const now = Date.now();
    const time = now * 0.00008; // Very slow animation for background
    
    // Draw base dark background (deep space)
    ctx.fillStyle = 'rgba(3, 2, 8, 1)';
    ctx.fillRect(0, 0, width, height);
    
    // Add slowly moving light and dark patches to simulate nebulae
    // Multiple waves at different speeds and frequencies create natural-looking patches
    for (let wave = 0; wave < 4; wave++) {
      const waveSpeed = 0.2 + wave * 0.15;
      const offset = Math.sin(time * waveSpeed) * height * 0.4;
      
      const gradient = ctx.createLinearGradient(
        0, offset,
        0, offset + height * 0.6
      );
      
      const intensity = 25 + wave * 8;
      gradient.addColorStop(0, `rgba(${intensity * 0.3}, ${intensity * 0.3}, ${intensity * 0.8}, 0)`);
      gradient.addColorStop(0.4, `rgba(${intensity}, ${intensity}, ${intensity + 20}, 0.12)`);
      gradient.addColorStop(0.5, `rgba(${intensity + 10}, ${intensity + 5}, ${intensity + 30}, 0.15)`);
      gradient.addColorStop(0.6, `rgba(${intensity}, ${intensity}, ${intensity + 20}, 0.12)`);
      gradient.addColorStop(1, `rgba(${intensity * 0.3}, ${intensity * 0.3}, ${intensity * 0.8}, 0)`);
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    }
    
    // Add some radial nebula-like regions
    for (let i = 0; i < 2; i++) {
      const cx = width * (0.3 + i * 0.4) + Math.sin(time * (0.1 + i * 0.05)) * width * 0.1;
      const cy = height * 0.5 + Math.cos(time * (0.08 + i * 0.03)) * height * 0.3;
      
      const radialGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, width * 0.3);
      radialGradient.addColorStop(0, 'rgba(60, 40, 120, 0.08)');
      radialGradient.addColorStop(0.5, 'rgba(30, 20, 60, 0.04)');
      radialGradient.addColorStop(1, 'rgba(10, 10, 20, 0)');
      
      ctx.fillStyle = radialGradient;
      ctx.fillRect(0, 0, width, height);
    }

    // Draw particles as stars with bright centers and soft glowing edges
    for (const particle of particlesRef.current) {
      // Create radial gradient for star effect
      const starGradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.size * 3
      );
      
      // Bright center fading to transparent edges for soft glow
      starGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      starGradient.addColorStop(0.4, 'rgba(255, 255, 240, 0.8)');
      starGradient.addColorStop(0.7, 'rgba(200, 220, 255, 0.3)');
      starGradient.addColorStop(1, 'rgba(100, 150, 255, 0)');
      
      ctx.fillStyle = starGradient;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  return (
    <ResizingCanvas
      animate={true}
      onAnimationFrame={updateParticles}
      onDraw={drawParticles}
    />
  );
}