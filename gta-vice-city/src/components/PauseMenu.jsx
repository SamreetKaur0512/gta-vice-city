import React from 'react';

export default function PauseMenu({ player, missions, onResume, onQuit }) {
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,10,0.85)',
      backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 500,
      fontFamily: "'Courier New', monospace",
    }}>
      <div style={{
        background: 'rgba(5,0,20,0.95)',
        border: '2px solid #ff00aa',
        borderRadius: 8,
        padding: '32px 40px',
        minWidth: 360,
        boxShadow: '0 0 60px #ff00aa44',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 28, color: '#ff00aa', fontWeight: 'bold', textShadow: '0 0 15px #ff00aa', marginBottom: 4 }}>
          PAUSED
        </div>
        <div style={{ fontSize: 11, color: '#00ffff', letterSpacing: 4, marginBottom: 28 }}>
          VICE CITY
        </div>

        {/* Stats */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          borderRadius: 6,
          padding: '16px',
          marginBottom: 24,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 10,
          textAlign: 'left',
        }}>
          <Stat label="Health" value={`${Math.round(player.health)}%`} color="#00ff44" />
          <Stat label="Armor" value={`${Math.round(player.armor)}`} color="#0088ff" />
          <Stat label="Money" value={`$${player.money.toLocaleString()}`} color="#ffdd00" />
          <Stat label="Score" value={player.score.toLocaleString()} color="#ff6600" />
          <Stat label="Kills" value={player.kills} color="#ff0044" />
          <Stat label="Weapon" value={player.currentWeapon} color="#aaaaaa" />
        </div>

        {/* Missions list */}
        <div style={{ marginBottom: 24, textAlign: 'left' }}>
          <div style={{ fontSize: 11, color: '#ff00aa', letterSpacing: 3, marginBottom: 8 }}>MISSIONS</div>
          {missions.map(m => (
            <div key={m.id} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              marginBottom: 6, fontSize: 12,
            }}>
              <span style={{ color: m.completed ? '#00ff44' : '#555' }}>
                {m.completed ? '✓' : '○'}
              </span>
              <span style={{ color: m.completed ? '#888' : '#ccc', textDecoration: m.completed ? 'line-through' : 'none' }}>
                {m.title}
              </span>
              <span style={{ marginLeft: 'auto', color: '#ffdd00', fontSize: 11 }}>
                ${m.reward.toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <MenuBtn onClick={onResume} color="#ff00aa" label="RESUME" />
          <MenuBtn onClick={onQuit} color="#555" label="QUIT TO MENU" />
        </div>

        <div style={{ fontSize: 10, color: '#444', marginTop: 16 }}>ESC to resume</div>
      </div>
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div>
      <div style={{ fontSize: 10, color: '#555', letterSpacing: 1 }}>{label}</div>
      <div style={{ fontSize: 14, color, fontWeight: 'bold' }}>{value}</div>
    </div>
  );
}

function MenuBtn({ onClick, color, label }) {
  return (
    <button onClick={onClick} style={{
      background: 'transparent',
      border: `1px solid ${color}`,
      color,
      fontSize: 14,
      fontWeight: 'bold',
      letterSpacing: 3,
      padding: '10px 24px',
      cursor: 'pointer',
      fontFamily: "'Courier New', monospace",
      borderRadius: 4,
      transition: 'all 0.2s',
      width: '100%',
    }}
      onMouseEnter={e => { e.target.style.background = color + '22'; }}
      onMouseLeave={e => { e.target.style.background = 'transparent'; }}
    >
      {label}
    </button>
  );
}
