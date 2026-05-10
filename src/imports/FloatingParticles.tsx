import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  shape: 'circle' | 'square' | 'triangle';
  color: string;
  rotation: number;
  rotationSpeed: number;
  pulsePhase: number;
  baseOpacity: number;
}

interface FloatingParticlesProps {
  reduced?: boolean; // Reduced mode for better performance
}

export function FloatingParticles({ reduced = false }: FloatingParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number>();
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Resize canvas to fill window
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    // Initialize particles based on screen size
    const initParticles = () => {
      const width = canvas.width;
      // Reduced particle count for better performance
      const particleCount = reduced 
        ? (width < 768 ? 15 : 30)
        : (width < 768 ? 25 : width < 1024 ? 50 : 80);

      // Color groups
      const colorGroups = {
        green: ['#10B981', '#059669', '#34D399'],
        purple: ['#9333EA', '#7C3AED', '#A855F7'],
        orange: ['#F59E0B', '#F97316', '#FB923C'],
      };

      const colorGroupKeys = Object.keys(colorGroups) as Array<keyof typeof colorGroups>;

      particlesRef.current = Array.from({ length: particleCount }, () => {
        // Random color group, then random color from that group
        const groupKey = colorGroupKeys[Math.floor(Math.random() * colorGroupKeys.length)];
        const colorGroup = colorGroups[groupKey];
        const color = colorGroup[Math.floor(Math.random() * colorGroup.length)];

        return {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 1.5, // Slightly slower
          vy: (Math.random() - 0.5) * 1.5,
          size: Math.random() * 5 + 2, // 2-7 pixels
          shape: ['circle', 'square', 'triangle'][Math.floor(Math.random() * 3)] as 'circle' | 'square' | 'triangle',
          color,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.03,
          pulsePhase: Math.random() * Math.PI * 2,
          baseOpacity: Math.random() * 0.3 + 0.2, // 0.2 to 0.5 - more subtle
        };
      });
    };

    // Track mouse position - throttled
    let lastMouseUpdate = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastMouseUpdate > 50) { // Throttle to every 50ms
        mouseRef.current = { x: e.clientX, y: e.clientY };
        lastMouseUpdate = now;
      }
    };

    // Draw single particle
    const drawParticle = (particle: Particle, opacity: number) => {
      ctx.save();
      ctx.translate(particle.x, particle.y);
      ctx.rotate(particle.rotation);
      ctx.globalAlpha = opacity;

      switch (particle.shape) {
        case 'circle':
          ctx.beginPath();
          ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = particle.color;
          ctx.fill();
          break;

        case 'square':
          ctx.fillStyle = particle.color;
          ctx.fillRect(-particle.size, -particle.size, particle.size * 2, particle.size * 2);
          break;

        case 'triangle':
          ctx.beginPath();
          ctx.moveTo(0, -particle.size);
          ctx.lineTo(particle.size, particle.size);
          ctx.lineTo(-particle.size, particle.size);
          ctx.closePath();
          ctx.fillStyle = particle.color;
          ctx.fill();
          break;
      }

      ctx.restore();
    };

    // Animation loop
    const animate = () => {
      timeRef.current++;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle) => {
        // Wind Effect - gentle horizontal drift
        particle.vx += Math.sin(timeRef.current * 0.001 + particle.pulsePhase) * 0.008;

        // Curved drift using sine wave
        particle.vx += Math.sin(particle.y * 0.01) * 0.3 * 0.008;

        // Mouse Repel Effect - only calculate every few frames
        if (!reduced && timeRef.current % 3 === 0) {
          const dx = particle.x - mouseRef.current.x;
          const dy = particle.y - mouseRef.current.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const repelRadius = 80;

          if (distance < repelRadius && distance > 0) {
            const force = (repelRadius - distance) / repelRadius;
            const angle = Math.atan2(dy, dx);
            particle.vx += Math.cos(angle) * force * 0.4;
            particle.vy += Math.sin(angle) * force * 0.4;
          }
        }

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Update rotation
        particle.rotation += particle.rotationSpeed;

        // Update pulse phase
        particle.pulsePhase += 0.015;

        // Damping - gradual velocity reduction
        particle.vx *= 0.98;
        particle.vy *= 0.98;

        // Boundary collision - bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.vx *= -1;
          particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.vy *= -1;
          particle.y = Math.max(0, Math.min(canvas.height, particle.y));
        }

        // Pulse Effect - breathing opacity
        const pulseVariation = Math.sin(particle.pulsePhase) * 0.15;
        const opacity = Math.max(0.1, Math.min(0.7, particle.baseOpacity + pulseVariation));

        // Draw particle
        drawParticle(particle, opacity);
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Initialize
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    if (!reduced) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
    }
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [reduced]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ background: 'transparent' }}
    />
  );
}