// Game Configuration
export const GAME_CONFIG = {
  CANVAS_WIDTH: window.innerWidth,
  CANVAS_HEIGHT: window.innerHeight,
  TILE_SIZE: 64,
  PLAYER_SPEED: 3,
  PLAYER_SIZE: 28,
  SPRINT_MULTIPLIER: 1.8,
  BULLET_SPEED: 12,
  BULLET_RANGE: 400,
  ENEMY_SPEED: 1.2,
  ENEMY_SIZE: 28,
  WANTED_DECAY_TIME: 8000,
  MAX_WANTED: 5,
  CAR_SPEED: 6,
  CAR_SIZE: { w: 56, h: 32 },
};

export const WEAPONS = {
  FIST: { name: 'Fist', damage: 15, range: 50, fireRate: 800, ammo: Infinity, color: '#ffcc00' },
  PISTOL: { name: 'Pistol', damage: 25, range: 300, fireRate: 400, ammo: 60, color: '#aaaaaa' },
  SHOTGUN: { name: 'Shotgun', damage: 60, range: 180, fireRate: 900, ammo: 24, color: '#ff6600' },
  AK47: { name: 'AK-47', damage: 30, range: 350, fireRate: 150, ammo: 120, color: '#cc3300' },
  ROCKET: { name: 'RPG', damage: 150, range: 500, fireRate: 2000, ammo: 5, color: '#ff0066' },
};

export const COLORS = {
  // Vice City palette
  NEON_PINK: '#ff00aa',
  NEON_CYAN: '#00ffff',
  NEON_YELLOW: '#ffff00',
  NEON_ORANGE: '#ff6600',
  DARK_BG: '#0a0a1a',
  ROAD: '#1a1a2e',
  SIDEWALK: '#2a2a3e',
  GRASS: '#0d2b1a',
  BUILDING_1: '#1e0a3c',
  BUILDING_2: '#2d1b69',
  BUILDING_3: '#0d1b4b',
  BUILDING_NEON: '#ff00cc',
  WATER: '#001a4d',
  BEACH_SAND: '#c8a96e',
  PALM_GREEN: '#1a6b2a',
  HEALTH_GREEN: '#00ff44',
  ARMOR_BLUE: '#0088ff',
  MONEY_GREEN: '#00cc44',
  WANTED_RED: '#ff2200',
  STAR_YELLOW: '#ffdd00',
};

export const MAP_TILES = {
  ROAD_H: 'road_h',
  ROAD_V: 'road_v',
  ROAD_INT: 'road_int',
  SIDEWALK: 'sidewalk',
  BUILDING: 'building',
  GRASS: 'grass',
  WATER: 'water',
  BEACH: 'beach',
  PARKING: 'parking',
};

// City map layout (simplified grid)
export const generateCityMap = () => {
  const cols = 40;
  const rows = 30;
  const map = [];

  for (let y = 0; y < rows; y++) {
    map[y] = [];
    for (let x = 0; x < cols; x++) {
      // Roads grid pattern
      if (y % 6 === 0 || x % 8 === 0) {
        map[y][x] = { type: MAP_TILES.ROAD_H, walkable: true };
      } else if (x < 5 || x > 35) {
        map[y][x] = { type: MAP_TILES.WATER, walkable: false };
      } else if (y > 27) {
        map[y][x] = { type: MAP_TILES.BEACH, walkable: true };
      } else if ((y % 6 === 1 || y % 6 === 5) && (x % 8 !== 0)) {
        map[y][x] = { type: MAP_TILES.SIDEWALK, walkable: true };
      } else {
        map[y][x] = { type: MAP_TILES.BUILDING, walkable: false };
      }
    }
  }
  return map;
};

export const PICKUPS = [
  { id: 'health1', x: 400, y: 300, type: 'health', value: 50, color: '#00ff44', symbol: '❤' },
  { id: 'armor1', x: 700, y: 200, type: 'armor', value: 50, color: '#0088ff', symbol: '🛡' },
  { id: 'money1', x: 550, y: 450, type: 'money', value: 500, color: '#ffdd00', symbol: '$' },
  { id: 'pistol1', x: 300, y: 500, type: 'weapon', weapon: 'PISTOL', color: '#aaaaaa', symbol: '🔫' },
  { id: 'shotgun1', x: 900, y: 350, type: 'weapon', weapon: 'SHOTGUN', color: '#ff6600', symbol: '🔫' },
  { id: 'ak1', x: 650, y: 150, type: 'weapon', weapon: 'AK47', color: '#cc3300', symbol: '🔫' },
  { id: 'money2', x: 800, y: 500, type: 'money', value: 1000, color: '#ffdd00', symbol: '$' },
  { id: 'health2', x: 200, y: 400, type: 'health', value: 100, color: '#00ff44', symbol: '❤' },
  { id: 'rocket1', x: 1100, y: 300, type: 'weapon', weapon: 'ROCKET', color: '#ff0066', symbol: '🚀' },
];

export const INITIAL_ENEMIES = [
  { id: 'e1', x: 500, y: 200, health: 100, type: 'gang', color: '#cc0000', alertRadius: 200, state: 'patrol' },
  { id: 'e2', x: 800, y: 400, health: 100, type: 'gang', color: '#cc0000', alertRadius: 200, state: 'patrol' },
  { id: 'e3', x: 300, y: 600, health: 100, type: 'gang', color: '#cc0000', alertRadius: 200, state: 'patrol' },
  { id: 'e4', x: 1000, y: 200, health: 80, type: 'police', color: '#0033cc', alertRadius: 300, state: 'patrol' },
  { id: 'e5', x: 600, y: 700, health: 80, type: 'police', color: '#0033cc', alertRadius: 300, state: 'patrol' },
  { id: 'e6', x: 1200, y: 500, health: 100, type: 'gang', color: '#990099', alertRadius: 200, state: 'patrol' },
  { id: 'e7', x: 150, y: 350, health: 100, type: 'gang', color: '#cc0000', alertRadius: 200, state: 'patrol' },
];

export const PARKED_CARS = [
  { id: 'car1', x: 450, y: 180, angle: 0, color: '#ff3366', type: 'Infernus' },
  { id: 'car2', x: 700, y: 380, angle: Math.PI / 2, color: '#3366ff', type: 'Cheetah' },
  { id: 'car3', x: 250, y: 550, angle: 0, color: '#ffcc00', type: 'Comet' },
  { id: 'car4', x: 950, y: 280, angle: Math.PI, color: '#00ccff', type: 'Stinger' },
  { id: 'car5', x: 1100, y: 450, angle: Math.PI / 2, color: '#ff6600', type: 'Banshee' },
];

export const MISSIONS = [
  {
    id: 'm1',
    title: 'The First Deal',
    description: 'Collect the briefcase near the beach and bring it to the warehouse.',
    targetX: 850, targetY: 600,
    reward: 2000,
    completed: false,
  },
  {
    id: 'm2',
    title: 'Gang Elimination',
    description: 'Eliminate all red gang members in the area.',
    enemyType: 'gang',
    reward: 3500,
    completed: false,
  },
  {
    id: 'm3',
    title: 'Hot Wheels',
    description: 'Steal the yellow Comet and deliver it to the garage.',
    targetCarId: 'car3',
    targetX: 1000, targetY: 150,
    reward: 5000,
    completed: false,
  },
];
