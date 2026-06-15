import React, { useRef, useEffect } from 'react';
import { COLORS } from '../utils/gameConfig';

const MAP_W = 150;
const MAP_H = 110;
const WORLD_W = 2400;
const WORLD_H = 1800;

export default function Minimap({ player, enemies, pickups, missionTarget }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#050015';
    ctx.fillRect(0, 0, MAP_W, MAP_H);

    // Roads
    ctx.fillStyle = '#1a1a3a';
    for (let ry = 0; ry < WORLD_H; ry += 180) {
      const my = (ry / WORLD_H) * MAP_H;
      const mh = (60 / WORLD_H) * MAP_H;
      ctx.fillRect(0, my, MAP_W, mh);
    }
    for (let rx = 0; rx < WORLD_W; rx += 240) {
      const mx = (rx / WORLD_W) * MAP_W;
      const mw = (60 / WORLD_W) * MAP_W;
      ctx.fillRect(mx, 0, mw, MAP_H);
    }

    // Water
    ctx.fillStyle = '#001a4d';
    ctx.fillRect(MAP_W * 0.72, 0, MAP_W * 0.28, MAP_H);

    // Beach
    ctx.fillStyle = '#c8a96e66';
    ctx.fillRect(MAP_W * 0.68, 0, MAP_W * 0.05, MAP_H);

    // Pickups
    pickups.filter(p => !p.collected).forEach(p => {
      const mx = (p.x / WORLD_W) * MAP_W;
      const my = (p.y / WORLD_H) * MAP_H;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(mx, my, 2, 0, Math.PI * 2);
      ctx.fill();
    });

    // Mission target
    if (missionTarget) {
      const mx = (missionTarget.x / WORLD_W) * MAP_W;
      const my = (missionTarget.y / WORLD_H) * MAP_H;
      ctx.fillStyle = '#ff00aa';
      ctx.beginPath();
      ctx.arc(mx, my, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ff00aa';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(mx, my, 5, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Enemies
    enemies.filter(e => e.health > 0).forEach(e => {
      const mx = (e.x / WORLD_W) * MAP_W;
      const my = (e.y / WORLD_H) * MAP_H;
      ctx.fillStyle = e.type === 'police' ? '#0055cc' : '#cc0000';
      ctx.beginPath();
      ctx.arc(mx, my, 2, 0, Math.PI * 2);
      ctx.fill();
    });

    // Player
    const px = (player.x / WORLD_W) * MAP_W;
    const py = (player.y / WORLD_H) * MAP_H;
    ctx.fillStyle = COLORS.NEON_CYAN;
    ctx.shadowColor = COLORS.NEON_CYAN;
    ctx.shadowBlur = 4;
    ctx.beginPath();
    ctx.arc(px, py, 3, 0, Math.PI * 2);
    ctx.fill();

    // Direction indicator
    ctx.strokeStyle = COLORS.NEON_CYAN;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(px + Math.cos(player.angle) * 7, py + Math.sin(player.angle) * 7);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Border
    ctx.strokeStyle = '#ff00aa66';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, MAP_W, MAP_H);

  }, [player, enemies, pickups, missionTarget]);

  return (
    <div style={{
      position: 'fixed',
      bottom: 90,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 100,
    }}>
      <canvas
        ref={canvasRef}
        width={MAP_W}
        height={MAP_H}
        style={{
          display: 'block',
          border: '1px solid #ff00aa44',
          borderRadius: 4,
          opacity: 0.85,
        }}
      />
      <div style={{
        fontSize: 9,
        color: '#444',
        fontFamily: 'monospace',
        textAlign: 'center',
        marginTop: 2,
      }}>
        VICE CITY — RADAR
      </div>
    </div>
  );
}
