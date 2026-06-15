import { useState, useEffect, useRef, useCallback } from 'react';
import {
  GAME_CONFIG, WEAPONS, PICKUPS, INITIAL_ENEMIES, PARKED_CARS, MISSIONS
} from '../utils/gameConfig';

const { PLAYER_SPEED, PLAYER_SIZE, SPRINT_MULTIPLIER, BULLET_SPEED, ENEMY_SPEED, ENEMY_SIZE } = GAME_CONFIG;

export function useGameEngine() {
  const [gameState, setGameState] = useState('menu'); // menu, playing, paused, dead, win
  const [player, setPlayer] = useState({
    x: 600, y: 400,
    health: 100, maxHealth: 100,
    armor: 0, maxArmor: 100,
    money: 500,
    angle: 0,
    speed: PLAYER_SPEED,
    inCar: null,
    currentWeapon: 'FIST',
    weapons: { FIST: { ammo: Infinity } },
    score: 0,
    kills: 0,
  });
  const [enemies, setEnemies] = useState(INITIAL_ENEMIES.map(e => ({ ...e })));
  const [bullets, setBullets] = useState([]);
  const [pickups, setPickups] = useState(PICKUPS.map(p => ({ ...p, collected: false })));
  const [cars, setCars] = useState(PARKED_CARS.map(c => ({ ...c, occupied: false })));
  const [wanted, setWanted] = useState(0);
  const [wantedTimer, setWantedTimer] = useState(0);
  const [missions, setMissions] = useState(MISSIONS.map(m => ({ ...m })));
  const [activeMission, setActiveMission] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [camera, setCamera] = useState({ x: 0, y: 0 });
  const [explosions, setExplosions] = useState([]);
  const [bloodSplatters, setBloodSplatters] = useState([]);
  const [missionTarget, setMissionTarget] = useState(null);
  const [gameTime, setGameTime] = useState(0); // seconds

  const keysRef = useRef({});
  const mouseRef = useRef({ x: 0, y: 0, buttons: 0 });
  const lastFireRef = useRef(0);
  const lastEnemyFireRef = useRef({});
  const gameLoopRef = useRef(null);
  const lastTimeRef = useRef(0);
  const notifIdRef = useRef(0);
  const bulletIdRef = useRef(0);
  const explosionIdRef = useRef(0);
  const bloodIdRef = useRef(0);

  const addNotification = useCallback((text, color = '#ffff00', duration = 3000) => {
    const id = ++notifIdRef.current;
    setNotifications(prev => [...prev, { id, text, color, timestamp: Date.now(), duration }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, duration);
  }, []);

  const addExplosion = useCallback((x, y) => {
    const id = ++explosionIdRef.current;
    setExplosions(prev => [...prev, { id, x, y, radius: 0, maxRadius: 80, opacity: 1, timestamp: Date.now() }]);
    setTimeout(() => setExplosions(prev => prev.filter(e => e.id !== id)), 800);
  }, []);

  const addBlood = useCallback((x, y) => {
    const id = ++bloodIdRef.current;
    setBloodSplatters(prev => [...prev, { id, x, y, size: 16 + Math.random() * 12, opacity: 0.85 }]);
  }, []);

  const fireBullet = useCallback((px, py, angle, weapon, isEnemy = false) => {
    const now = Date.now();
    if (!isEnemy && now - lastFireRef.current < weapon.fireRate) return false;
    if (!isEnemy) lastFireRef.current = now;

    const id = ++bulletIdRef.current;
    setBullets(prev => [...prev, {
      id,
      x: px + Math.cos(angle) * (PLAYER_SIZE / 2 + 5),
      y: py + Math.sin(angle) * (PLAYER_SIZE / 2 + 5),
      vx: Math.cos(angle) * BULLET_SPEED,
      vy: Math.sin(angle) * BULLET_SPEED,
      damage: weapon.damage,
      range: weapon.range,
      traveled: 0,
      isEnemy,
      color: isEnemy ? '#ff4400' : weapon.color,
      weapon: weapon.name,
    }]);
    return true;
  }, []);

  const startMission = useCallback((mission) => {
    setActiveMission(mission);
    setMissionTarget(mission.targetX ? { x: mission.targetX, y: mission.targetY } : null);
    addNotification(`Mission: ${mission.title}`, '#ff00aa', 4000);
    addNotification(mission.description, '#ffffff', 5000);
  }, [addNotification]);

  const completeMission = useCallback((missionId) => {
    setMissions(prev => prev.map(m => m.id === missionId ? { ...m, completed: true } : m));
    const mission = missions.find(m => m.id === missionId);
    if (mission) {
      setPlayer(prev => ({
        ...prev,
        money: prev.money + mission.reward,
        score: prev.score + mission.reward,
      }));
      addNotification(`Mission Complete! +$${mission.reward}`, '#00ff44', 4000);
    }
    setActiveMission(null);
    setMissionTarget(null);
  }, [missions, addNotification]);

  // Main game loop
  const gameLoop = useCallback((timestamp) => {
    if (!lastTimeRef.current) lastTimeRef.current = timestamp;
    const dt = Math.min((timestamp - lastTimeRef.current) / 16.67, 3); // normalize to ~60fps
    lastTimeRef.current = timestamp;

    const keys = keysRef.current;
    const mouse = mouseRef.current;

    setGameTime(prev => prev + dt / 60);

    setPlayer(prev => {
      if (prev.health <= 0) {
        setGameState('dead');
        return prev;
      }

      let { x, y, angle, inCar, currentWeapon, weapons, score, kills } = prev;
      const speed = (keys['ShiftLeft'] || keys['ShiftRight'])
        ? PLAYER_SPEED * SPRINT_MULTIPLIER
        : PLAYER_SPEED;
      const effectiveSpeed = speed * dt;

      // Movement
      let dx = 0, dy = 0;
      if (keys['KeyW'] || keys['ArrowUp']) dy -= 1;
      if (keys['KeyS'] || keys['ArrowDown']) dy += 1;
      if (keys['KeyA'] || keys['ArrowLeft']) dx -= 1;
      if (keys['KeyD'] || keys['ArrowRight']) dx += 1;

      if (dx !== 0 && dy !== 0) { dx *= 0.707; dy *= 0.707; }

      const newX = Math.max(PLAYER_SIZE, Math.min(2400, x + dx * effectiveSpeed));
      const newY = Math.max(PLAYER_SIZE, Math.min(1800, y + dy * effectiveSpeed));

      // Angle toward mouse (relative to camera)
      const canvasCX = GAME_CONFIG.CANVAS_WIDTH / 2;
      const canvasCY = GAME_CONFIG.CANVAS_HEIGHT / 2;
      const newAngle = Math.atan2(mouse.y - canvasCY, mouse.x - canvasCX);

      return { ...prev, x: newX, y: newY, angle: newAngle };
    });

    // Move bullets
    setBullets(prev => {
      const newBullets = [];
      const toCheck = [...prev];

      for (const b of toCheck) {
        const nx = b.x + b.vx * dt;
        const ny = b.y + b.vy * dt;
        const traveled = b.traveled + Math.sqrt(b.vx ** 2 + b.vy ** 2) * dt;

        if (traveled >= b.range) continue;

        // Check player hit (enemy bullets)
        if (b.isEnemy) {
          setPlayer(p => {
            const dist = Math.sqrt((nx - p.x) ** 2 + (ny - p.y) ** 2);
            if (dist < PLAYER_SIZE) {
              addBlood(nx, ny);
              const dmg = b.damage;
              if (p.armor > 0) {
                const armorAbsorb = Math.min(p.armor, dmg * 0.6);
                return { ...p, armor: p.armor - armorAbsorb, health: p.health - (dmg - armorAbsorb) };
              }
              return { ...p, health: p.health - dmg };
            }
            return p;
          });
        }

        newBullets.push({ ...b, x: nx, y: ny, traveled });
      }
      return newBullets;
    });

    // Move enemies & AI
    setEnemies(prev => prev.map(enemy => {
      if (enemy.health <= 0) return enemy;

      setPlayer(p => {
        const distToPlayer = Math.sqrt((enemy.x - p.x) ** 2 + (enemy.y - p.y) ** 2);
        let newState = enemy.state;
        let ex = enemy.x, ey = enemy.y;

        if (distToPlayer < enemy.alertRadius) {
          newState = 'chase';
        } else if (distToPlayer > enemy.alertRadius * 1.5) {
          newState = 'patrol';
        }

        if (newState === 'chase') {
          const ang = Math.atan2(p.y - enemy.y, p.x - enemy.x);
          ex += Math.cos(ang) * ENEMY_SPEED * dt;
          ey += Math.sin(ang) * ENEMY_SPEED * dt;

          // Enemy shooting
          if (distToPlayer < 250) {
            const now = Date.now();
            const lastFire = lastEnemyFireRef.current[enemy.id] || 0;
            if (now - lastFire > 1200) {
              lastEnemyFireRef.current[enemy.id] = now;
              fireBullet(enemy.x, enemy.y, ang, { damage: 12, color: '#ff4400' }, true);
            }
          }
        } else {
          // Patrol - random drift
          const drift = Math.sin(Date.now() / 2000 + enemy.id.charCodeAt(1)) * 0.5;
          ex += drift * dt;
          ey += Math.cos(Date.now() / 2000 + enemy.id.charCodeAt(1)) * 0.3 * dt;
        }

        return p;
      });

      return { ...enemy, state: enemy.state };
    }));

    // Check bullet-enemy collisions
    setBullets(bPrev => {
      const survivingBullets = [];
      const hitEnemies = new Set();

      for (const b of bPrev) {
        if (b.isEnemy) { survivingBullets.push(b); continue; }
        let hit = false;
        setEnemies(ePrev => ePrev.map(enemy => {
          if (hitEnemies.has(enemy.id)) return enemy;
          if (enemy.health <= 0) return enemy;
          const dist = Math.sqrt((b.x - enemy.x) ** 2 + (b.y - enemy.y) ** 2);
          if (dist < ENEMY_SIZE) {
            hit = true;
            hitEnemies.add(enemy.id);
            addBlood(b.x, b.y);
            const newHealth = enemy.health - b.damage;
            if (newHealth <= 0) {
              setPlayer(p => ({
                ...p,
                score: p.score + 100,
                money: p.money + 50,
                kills: p.kills + 1,
              }));
              setWanted(w => Math.min(GAME_CONFIG.MAX_WANTED, w + (enemy.type === 'police' ? 0 : 1)));
              addNotification('+$50 +100pts', '#ffdd00', 1500);
            }
            return { ...enemy, health: Math.max(0, newHealth) };
          }
          return enemy;
        }));
        if (!hit) survivingBullets.push(b);
      }
      return survivingBullets;
    });

    // Pickup collection
    setPickups(prev => prev.map(pickup => {
      if (pickup.collected) return pickup;
      setPlayer(p => {
        const dist = Math.sqrt((pickup.x - p.x) ** 2 + (pickup.y - p.y) ** 2);
        if (dist < PLAYER_SIZE + 16) {
          if (pickup.type === 'health' && p.health < p.maxHealth) {
            addNotification(`+${pickup.value} Health`, '#00ff44', 2000);
            setPickups(pp => pp.map(pu => pu.id === pickup.id ? { ...pu, collected: true } : pu));
            return { ...p, health: Math.min(p.maxHealth, p.health + pickup.value) };
          }
          if (pickup.type === 'armor') {
            addNotification(`+${pickup.value} Armor`, '#0088ff', 2000);
            setPickups(pp => pp.map(pu => pu.id === pickup.id ? { ...pu, collected: true } : pu));
            return { ...p, armor: Math.min(p.maxArmor, p.armor + pickup.value) };
          }
          if (pickup.type === 'money') {
            addNotification(`+$${pickup.value}`, '#ffdd00', 2000);
            setPickups(pp => pp.map(pu => pu.id === pickup.id ? { ...pu, collected: true } : pu));
            return { ...p, money: p.money + pickup.value, score: p.score + pickup.value };
          }
          if (pickup.type === 'weapon') {
            const wDef = WEAPONS[pickup.weapon];
            addNotification(`${wDef.name} picked up!`, '#ff6600', 2000);
            setPickups(pp => pp.map(pu => pu.id === pickup.id ? { ...pu, collected: true } : pu));
            return {
              ...p,
              currentWeapon: pickup.weapon,
              weapons: { ...p.weapons, [pickup.weapon]: { ammo: wDef.ammo } }
            };
          }
        }
        return p;
      });
      return pickup;
    }));

    // Mission target check
    if (missionTarget && activeMission) {
      setPlayer(p => {
        const dist = Math.sqrt((missionTarget.x - p.x) ** 2 + (missionTarget.y - p.y) ** 2);
        if (dist < 60) {
          completeMission(activeMission.id);
        }
        return p;
      });
    }

    // Update camera
    setPlayer(p => {
      setCamera({
        x: p.x - GAME_CONFIG.CANVAS_WIDTH / 2,
        y: p.y - GAME_CONFIG.CANVAS_HEIGHT / 2,
      });
      return p;
    });

    // Update wanted decay
    setWanted(w => {
      if (w > 0) {
        setWantedTimer(t => {
          if (t > GAME_CONFIG.WANTED_DECAY_TIME / 60) {
            setWanted(ww => Math.max(0, ww - 1));
            return 0;
          }
          return t + dt;
        });
      }
      return w;
    });

    // Update explosions
    setExplosions(prev => prev.map(e => ({
      ...e,
      radius: e.radius + 3 * dt,
      opacity: Math.max(0, 1 - (e.radius / e.maxRadius)),
    })));

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [fireBullet, addBlood, addNotification, addExplosion, missionTarget, activeMission, completeMission]);

  // Mouse shoot
  const handleMouseDown = useCallback((e) => {
    if (gameState !== 'playing') return;
    mouseRef.current.buttons = e.buttons;
    setPlayer(p => {
      const weapon = WEAPONS[p.currentWeapon];
      if (!weapon) return p;
      const weaponState = p.weapons[p.currentWeapon];
      if (!weaponState) return p;
      if (weapon.ammo !== Infinity && weaponState.ammo <= 0) {
        addNotification('Out of ammo!', '#ff4400', 1500);
        return p;
      }
      const fired = fireBullet(p.x, p.y, p.angle, weapon, false);
      if (fired && weapon.ammo !== Infinity) {
        return {
          ...p,
          weapons: {
            ...p.weapons,
            [p.currentWeapon]: { ammo: Math.max(0, weaponState.ammo - 1) }
          }
        };
      }
      return p;
    });
  }, [gameState, fireBullet, addNotification]);

  const handleMouseMove = useCallback((e) => {
    mouseRef.current.x = e.clientX;
    mouseRef.current.y = e.clientY;
  }, []);

  const handleKeyDown = useCallback((e) => {
    keysRef.current[e.code] = true;

    if (gameState !== 'playing') return;

    // Weapon switch
    if (e.code === 'Digit1') setPlayer(p => ({ ...p, currentWeapon: 'FIST' }));
    if (e.code === 'Digit2') setPlayer(p => p.weapons.PISTOL ? { ...p, currentWeapon: 'PISTOL' } : p);
    if (e.code === 'Digit3') setPlayer(p => p.weapons.SHOTGUN ? { ...p, currentWeapon: 'SHOTGUN' } : p);
    if (e.code === 'Digit4') setPlayer(p => p.weapons.AK47 ? { ...p, currentWeapon: 'AK47' } : p);
    if (e.code === 'Digit5') setPlayer(p => p.weapons.ROCKET ? { ...p, currentWeapon: 'ROCKET' } : p);

    if (e.code === 'Escape') setGameState(s => s === 'playing' ? 'paused' : 'playing');

    // Enter car
    if (e.code === 'KeyF') {
      setPlayer(p => {
        let closestCar = null;
        let closestDist = 80;
        setCars(cPrev => {
          cPrev.forEach(car => {
            if (car.occupied) return;
            const dist = Math.sqrt((car.x - p.x) ** 2 + (car.y - p.y) ** 2);
            if (dist < closestDist) { closestCar = car; closestDist = dist; }
          });
          return cPrev;
        });
        if (closestCar) {
          addNotification(`Entering ${closestCar.type}!`, '#ff6600', 2000);
          setCars(cPrev => cPrev.map(c => c.id === closestCar.id ? { ...c, occupied: true } : c));
          return { ...p, inCar: closestCar, x: closestCar.x, y: closestCar.y };
        }
        if (p.inCar) {
          addNotification('Exiting vehicle', '#aaaaaa', 1500);
          setCars(cPrev => cPrev.map(c => c.id === p.inCar.id ? { ...c, occupied: false } : c));
          return { ...p, inCar: null };
        }
        return p;
      });
    }
  }, [gameState, addNotification]);

  const handleKeyUp = useCallback((e) => {
    keysRef.current[e.code] = false;
  }, []);

  // Continuous shooting on mousedown
  useEffect(() => {
    const interval = setInterval(() => {
      if (mouseRef.current.buttons === 1 && gameState === 'playing') {
        setPlayer(p => {
          const weapon = WEAPONS[p.currentWeapon];
          if (!weapon) return p;
          const weaponState = p.weapons[p.currentWeapon];
          if (!weaponState) return p;
          if (weapon.ammo !== Infinity && weaponState.ammo <= 0) return p;
          const fired = fireBullet(p.x, p.y, p.angle, weapon, false);
          if (fired && weapon.ammo !== Infinity) {
            return {
              ...p,
              weapons: {
                ...p.weapons,
                [p.currentWeapon]: { ammo: Math.max(0, weaponState.ammo - 1) }
              }
            };
          }
          return p;
        });
      }
    }, 50);
    return () => clearInterval(interval);
  }, [gameState, fireBullet]);

  // Move enemies (separate interval for cleaner state updates)
  useEffect(() => {
    if (gameState !== 'playing') return;
    const interval = setInterval(() => {
      setEnemies(prev => prev.map(enemy => {
        if (enemy.health <= 0) return enemy;
        let ex = enemy.x, ey = enemy.y;
        setPlayer(p => {
          const distToPlayer = Math.sqrt((enemy.x - p.x) ** 2 + (enemy.y - p.y) ** 2);
          let newState = distToPlayer < enemy.alertRadius ? 'chase' : 'patrol';

          if (newState === 'chase') {
            const ang = Math.atan2(p.y - enemy.y, p.x - enemy.x);
            ex = enemy.x + Math.cos(ang) * ENEMY_SPEED;
            ey = enemy.y + Math.sin(ang) * ENEMY_SPEED;
          } else {
            const t = Date.now() / 2000;
            ex = enemy.x + Math.sin(t + enemy.id.charCodeAt(1)) * 0.5;
            ey = enemy.y + Math.cos(t + enemy.id.charCodeAt(1)) * 0.5;
          }
          setEnemies(ePrev => ePrev.map(e =>
            e.id === enemy.id ? { ...e, x: ex, y: ey, state: newState } : e
          ));
          return p;
        });
        return enemy;
      }));
    }, 50);
    return () => clearInterval(interval);
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'playing') {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    } else {
      cancelAnimationFrame(gameLoopRef.current);
      lastTimeRef.current = 0;
    }
    return () => cancelAnimationFrame(gameLoopRef.current);
  }, [gameState, gameLoop]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', () => { mouseRef.current.buttons = 0; });
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, [handleKeyDown, handleKeyUp, handleMouseMove, handleMouseDown]);

  const startGame = useCallback(() => {
    setPlayer({
      x: 600, y: 400, health: 100, maxHealth: 100,
      armor: 0, maxArmor: 100, money: 500, angle: 0,
      speed: PLAYER_SPEED, inCar: null, currentWeapon: 'FIST',
      weapons: { FIST: { ammo: Infinity } }, score: 0, kills: 0,
    });
    setEnemies(INITIAL_ENEMIES.map(e => ({ ...e })));
    setBullets([]);
    setPickups(PICKUPS.map(p => ({ ...p, collected: false })));
    setCars(PARKED_CARS.map(c => ({ ...c, occupied: false })));
    setWanted(0);
    setWantedTimer(0);
    setMissions(MISSIONS.map(m => ({ ...m })));
    setActiveMission(null);
    setNotifications([]);
    setExplosions([]);
    setBloodSplatters([]);
    setGameTime(0);
    setGameState('playing');
    addNotification('Welcome to Vice City!', '#ff00aa', 3000);
    addNotification('WASD to move, Mouse to aim & shoot', '#ffffff', 4000);
  }, [addNotification]);

  return {
    gameState, setGameState, startGame,
    player, enemies, bullets, pickups, cars,
    wanted, missions, activeMission, startMission,
    notifications, camera, explosions, bloodSplatters,
    missionTarget, gameTime,
  };
}
