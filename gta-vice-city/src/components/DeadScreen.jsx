import React, { useEffect, useState } from 'react';

export default function DeadScreen({ player, onRestart, onMenu }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(100,0,0,0.7)',
      backdropFilter: 'blur(3px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 500,
      fontFamily: "'Courier New', monospace",
      transition: 'opacity 0.5s',
      opacity: visible ? 1 : 0,
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontSize: 'clamp(48px, 8vw, 80px)',
          fontWeight: '900',
          color: '#ff0000',
          textShadow: '0 0 30px #ff0000, 0 0 60px #ff0000',
          letterSpacing: 4,
          marginBottom: 8,
        }}>
          WASTED
        </div>
        <div style={{ fontSize: 16, color: '#888', marginBottom: 32, letterSpacing: 2 }}>
          You were taken down in Vice City
        </div>

        <div style={{
          background: 'rgba(0,0,0,0.6)',
          border: '1px solid #440000',
          borderRadius: 8,
          padding: '20px 32px',
          marginBottom: 32,
          display: 'inline-block',
        }}>
          <div style={{ fontSize: 12, color: '#ff6666', letterSpacing: 2, marginBottom: 12 }}>FINAL STATS</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px', fontSize: 14 }}>
            <div style={{ color: '#888' }}>Score: <span style={{ color: '#ffdd00' }}>{player.score.toLocaleString()}</span></div>
            <div style={{ color: '#888' }}>Money: <span style={{ color: '#00cc44' }}>${player.money.toLocaleString()}</span></div>
            <div style={{ color: '#888' }}>Kills: <span style={{ color: '#ff4444' }}>{player.kills}</span></div>
            <div style={{ color: '#888' }}>Weapon: <span style={{ color: '#aaa' }}>{player.currentWeapon}</span></div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
          <button onClick={onRestart} style={btnStyle('#ff0000')}>TRY AGAIN</button>
          <button onClick={onMenu} style={btnStyle('#555')}>MAIN MENU</button>
        </div>
      </div>
    </div>
  );
}

const btnStyle = (color) => ({
  background: 'transparent',
  border: `2px solid ${color}`,
  color,
  fontSize: 16,
  fontWeight: 'bold',
  letterSpacing: 3,
  padding: '12px 32px',
  cursor: 'pointer',
  fontFamily: "'Courier New', monospace",
  borderRadius: 4,
  transition: 'all 0.2s',
});
