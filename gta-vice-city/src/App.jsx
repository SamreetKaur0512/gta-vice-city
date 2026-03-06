import React, { useState, useEffect, useCallback } from 'react';
import MainMenu from './components/MainMenu';
import GameCanvas from './components/GameCanvas';
import HUD from './components/HUD';
import PauseMenu from './components/PauseMenu';
import DeadScreen from './components/DeadScreen';
import MissionPanel from './components/MissionPanel';
import Minimap from './components/Minimap';
import { useGameEngine } from './hooks/useGameEngine';

export default function App() {
  const {
    gameState, setGameState, startGame,
    player, enemies, bullets, pickups, cars,
    wanted, missions, activeMission, startMission,
    notifications, camera, explosions, bloodSplatters,
    missionTarget, gameTime,
  } = useGameEngine();

  const [showMissions, setShowMissions] = useState(false);

  const handleKeyDown = useCallback((e) => {
    if (e.code === 'KeyM' && gameState === 'playing') {
      setShowMissions(prev => !prev);
    }
  }, [gameState]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Prevent context menu
  useEffect(() => {
    const prevent = e => e.preventDefault();
    window.addEventListener('contextmenu', prevent);
    return () => window.removeEventListener('contextmenu', prevent);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: '#000' }}>
      {gameState === 'menu' && (
        <MainMenu onStart={startGame} />
      )}

      {(gameState === 'playing' || gameState === 'paused' || gameState === 'dead') && (
        <>
          <GameCanvas
            player={player}
            enemies={enemies}
            bullets={bullets}
            pickups={pickups}
            cars={cars}
            explosions={explosions}
            bloodSplatters={bloodSplatters}
            camera={camera}
            missionTarget={missionTarget}
            gameTime={gameTime}
          />

          <HUD
            player={player}
            wanted={wanted}
            missions={missions}
            activeMission={activeMission}
            notifications={notifications}
            gameTime={gameTime}
          />

          <Minimap
            player={player}
            enemies={enemies}
            pickups={pickups}
            missionTarget={missionTarget}
          />

          {/* Mission button */}
          {gameState === 'playing' && (
            <button
              onClick={() => setShowMissions(true)}
              style={{
                position: 'fixed', top: 16, left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(0,0,0,0.7)',
                border: '1px solid #00ffff44',
                color: '#00ffff',
                fontSize: 11,
                letterSpacing: 3,
                padding: '6px 16px',
                cursor: 'pointer',
                fontFamily: "'Courier New', monospace",
                borderRadius: 4,
                zIndex: 100,
              }}
            >
              [M] MISSIONS ({missions.filter(m => m.completed).length}/{missions.length})
            </button>
          )}
        </>
      )}

      {gameState === 'paused' && (
        <PauseMenu
          player={player}
          missions={missions}
          onResume={() => setGameState('playing')}
          onQuit={() => { setGameState('menu'); setShowMissions(false); }}
        />
      )}

      {gameState === 'dead' && (
        <DeadScreen
          player={player}
          onRestart={startGame}
          onMenu={() => setGameState('menu')}
        />
      )}

      {showMissions && gameState === 'playing' && (
        <MissionPanel
          missions={missions}
          activeMission={activeMission}
          onStartMission={startMission}
          onClose={() => setShowMissions(false)}
        />
      )}
    </div>
  );
}
