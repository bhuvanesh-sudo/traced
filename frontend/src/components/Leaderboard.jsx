import React, { useEffect, useState } from 'react';
import './Leaderboard.css'; // Import the CSS

const Leaderboard = ({ isOpen, onClose }) => {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetch('http://localhost:5000/api/game/leaderboard')
        .then(res => res.json())
        .then(data => setLeaders(data))
        .catch(err => console.error(err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="leaderboard-overlay" onClick={onClose}>
      {/* Stop click propagation so clicking the modal doesn't close it */}
      <div className="leaderboard-modal" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-slate-700 bg-slate-900/50 rounded-t-lg">
          <h2 className="text-xl font-bold text-yellow-400 flex items-center gap-2">
            🏆 Hall of Fame
          </h2>
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>
        
        {/* Content */}
        <div className="leaderboard-content">
          {leaders.length === 0 ? (
            <p className="text-center text-slate-500 py-4">Loading stats...</p>
          ) : (
            <table className="lb-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Hero</th>
                  <th className="text-right">XP</th>
                </tr>
              </thead>
              <tbody>
                {leaders.map((player, idx) => (
                  <tr key={idx}>
                    <td className="lb-rank">#{idx + 1}</td>
                    <td className="font-bold">{player.username}</td>
                    <td className="lb-xp">{player.xp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
};

export default Leaderboard;