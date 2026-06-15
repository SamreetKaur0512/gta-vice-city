import React from 'react';
import { COLORS } from '../utils/gameConfig';

export default function MissionPanel({ missions, activeMission, onStartMission, onClose }) {
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,10,0.8)',
      backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 400,
      fontFamily: "'Courier New', monospace",
    }} onClick={onClose}>
      <div style={{
        background: 'rgba(5,0,20,0.97)',
        border: `2px solid ${COLORS.NEON_CYAN}`,
        borderRadius: 8,
        padding: '28px 36px',
        minWidth: 400,
        maxWidth: 520,
        boxShadow: `0 0 40px ${COLORS.NEON_CYAN}44`,
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 22, color: COLORS.NEON_CYAN, fontWeight: 'bold', textShadow: `0 0 10px ${COLORS.NEON_CYAN}` }}>
              MISSION SELECT
            </div>
            <div style={{ fontSize: 11, color: '#555', letterSpacing: 3 }}>VICE CITY OPERATIONS</div>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: '1px solid #444',
            color: '#666', cursor: 'pointer', padding: '4px 10px',
            fontFamily: "'Courier New', monospace', fontSize: 14",
          }}>✕</button>
        </div>

        {missions.map((mission) => {
          const isActive = activeMission?.id === mission.id;
          return (
            <div key={mission.id} style={{
              background: mission.completed
                ? 'rgba(0,255,68,0.05)'
                : isActive
                  ? 'rgba(255,0,170,0.1)'
                  : 'rgba(255,255,255,0.03)',
              border: `1px solid ${mission.completed ? '#00ff4444' : isActive ? COLORS.NEON_PINK : '#222'}`,
              borderRadius: 6,
              padding: '14px 16px',
              marginBottom: 10,
              opacity: mission.completed ? 0.6 : 1,
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{
                  fontSize: 20,
                  marginTop: 2,
                }}>
                  {mission.completed ? '✅' : isActive ? '🎯' : '📋'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{
                      fontSize: 14, fontWeight: 'bold',
                      color: mission.completed ? '#666' : isActive ? COLORS.NEON_PINK : '#fff',
                      textDecoration: mission.completed ? 'line-through' : 'none',
                    }}>
                      {mission.title}
                    </div>
                    <div style={{ fontSize: 14, color: COLORS.MONEY_GREEN, fontWeight: 'bold' }}>
                      ${mission.reward.toLocaleString()}
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: '#888', marginTop: 4, lineHeight: 1.5 }}>
                    {mission.description}
                  </div>

                  {!mission.completed && (
                    <div style={{ marginTop: 10 }}>
                      {isActive ? (
                        <span style={{
                          fontSize: 11, color: COLORS.NEON_PINK,
                          border: `1px solid ${COLORS.NEON_PINK}`,
                          padding: '2px 8px', borderRadius: 3,
                        }}>
                          ● ACTIVE
                        </span>
                      ) : (
                        <button
                          onClick={() => { onStartMission(mission); onClose(); }}
                          style={{
                            background: 'transparent',
                            border: `1px solid ${COLORS.NEON_CYAN}`,
                            color: COLORS.NEON_CYAN,
                            fontSize: 11,
                            fontFamily: "'Courier New', monospace",
                            cursor: 'pointer',
                            padding: '4px 14px',
                            borderRadius: 3,
                            letterSpacing: 1,
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={e => e.target.style.background = `${COLORS.NEON_CYAN}22`}
                          onMouseLeave={e => e.target.style.background = 'transparent'}
                        >
                          START MISSION
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        <div style={{ fontSize: 11, color: '#444', textAlign: 'center', marginTop: 12 }}>
          Press M or click outside to close
        </div>
      </div>
    </div>
  );
}
