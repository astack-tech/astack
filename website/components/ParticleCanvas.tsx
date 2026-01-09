'use client';

import { useEffect, useRef, useCallback } from 'react';

/**
 * Particle Network Canvas Animation
 *
 * Creates an interactive particle network effect with:
 * - Floating particles that move organically
 * - Connection lines between nearby particles
 * - Mouse interaction for dynamic effects
 * - Responsive canvas sizing
 *
 * Design: Cyan accent color on black background for tech aesthetic
 */

// Type definitions for particles
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
}

// Configuration constants
const CONFIG = {
  // Particle settings
  particleCount: 80,
  particleMinRadius: 1,
  particleMaxRadius: 2.5,
  particleSpeed: 0.3,
  particleOpacityMin: 0.3,
  particleOpacityMax: 0.8,

  // Connection settings
  connectionDistance: 150,
  connectionOpacity: 0.15,

  // Mouse interaction
  mouseRadius: 200,
  mouseForce: 0.02,

  // Colors (cyan accent)
  particleColor: '0, 240, 255',
  connectionColor: '0, 240, 255',
} as const;

export default function ParticleCanvas() {
  // Canvas and animation refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animationFrameRef = useRef<number>(0);

  /**
   * Initialize particles with random positions and velocities
   */
  const initParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = [];

    for (let i = 0; i < CONFIG.particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * CONFIG.particleSpeed,
        vy: (Math.random() - 0.5) * CONFIG.particleSpeed,
        radius:
          CONFIG.particleMinRadius +
          Math.random() * (CONFIG.particleMaxRadius - CONFIG.particleMinRadius),
        opacity:
          CONFIG.particleOpacityMin +
          Math.random() * (CONFIG.particleOpacityMax - CONFIG.particleOpacityMin),
      });
    }

    particlesRef.current = particles;
  }, []);

  /**
   * Update particle positions and handle boundary collisions
   */
  const updateParticles = useCallback((width: number, height: number) => {
    const particles = particlesRef.current;
    const mouse = mouseRef.current;

    particles.forEach((particle) => {
      // Apply mouse interaction force
      const dx = mouse.x - particle.x;
      const dy = mouse.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < CONFIG.mouseRadius && distance > 0) {
        const force = (CONFIG.mouseRadius - distance) / CONFIG.mouseRadius;
        particle.vx -= (dx / distance) * force * CONFIG.mouseForce;
        particle.vy -= (dy / distance) * force * CONFIG.mouseForce;
      }

      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Boundary collision with smooth wrapping
      if (particle.x < 0) particle.x = width;
      if (particle.x > width) particle.x = 0;
      if (particle.y < 0) particle.y = height;
      if (particle.y > height) particle.y = 0;

      // Apply slight friction to prevent runaway velocities
      particle.vx *= 0.999;
      particle.vy *= 0.999;

      // Ensure minimum velocity for continuous movement
      const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
      if (speed < CONFIG.particleSpeed * 0.5) {
        particle.vx += (Math.random() - 0.5) * 0.01;
        particle.vy += (Math.random() - 0.5) * 0.01;
      }
    });
  }, []);

  /**
   * Draw particles and connections on canvas
   */
  const draw = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const particles = particlesRef.current;

    // Clear canvas with transparent background
    ctx.clearRect(0, 0, width, height);

    // Draw connections between nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < CONFIG.connectionDistance) {
          // Calculate opacity based on distance
          const opacity =
            CONFIG.connectionOpacity * (1 - distance / CONFIG.connectionDistance);

          ctx.beginPath();
          ctx.strokeStyle = `rgba(${CONFIG.connectionColor}, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw particles
    particles.forEach((particle) => {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${CONFIG.particleColor}, ${particle.opacity})`;
      ctx.fill();

      // Add subtle glow effect
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius * 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${CONFIG.particleColor}, ${particle.opacity * 0.2})`;
      ctx.fill();
    });
  }, []);

  /**
   * Main animation loop
   */
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    updateParticles(width, height);
    draw(ctx, width, height);

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [updateParticles, draw]);

  /**
   * Handle canvas resize
   */
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    // Set canvas size to match parent container
    const rect = parent.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    // Scale context for high DPI displays
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
    }

    // Reinitialize particles for new dimensions
    initParticles(rect.width, rect.height);
  }, [initParticles]);

  /**
   * Handle mouse movement
   */
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  /**
   * Handle mouse leave
   */
  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { x: -1000, y: -1000 };
  }, []);

  // Setup and cleanup effects
  useEffect(() => {
    handleResize();
    animate();

    // Event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      // Cleanup
      cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleResize, animate, handleMouseMove, handleMouseLeave]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
}
