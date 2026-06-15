import React, { useRef, useEffect } from 'react';
import { COLORS, GAME_CONFIG, WEAPONS } from '../utils/gameConfig';

const { TILE_SIZE, PLAYER_SIZE, ENEMY_SIZE } = GAME_CONFIG;

function drawBuilding(ctx, x, y, w, h, color, neonColor) {
  // Main building
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
  // Windows
  ctx.fillStyle = Math.random() > 0.7 ? '#ffee88' : '#1a1a3a';
  for (let wx = x + 6; wx < x + w - 6; wx += 12) {
    for (let wy = y + 8; wy < y + h - 6; wy += 14) {
      if (Math.random() > 0.3) {
        ctx.fillStyle = Math.random() > 0.6 ? '#ffee8866' : '#ffffff22';
        ctx.fillRect(wx, wy, 8, 9);
      }
    }
  }
  // Neon sign
  if (neonColor && w > 50) {
    ctx.strokeStyle = neonColor;
    ctx.lineWidth = 2;
    ctx.shadowColor = neonColor;
    ctx.shadowBlur = 10;
    ctx.strokeRect(x + 8, y + 8, w - 16, 16);
    ctx.shadowBlur = 0;
  }
}

function drawRoad(ctx, x, y, w, h, isHorizontal) {
  ctx.fillStyle = COLORS.ROAD;
  ctx.fillRect(x, y, w, h);
  // Road markings
  ctx.strokeStyle = '#ffffff33';
  ctx.lineWidth = 2;
  ctx.setLineDash([20, 15]);
  ctx.beginPath();
  if (isHorizontal) {
    ctx.moveTo(x, y + h / 2);
    ctx.lineTo(x + w, y + h / 2);
  } else {
    ctx.moveTo(x + w / 2, y);
    ctx.lineTo(x + w / 2, y + h);
  }
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawPalmTree(ctx, x, y) {
  // Trunk
  ctx.strokeStyle = '#8B6914';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.quadraticCurveTo(x + 5, y - 25, x + 2, y - 50);
  ctx.stroke();
  // Leaves
  for (let i = 0; i < 6; i++) {
    const ang = (i / 6) * Math.PI * 2;
    ctx.strokeStyle = COLORS.PALM_GREEN;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x + 2, y - 50);
    ctx.quadraticCurveTo(
      x + Math.cos(ang) * 18, y - 50 + Math.sin(ang) * 12,
      x + Math.cos(ang) * 28, y - 44 + Math.sin(ang) * 18
    );
    ctx.stroke();
  }
}

function drawCar(ctx, car) {
  ctx.save();
  ctx.translate(car.x, car.y);
  ctx.rotate(car.angle);

  const w = GAME_CONFIG.CAR_SIZE.w;
  const h = GAME_CONFIG.CAR_SIZE.h;

  // Body
  ctx.fillStyle = car.color;
  ctx.shadowColor = car.color;
  ctx.shadowBlur = 6;
  ctx.fillRect(-w / 2, -h / 2, w, h);
  ctx.shadowBlur = 0;

  // Windshield
  ctx.fillStyle = '#aaddff88';
  ctx.fillRect(-w / 2 + 10, -h / 2 + 4, w / 3, h - 8);

  // Rear window
  ctx.fillRect(w / 2 - 18, -h / 2 + 4, 12, h - 8);

  // Wheels
  ctx.fillStyle = '#111';
  [[-w / 2 + 6, -h / 2 - 3], [-w / 2 + 6, h / 2 - 3], [w / 2 - 14, -h / 2 - 3], [w / 2 - 14, h / 2 - 3]]
    .forEach(([wx, wy]) => ctx.fillRect(wx, wy, 12, 6));

  // Headlights
  ctx.fillStyle = '#ffff99';
  ctx.fillRect(w / 2 - 4, -h / 2 + 3, 4, 5);
  ctx.fillRect(w / 2 - 4, h / 2 - 8, 4, 5);

  // Taillights
  ctx.fillStyle = '#ff2200';
  ctx.fillRect(-w / 2, -h / 2 + 3, 4, 5);
  ctx.fillRect(-w / 2, h / 2 - 8, 4, 5);

  ctx.restore();
}

function drawPlayer(ctx, player, time) {
  const { x, y, angle, inCar, health } = player;

  if (inCar) {
    drawCar(ctx, { ...inCar, x, y, angle });
    return;
  }

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle + Math.PI / 2);

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.beginPath();
  ctx.ellipse(2, 2, PLAYER_SIZE / 2, PLAYER_SIZE / 2.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Body (Tommy Vercetti style)
  ctx.fillStyle = '#f5c5a0'; // skin
  ctx.beginPath();
  ctx.arc(0, -PLAYER_SIZE / 4, 7, 0, Math.PI * 2);
  ctx.fill();

  // Shirt (Hawaiian style)
  const shirtColors = ['#ff6699', '#ff9900', '#ff3366'];
  ctx.fillStyle = shirtColors[0];
  ctx.fillRect(-8, -PLAYER_SIZE / 4 + 6, 16, 14);

  // Pants
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-7, PLAYER_SIZE / 4 - 6, 14, 10);

  // Legs
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-7, PLAYER_SIZE / 4 + 2, 6, 6);
  ctx.fillRect(1, PLAYER_SIZE / 4 + 2, 6, 6);

  // Weapon in hand
  const weapon = WEAPONS[player.currentWeapon];
  if (weapon && player.currentWeapon !== 'FIST') {
    ctx.fillStyle = weapon.color;
    ctx.fillRect(8, -2, 14, 4);
  }

  // Health indicator glow
  if (health < 30) {
    ctx.strokeStyle = `rgba(255,0,0,${0.5 + 0.5 * Math.sin(time * 10)})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, PLAYER_SIZE / 2 + 4, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();

  // Aim direction indicator
  ctx.strokeStyle = 'rgba(255,255,100,0.25)';
  ctx.lineWidth = 1;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(x + Math.cos(angle) * (PLAYER_SIZE / 2 + 5), y + Math.sin(angle) * (PLAYER_SIZE / 2 + 5));
  ctx.lineTo(x + Math.cos(angle) * 80, y + Math.sin(angle) * 80);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawEnemy(ctx, enemy) {
  if (enemy.health <= 0) return;
  const { x, y, type, color, health } = enemy;

  ctx.save();
  ctx.translate(x, y);

  // Body
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(0, -8, 7, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = type === 'police' ? '#0055cc' : color;
  ctx.fillRect(-8, -2, 16, 14);
  ctx.fillStyle = '#888';
  ctx.fillRect(-6, 12, 12, 8);

  // Health bar
  const barW = 30;
  const hp = health / 100;
  ctx.fillStyle = '#330000';
  ctx.fillRect(-barW / 2, -24, barW, 4);
  ctx.fillStyle = hp > 0.5 ? '#00cc44' : hp > 0.25 ? '#ffaa00' : '#cc0000';
  ctx.fillRect(-barW / 2, -24, barW * hp, 4);

  // Alert indicator
  if (enemy.state === 'chase') {
    ctx.fillStyle = '#ff0000';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('!', 0, -28);
  }

  ctx.restore();
}

function drawBullet(ctx, bullet) {
  ctx.save();
  ctx.fillStyle = bullet.color;
  ctx.shadowColor = bullet.color;
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.arc(bullet.x, bullet.y, bullet.weapon === 'RPG' ? 5 : 3, 0, Math.PI * 2);
  ctx.fill();

  // Tracer
  ctx.strokeStyle = bullet.color + '88';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(bullet.x, bullet.y);
  ctx.lineTo(bullet.x - bullet.vx * 3, bullet.y - bullet.vy * 3);
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.restore();
}

function drawPickup(ctx, pickup, time) {
  if (pickup.collected) return;
  const pulse = 1 + 0.15 * Math.sin(time * 4);

  ctx.save();
  ctx.translate(pickup.x, pickup.y);
  ctx.scale(pulse, pulse);

  // Glow
  ctx.shadowColor = pickup.color;
  ctx.shadowBlur = 15;

  ctx.fillStyle = pickup.color + '44';
  ctx.beginPath();
  ctx.arc(0, 0, 18, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = pickup.color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, 14, 0, Math.PI * 2);
  ctx.stroke();

  ctx.shadowBlur = 0;
  ctx.font = '14px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(pickup.symbol, 0, 0);

  ctx.restore();
}

function drawExplosion(ctx, explosion) {
  const { x, y, radius, opacity } = explosion;
  const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
  grad.addColorStop(0, `rgba(255, 255, 200, ${opacity})`);
  grad.addColorStop(0.3, `rgba(255, 120, 0, ${opacity * 0.8})`);
  grad.addColorStop(0.7, `rgba(200, 40, 0, ${opacity * 0.5})`);
  grad.addColorStop(1, `rgba(0, 0, 0, 0)`);

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

function drawBlood(ctx, blood) {
  ctx.fillStyle = `rgba(150, 0, 0, ${blood.opacity})`;
  ctx.beginPath();
  ctx.arc(blood.x, blood.y, blood.size / 2, 0, Math.PI * 2);
  ctx.fill();
}

function drawMissionTarget(ctx, target, time) {
  if (!target) return;
  const pulse = 1 + 0.2 * Math.sin(time * 6);

  ctx.save();
  ctx.translate(target.x, target.y);
  ctx.scale(pulse, pulse);

  ctx.strokeStyle = '#ff00aa';
  ctx.lineWidth = 3;
  ctx.shadowColor = '#ff00aa';
  ctx.shadowBlur = 20;

  // Target circle
  ctx.beginPath();
  ctx.arc(0, 0, 30, 0, Math.PI * 2);
  ctx.stroke();

  // Crosshair lines
  ctx.beginPath();
  ctx.moveTo(-40, 0); ctx.lineTo(-20, 0);
  ctx.moveTo(20, 0); ctx.lineTo(40, 0);
  ctx.moveTo(0, -40); ctx.lineTo(0, -20);
  ctx.moveTo(0, 20); ctx.lineTo(0, 40);
  ctx.stroke();

  ctx.fillStyle = '#ff00aa';
  ctx.font = 'bold 12px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('TARGET', 0, -45);

  ctx.shadowBlur = 0;
  ctx.restore();
}

const WORLD_BUILDINGS = [
  { x: 100, y: 100, w: 100, h: 180, color: COLORS.BUILDING_1, neon: COLORS.NEON_PINK },
  { x: 220, y: 80, w: 120, h: 200, color: COLORS.BUILDING_2, neon: COLORS.NEON_CYAN },
  { x: 360, y: 120, w: 80, h: 140, color: COLORS.BUILDING_3, neon: null },
  { x: 460, y: 90, w: 100, h: 170, color: COLORS.BUILDING_1, neon: COLORS.NEON_YELLOW },
  { x: 100, y: 310, w: 140, h: 160, color: COLORS.BUILDING_2, neon: null },
  { x: 260, y: 290, w: 80, h: 190, color: COLORS.BUILDING_3, neon: COLORS.NEON_PINK },
  { x: 580, y: 100, w: 120, h: 150, color: COLORS.BUILDING_1, neon: COLORS.NEON_CYAN },
  { x: 720, y: 80, w: 90, h: 180, color: COLORS.BUILDING_2, neon: null },
  { x: 830, y: 110, w: 110, h: 150, color: COLORS.BUILDING_3, neon: COLORS.NEON_ORANGE },
  { x: 580, y: 280, w: 100, h: 170, color: COLORS.BUILDING_1, neon: null },
  { x: 700, y: 270, w: 130, h: 180, color: COLORS.BUILDING_2, neon: COLORS.NEON_PINK },
  { x: 960, y: 90, w: 100, h: 160, color: COLORS.BUILDING_3, neon: COLORS.NEON_CYAN },
  { x: 1080, y: 80, w: 120, h: 190, color: COLORS.BUILDING_1, neon: null },
  { x: 1220, y: 100, w: 90, h: 160, color: COLORS.BUILDING_2, neon: COLORS.NEON_YELLOW },
  { x: 960, y: 280, w: 140, h: 150, color: COLORS.BUILDING_3, neon: COLORS.NEON_PINK },
  { x: 1120, y: 270, w: 100, h: 180, color: COLORS.BUILDING_1, neon: null },
  { x: 1340, y: 90, w: 110, h: 170, color: COLORS.BUILDING_2, neon: COLORS.NEON_CYAN },
  { x: 1460, y: 80, w: 130, h: 200, color: COLORS.BUILDING_3, neon: COLORS.NEON_ORANGE },
  { x: 100, y: 500, w: 120, h: 160, color: COLORS.BUILDING_1, neon: COLORS.NEON_PINK },
  { x: 240, y: 510, w: 100, h: 140, color: COLORS.BUILDING_2, neon: null },
  { x: 580, y: 490, w: 110, h: 170, color: COLORS.BUILDING_3, neon: COLORS.NEON_YELLOW },
  { x: 710, y: 500, w: 130, h: 150, color: COLORS.BUILDING_1, neon: COLORS.NEON_CYAN },
  { x: 1340, y: 290, w: 100, h: 160, color: COLORS.BUILDING_2, neon: null },
  { x: 1460, y: 280, w: 120, h: 180, color: COLORS.BUILDING_3, neon: COLORS.NEON_PINK },
  { x: 960, y: 490, w: 110, h: 160, color: COLORS.BUILDING_1, neon: COLORS.NEON_ORANGE },
  { x: 1090, y: 500, w: 130, h: 140, color: COLORS.BUILDING_2, neon: null },
  { x: 1340, y: 500, w: 100, h: 150, color: COLORS.BUILDING_3, neon: COLORS.NEON_CYAN },
  { x: 100, y: 700, w: 140, h: 160, color: COLORS.BUILDING_1, neon: null },
  { x: 260, y: 720, w: 110, h: 140, color: COLORS.BUILDING_2, neon: COLORS.NEON_PINK },
  { x: 580, y: 710, w: 120, h: 150, color: COLORS.BUILDING_3, neon: COLORS.NEON_YELLOW },
  { x: 720, y: 700, w: 100, h: 170, color: COLORS.BUILDING_1, neon: null },
];

const PALM_TREES = [
  { x: 380, y: 200 }, { x: 560, y: 350 }, { x: 850, y: 180 }, { x: 1000, y: 420 },
  { x: 1200, y: 200 }, { x: 450, y: 640 }, { x: 900, y: 630 }, { x: 1400, y: 420 },
  { x: 180, y: 640 }, { x: 1500, y: 200 }, { x: 300, y: 180 }, { x: 1600, y: 640 },
];

export default function GameCanvas({ player, enemies, bullets, pickups, cars, explosions, bloodSplatters, camera, missionTarget, gameTime }) {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const render = () => {
      const ctx = canvas.getContext('2d');
      const W = canvas.width;
      const H = canvas.height;

      ctx.clearRect(0, 0, W, H);

      // Sky/background
      const skyGrad = ctx.createLinearGradient(0, 0, 0, H);
      skyGrad.addColorStop(0, '#0a0520');
      skyGrad.addColorStop(1, '#1a0a3c');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, W, H);

      // Camera transform
      ctx.save();
      ctx.translate(-camera.x, -camera.y);

      // Ground
      ctx.fillStyle = COLORS.SIDEWALK;
      ctx.fillRect(0, 0, 2400, 1800);

      // Roads - horizontal
      for (let ry = 0; ry < 1800; ry += 180) {
        drawRoad(ctx, 0, ry, 2400, 60, true);
      }
      // Roads - vertical
      for (let rx = 0; rx < 2400; rx += 240) {
        drawRoad(ctx, rx, 0, 60, 1800, false);
      }

      // Water area (east side)
      const waterGrad = ctx.createLinearGradient(1800, 0, 2400, 0);
      waterGrad.addColorStop(0, COLORS.BEACH_SAND);
      waterGrad.addColorStop(0.3, COLORS.WATER);
      waterGrad.addColorStop(1, '#000a33');
      ctx.fillStyle = waterGrad;
      ctx.fillRect(1700, 0, 700, 1800);

      // Water shimmer
      ctx.strokeStyle = 'rgba(0,180,255,0.15)';
      ctx.lineWidth = 1;
      for (let wy = 0; wy < 1800; wy += 20) {
        ctx.beginPath();
        ctx.moveTo(1750, wy + Math.sin((wy + gameTime * 30) * 0.1) * 5);
        ctx.lineTo(2400, wy + Math.sin((wy + gameTime * 30 + 50) * 0.1) * 5);
        ctx.stroke();
      }

      // Beach
      ctx.fillStyle = COLORS.BEACH_SAND;
      ctx.fillRect(1600, 0, 140, 1800);

      // Blood splatters (below everything except ground)
      bloodSplatters.forEach(b => drawBlood(ctx, b));

      // Buildings
      WORLD_BUILDINGS.forEach(b => drawBuilding(ctx, b.x, b.y, b.w, b.h, b.color, b.neon));

      // Palm trees
      PALM_TREES.forEach(pt => drawPalmTree(ctx, pt.x, pt.y));

      // Cars
      cars.forEach(car => drawCar(ctx, car));

      // Pickups
      pickups.forEach(p => drawPickup(ctx, p, gameTime));

      // Mission target
      drawMissionTarget(ctx, missionTarget, gameTime);

      // Bullets
      bullets.forEach(b => drawBullet(ctx, b));

      // Enemies
      enemies.forEach(e => drawEnemy(ctx, e));

      // Player
      drawPlayer(ctx, player, gameTime);

      // Explosions (on top)
      explosions.forEach(e => drawExplosion(ctx, e));

      ctx.restore();

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [player, enemies, bullets, pickups, cars, explosions, bloodSplatters, camera, missionTarget, gameTime]);

  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ display: 'block', cursor: 'crosshair', position: 'absolute', top: 0, left: 0 }}
    />
  );
}
