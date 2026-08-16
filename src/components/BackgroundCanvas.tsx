import React, { useEffect, useRef } from 'react';

interface BackgroundCanvasProps {
  overdrive: boolean;
}

export const BackgroundCanvas: React.FC<BackgroundCanvasProps> = ({ overdrive }) => {
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

    // Nodes
    const nodeCount = 45;
    const nodes = Array.from({ length: nodeCount }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * (overdrive ? 2.5 : 1.0),
      vy: (Math.random() - 0.5) * (overdrive ? 2.5 : 1.0),
      radius: Math.random() * 2 + 1.5,
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      if (overdrive) {
        bgGrad.addColorStop(0, '#0f051d');
        bgGrad.addColorStop(0.5, '#1a0b2e');
        bgGrad.addColorStop(1, '#2d0838');
      } else {
        bgGrad.addColorStop(0, '#090d16');
        bgGrad.addColorStop(0.5, '#0d1322');
        bgGrad.addColorStop(1, '#070a10');
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Cyber Grid
      ctx.strokeStyle = overdrive ? 'rgba(236, 72, 153, 0.08)' : 'rgba(0, 243, 255, 0.04)';
      ctx.lineWidth = 1;
      const gridSize = 60;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw node links
      const maxDistance = 140;
      for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * (overdrive ? 0.35 : 0.15);
            ctx.strokeStyle = overdrive
              ? `rgba(245, 158, 11, ${alpha})`
              : `rgba(0, 243, 255, ${alpha})`;
            ctx.lineWidth = overdrive ? 1.5 : 1;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Update & draw nodes
      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        ctx.fillStyle = overdrive ? '#ec4899' : '#00f3ff';
        ctx.shadowBlur = overdrive ? 12 : 6;
        ctx.shadowColor = overdrive ? '#ec4899' : '#00f3ff';

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [overdrive]);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};
