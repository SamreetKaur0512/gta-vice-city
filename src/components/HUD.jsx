import React from 'react';
import { WEAPONS, COLORS } from '../utils/gameConfig';

function WantedStars({ count }) {
  return (
    <div style={{ display: 'flex', gap: 3 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} style={{
          fontSize: 18,
          color: i < count ? COLORS.STAR_YELLOW : '#333',
          textShadow: i < count ? `0 0 8px ${COLORS.STAR_YELLOW}` : 'none',
          transition: 'all 0.3s',
        }}>★</span>
      ))}
    </div>
  );
}

function StatBar({ value, max, color, label, icon }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
        <span style={{ fontSize: 13, color: '#aaa' }}>{icon} {label}</span>
        <span style={{ fontSize: 12, color, marginLeft: 'auto' }}>{Math.round(value)}/{max}</span>
      </div>
      <div style={{
        width: 180, height: 6,
        background: '#111',
        borderRadius: 3,
        border: '1px solid #333',
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${pct}%`, height: '100%',
          background: color,
          boxShadow: `0 0 6px ${color}`,
          transition: 'width 0.2s ease',
        }} />
      </div>
    </div>
  );
}

function WeaponSlot({ weaponKey, isActive, hasWeapon, ammo }) {
  const weapon = WEAPONS[weaponKey];
  const keys = { FIST: '1', PISTOL: '2', SHOTGUN: '3', AK47: '4', ROCKET: '5' };
  return (
    <div style={{
      padding: '4px 8px',
      background: isActive ? `${weapon.color}33` : '#ffffff11',
      border: `1px solid ${isActive ? weapon.color : '#333'}`,
      borderRadius: 4,
      opacity: hasWeapon ? 1 : 0.35,
      boxShadow: isActive ? `0 0 8px ${weapon.color}66` : 'none',
      minWidth: 60,
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 10, color: '#888' }}>[{keys[weaponKey]}]</div>
      <div style={{ fontSize: 11, color: isActive ? weapon.color : '#666', fontWeight: isActive ? 'bold' : 'normal' }}>
        {weapon.name}
      </div>
      <div style={{ fontSize: 10, color: '#aaa' }}>
        {ammo === Infinity ? '∞' : (ammo || 0)}
      </div>
    </div>
  );
}

export default function HUD({ player, wanted, missions, activeMission, notifications, gameTime }) {
  const { health, maxHealth, armor, maxArmor, money, score, kills, currentWeapon, weapons } = player;

  const minutes = Math.floor(gameTime / 60).toString().padStart(2, '0');
  const seconds = Math.floor(gameTime % 60).toString().padStart(2, '0');

  const completedMissions = missions.filter(m => m.completed).length;

  return (
    <>
      {/* Top-left: Player stats */}
      <div style={{
        position: 'fixed', top: 16, left: 16,
        fontFamily: "'Courier New', monospace",
        color: '#fff',
        zIndex: 100,
        userSelect: 'none',
      }}>
        <StatBar value={health} max={maxHealth} color={COLORS.HEALTH_GREEN} label="Health" icon="❤" />
        <StatBar value={armor} max={maxArmor} color={COLORS.ARMOR_BLUE} label="Armor" icon="🛡" />
      </div>

      {/* Top-right: Money, Score, Time */}
      <div style={{
        position: 'fixed', top: 16, right: 16,
        fontFamily: "'Courier New', monospace",
        textAlign: 'right',
        zIndex: 100,
        userSelect: 'none',
      }}>
        <div style={{
          fontSize: 28, fontWeight: 'bold',
          color: COLORS.MONEY_GREEN,
          textShadow: `0 0 12px ${COLORS.MONEY_GREEN}`,
          letterSpacing: 2,
        }}>
          ${money.toLocaleString()}
        </div>
        <div style={{ fontSize: 14, color: '#ffdd00', marginTop: 2 }}>
          SCORE: {score.toLocaleString()}
        </div>
        <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
          KILLS: {kills} | ⏱ {minutes}:{seconds}
        </div>
        <div style={{ marginTop: 6 }}>
          <WantedStars count={wanted} />
        </div>
      </div>

      {/* Bottom: Weapon bar */}
      <div style={{
        position: 'fixed', bottom: 16, left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex', gap: 6,
        zIndex: 100,
        userSelect: 'none',
        background: 'rgba(0,0,0,0.6)',
        padding: '8px 12px',
        borderRadius: 8,
        border: '1px solid #333',
      }}>
        {Object.keys(WEAPONS).map(wKey => (
          <WeaponSlot
            key={wKey}
            weaponKey={wKey}
            isActive={currentWeapon === wKey}
            hasWeapon={!!weapons[wKey]}
            ammo={weapons[wKey]?.ammo}
          />
        ))}
      </div>

      {/* Bottom-right: Mission info */}
      <div style={{
        position: 'fixed', bottom: 90, right: 16,
        fontFamily: "'Courier New', monospace",
        zIndex: 100,
        userSelect: 'none',
        maxWidth: 240,
      }}>
        {activeMission && (
          <div style={{
            background: 'rgba(255, 0, 170, 0.15)',
            border: `1px solid ${COLORS.NEON_PINK}`,
            borderRadius: 6,
            padding: '8px 12px',
            marginBottom: 8,
          }}>
            <div style={{ fontSize: 10, color: COLORS.NEON_PINK, letterSpacing: 2, marginBottom: 4 }}>
              ACTIVE MISSION
            </div>
            <div style={{ fontSize: 13, color: '#fff', fontWeight: 'bold' }}>{activeMission.title}</div>
            <div style={{ fontSize: 11, color: '#ccc', marginTop: 4 }}>{activeMission.description}</div>
            <div style={{ fontSize: 11, color: COLORS.MONEY_GREEN, marginTop: 4 }}>
              Reward: ${activeMission.reward.toLocaleString()}
            </div>
          </div>
        )}

        <div style={{
          background: 'rgba(0,0,0,0.6)',
          border: '1px solid #333',
          borderRadius: 6,
          padding: '6px 10px',
          fontSize: 11,
          color: '#888',
        }}>
          Missions: {completedMissions}/{missions.length} completed
        </div>
      </div>

      {/* Bottom-left: Car indicator */}
      {player.inCar && (
        <div style={{
          position: 'fixed', bottom: 90, left: 16,
          fontFamily: "'Courier New', monospace",
          background: `rgba(255, 102, 0, 0.2)`,
          border: `1px solid ${COLORS.NEON_ORANGE}`,
          borderRadius: 6,
          padding: '8px 14px',
          zIndex: 100,
          userSelect: 'none',
        }}>
          <div style={{ fontSize: 10, color: COLORS.NEON_ORANGE, letterSpacing: 2 }}>VEHICLE</div>
          <div style={{ fontSize: 16, color: '#fff', fontWeight: 'bold' }}>
            🚗 {player.inCar.type}
          </div>
          <div style={{ fontSize: 11, color: '#888' }}>Press F to exit</div>
        </div>
      )}

      {/* Crosshair */}
      <div style={{
        position: 'fixed',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 99,
      }}>
        <svg width="24" height="24" viewBox="-12 -12 24 24">
          <line x1="-10" y1="0" x2="-3" y2="0" stroke="#ff00aa" strokeWidth="1.5" opacity="0.7" />
          <line x1="3" y1="0" x2="10" y2="0" stroke="#ff00aa" strokeWidth="1.5" opacity="0.7" />
          <line x1="0" y1="-10" x2="0" y2="-3" stroke="#ff00aa" strokeWidth="1.5" opacity="0.7" />
          <line x1="0" y1="3" x2="0" y2="10" stroke="#ff00aa" strokeWidth="1.5" opacity="0.7" />
          <circle cx="0" cy="0" r="2" fill="none" stroke="#ff00aa" strokeWidth="1" opacity="0.5" />
        </svg>
      </div>

      {/* Notifications */}
      <div style={{
        position: 'fixed', top: '40%', left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        pointerEvents: 'none',
        zIndex: 200,
        userSelect: 'none',
      }}>
        {notifications.map((n, i) => (
          <div key={n.id} style={{
            color: n.color,
            textShadow: `0 0 10px ${n.color}`,
            fontSize: i === 0 ? 20 : 15,
            fontFamily: "'Courier New', monospace",
            fontWeight: 'bold',
            background: 'rgba(0,0,0,0.5)',
            padding: '4px 14px',
            borderRadius: 4,
            border: `1px solid ${n.color}44`,
            animation: 'fadeInUp 0.3s ease',
            letterSpacing: 1,
          }}>
            {n.text}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
