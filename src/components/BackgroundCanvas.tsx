import React, { useEffect, useRef } from 'react';

interface BackgroundCanvasProps {
  comboStreak?: number;
}

export const BackgroundCanvas: React.FC<BackgroundCanvasProps> = ({ comboStreak = 0 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    const particleCount = comboStreak >= 8 ? 80 : 45;
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * (comboStreak >= 5 ? 1.5 : 0.4),
      vy: (Math.random() - 0.5) * (comboStreak >= 5 ? 1.5 : 0.4),
      radius: Math.random() * 2 + 1,
      alpha: Math.random() * 0.5 + 0.3,
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const bgGrad = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 3,
        50,
        canvas.width / 2,
        canvas.height / 2,
        Math.max(canvas.width, canvas.height)
      );

      if (comboStreak >= 8) {
        bgGrad.addColorStop(0, '#1e1b4b');
        bgGrad.addColorStop(0.5, '#0f172a');
        bgGrad.addColorStop(1, '#020617');
      } else if (comboStreak >= 3) {
        bgGrad.addColorStop(0, '#1e140a');
        bgGrad.addColorStop(0.5, '#0f172a');
        bgGrad.addColorStop(1, '#020617');
      } else {
        bgGrad.addColorStop(0, '#0f172a');
        bgGrad.addColorStop(0.5, '#0b0f19');
        bgGrad.addColorStop(1, '#05070c');
      }

      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const maxDistance = comboStreak >= 5 ? 200 : 150;
      for (let i = 0; i < particleCount; i++) {
        for (let j = i + 1; j < particleCount; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const lineAlpha = (1 - dist / maxDistance) * (comboStreak >= 5 ? 0.25 : 0.12);
            const color = comboStreak >= 8 ? '#a855f7' : comboStreak >= 3 ? '#f59e0b' : '#00f3ff';
            ctx.strokeStyle = color;
            ctx.globalAlpha = lineAlpha;
            ctx.lineWidth = comboStreak >= 5 ? 1.2 : 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        const color = comboStreak >= 8 ? '#ec4899' : comboStreak >= 3 ? '#f59e0b' : '#00f3ff';
        ctx.fillStyle = color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = comboStreak >= 3 ? 12 : 6;
        ctx.shadowColor = color;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * (comboStreak >= 5 ? 1.4 : 1), 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [comboStreak]);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};
