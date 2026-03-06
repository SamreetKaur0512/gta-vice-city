import React, { useEffect, useRef } from 'react';

export default function MainMenu({ onStart }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let frame = 0;

    const animate = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const W = canvas.width, H = canvas.height;
      frame++;

      // Background
      ctx.fillStyle = '#050010';
      ctx.fillRect(0, 0, W, H);

      // City skyline silhouette
      ctx.fillStyle = '#0d0525';
      const buildings = [
        [0, 0.6, 0.06], [0.05, 0.5, 0.05], [0.09, 0.4, 0.04], [0.12, 0.55, 0.06],
        [0.17, 0.45, 0.05], [0.21, 0.35, 0.04], [0.24, 0.5, 0.07], [0.3, 0.3, 0.05],
        [0.34, 0.42, 0.06], [0.39, 0.38, 0.04], [0.42, 0.48, 0.05], [0.46, 0.25, 0.04],
        [0.49, 0.4, 0.06], [0.54, 0.32, 0.05], [0.58, 0.22, 0.04], [0.61, 0.44, 0.07],
        [0.67, 0.35, 0.05], [0.71, 0.52, 0.06], [0.76, 0.28, 0.04], [0.79, 0.45, 0.07],
        [0.85, 0.38, 0.05], [0.89, 0.3, 0.04], [0.92, 0.5, 0.06], [0.96, 0.42, 0.04],
      ];
      buildings.forEach(([bx, by, bw]) => {
        ctx.fillRect(bx * W, by * H, bw * W, H);
      });

      // Neon grid
      ctx.strokeStyle = 'rgba(255, 0, 170, 0.08)';
      ctx.lineWidth = 1;
      const perspective = 0.6;
      const gridY = H * 0.72;
      for (let gx = -10; gx <= 10; gx++) {
        ctx.beginPath();
        ctx.moveTo(W / 2 + gx * 80, gridY);
        ctx.lineTo(W / 2 + gx * 800, H + 200);
        ctx.stroke();
      }
      for (let gy = 0; gy < 8; gy++) {
        const yp = gridY + gy * 60 * (1 + gy * 0.2);
        const spread = 80 + gy * 160;
        ctx.beginPath();
        ctx.moveTo(W / 2 - spread, yp);
        ctx.lineTo(W / 2 + spread, yp);
        ctx.stroke();
      }

      // Stars
      for (let i = 0; i < 60; i++) {
        const sx = ((i * 137 + frame * 0.1) % W);
        const sy = (i * 71) % (H * 0.5);
        const a = 0.3 + 0.7 * Math.abs(Math.sin(frame * 0.02 + i));
        ctx.fillStyle = `rgba(255,255,255,${a})`;
        ctx.fillRect(sx, sy, 1, 1);
      }

      // Neon palm trees
      const drawMenuPalm = (px, py, h) => {
        ctx.strokeStyle = '#ff00cc88';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#ff00cc';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.quadraticCurveTo(px + 8, py - h * 0.5, px + 4, py - h);
        ctx.stroke();
        for (let li = 0; li < 5; li++) {
          const ang = (li / 5) * Math.PI * 2;
          ctx.beginPath();
          ctx.moveTo(px + 4, py - h);
          ctx.quadraticCurveTo(px + 4 + Math.cos(ang) * 20, py - h + Math.sin(ang) * 14, px + 4 + Math.cos(ang) * 32, py - h + Math.sin(ang) * 22);
          ctx.stroke();
        }
        ctx.shadowBlur = 0;
      };
      drawMenuPalm(W * 0.08, H * 0.85, 120);
      drawMenuPalm(W * 0.92, H * 0.82, 140);
      drawMenuPalm(W * 0.15, H * 0.88, 90);

      // Animated neon lines
      const t = frame * 0.015;
      for (let i = 0; i < 3; i++) {
        const lx = W * 0.5 + Math.sin(t + i * 2) * W * 0.3;
        const grad = ctx.createLinearGradient(lx - 200, H * 0.2, lx + 200, H * 0.8);
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(0.5, `hsla(${300 + i * 40}, 100%, 60%, 0.08)`);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);
      }

      requestAnimationFrame(animate);
    };

    const rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div style={{
      position: 'fixed', inset: 0,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Courier New', monospace",
      userSelect: 'none',
      cursor: 'default',
      overflow: 'hidden',
    }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0 }} />

      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
        {/* GTA-style logo */}
        <div style={{ marginBottom: 8 }}>
          <span style={{
            fontSize: 14, letterSpacing: 12,
            color: '#ff00aa',
            textShadow: '0 0 20px #ff00aa',
            textTransform: 'uppercase',
          }}>Grand Theft Auto</span>
        </div>

        <div style={{
          fontSize: 'clamp(60px, 10vw, 100px)',
          fontWeight: '900',
          fontStyle: 'italic',
          color: '#fff',
          textShadow: `
            0 0 20px #ff00aa,
            0 0 40px #ff00aa,
            4px 4px 0 #cc0066,
            8px 8px 0 #880044
          `,
          letterSpacing: -2,
          lineHeight: 0.9,
          marginBottom: 4,
        }}>
          VICE CITY
        </div>

        <div style={{
          fontSize: 13, letterSpacing: 6,
          color: '#00ffff',
          textShadow: '0 0 10px #00ffff',
          textTransform: 'uppercase',
          marginBottom: 48,
        }}>
          The Browser Experience
        </div>

        {/* Start button */}
        <button
          onClick={onStart}
          style={{
            background: 'transparent',
            border: '2px solid #ff00aa',
            color: '#ff00aa',
            fontSize: 20,
            fontWeight: 'bold',
            letterSpacing: 4,
            padding: '14px 48px',
            cursor: 'pointer',
            fontFamily: "'Courier New', monospace",
            textShadow: '0 0 10px #ff00aa',
            boxShadow: '0 0 20px #ff00aa44, inset 0 0 20px #ff00aa11',
            borderRadius: 2,
            textTransform: 'uppercase',
            transition: 'all 0.2s',
            marginBottom: 16,
          }}
          onMouseEnter={e => {
            e.target.style.background = '#ff00aa22';
            e.target.style.boxShadow = '0 0 40px #ff00aaaa, inset 0 0 30px #ff00aa22';
            e.target.style.letterSpacing = '6px';
          }}
          onMouseLeave={e => {
            e.target.style.background = 'transparent';
            e.target.style.boxShadow = '0 0 20px #ff00aa44, inset 0 0 20px #ff00aa11';
            e.target.style.letterSpacing = '4px';
          }}
        >
          New Game
        </button>

        {/* Controls */}
        <div style={{
          marginTop: 32,
          background: 'rgba(0,0,0,0.6)',
          border: '1px solid #333',
          borderRadius: 8,
          padding: '16px 28px',
          display: 'inline-block',
        }}>
          <div style={{ fontSize: 11, color: '#ff00aa', letterSpacing: 3, marginBottom: 12 }}>CONTROLS</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 24px', fontSize: 12, color: '#aaa' }}>
            <span><kbd style={kbdStyle}>WASD</kbd> Move</span>
            <span><kbd style={kbdStyle}>Mouse</kbd> Aim</span>
            <span><kbd style={kbdStyle}>LMB</kbd> Shoot</span>
            <span><kbd style={kbdStyle}>F</kbd> Enter/Exit Car</span>
            <span><kbd style={kbdStyle}>1-5</kbd> Switch Weapon</span>
            <span><kbd style={kbdStyle}>Shift</kbd> Sprint</span>
            <span><kbd style={kbdStyle}>Esc</kbd> Pause</span>
            <span><span style={{ color: '#ff00aa' }}>M</span> Mission Panel</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const kbdStyle = {
  background: '#ffffff15',
  border: '1px solid #444',
  borderRadius: 3,
  padding: '1px 5px',
  fontSize: 11,
  color: '#00ffff',
};
