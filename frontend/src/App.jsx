import { useEffect, useState } from 'react';
import { getShapes } from './services/api';
import TraceCanvas from './components/TraceCanvas';
import Login from './components/Login';
import Leaderboard from './components/Leaderboard';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  
  const [shapes, setShapes] = useState([]);
  const [currentShape, setCurrentShape] = useState(null);
  const [difficulty, setDifficulty] = useState('medium');
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  useEffect(() => {
    if (user) {
      getShapes().then(data => {
        setShapes(data);
        if(data.length > 0) setCurrentShape(data[0]); 
      });
    }
  }, [user]);

  const handleScoreUpdate = (newXP) => {
    setUser(prev => ({ ...prev, xp: newXP }));
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
  };

  if (!user) {
    return <Login onLogin={(u, t) => { setUser(u); setToken(t); }} />;
  }

  return (
    <div className="app-layout">
      <Leaderboard isOpen={showLeaderboard} onClose={() => setShowLeaderboard(false)} />

      <aside className="sidebar">
        <div className="brand">
          <h1>Traced</h1>
        </div>

        {/* --- USER PROFILE SECTION --- */}
        <div className="p-4 mb-4 bg-slate-800 rounded-lg border border-slate-700">
          <div className="flex justify-between items-start mb-2">
            <div>
                <p className="text-xs text-gray-400 uppercase">Player</p>
                <p className="font-bold text-white text-lg leading-tight">{user.username}</p>
                <p className="text-xs text-indigo-400 font-mono mt-1">XP: {user.xp || 0}</p>
            </div>
            {/* LOGOUT BUTTON RESTORED HERE */}
            <button 
                onClick={handleLogout} 
                className="logout-btn"
            >
                Logout
            </button>
          </div>
          
          <button 
            onClick={() => setShowLeaderboard(true)}
            className="w-full bg-yellow-600/20 text-yellow-500 border border-yellow-600/50 rounded py-2 text-xs font-bold hover:bg-yellow-600/30 transition flex items-center justify-center gap-2"
          >
            🏆 Leaderboard
          </button>
        </div>

        {/* --- DIFFICULTY SELECTOR --- */}
        <div className="difficulty-selector mb-6">
          <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wide">Difficulty</label>
          <select 
            value={difficulty} 
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full bg-slate-900 border border-slate-600 text-white text-sm rounded p-2 focus:border-indigo-500 outline-none"
          >
            <option value="easy">Easy (Forgiving)</option>
            <option value="medium">Medium (Standard)</option>
            <option value="hard">Hard (Strict)</option>
          </select>
        </div>

        <nav className="level-list">
          <h3 className="text-xs text-gray-500 uppercase mb-2">Levels</h3>
          {shapes.map((shape, index) => (
             <button 
               key={shape._id} 
               className={`level-btn ${currentShape?._id === shape._id ? 'active' : ''}`}
               onClick={() => setCurrentShape(shape)}
             >
               <span className="level-num">{index + 1}</span>
               <span className="level-name truncate">{shape.name}</span>
             </button>
           ))}
        </nav>
      </aside>

      <main className="game-stage">
        {currentShape ? (
          <div className="canvas-wrapper">
             <TraceCanvas 
                key={`${currentShape._id}-${difficulty}`} 
                shape={currentShape} 
                difficulty={difficulty}
                userId={user.id}
                onScoreUpdate={handleScoreUpdate}
             />
          </div>
        ) : (
          <div className="loading">Loading...</div>
        )}
      </main>
    </div>
  );
}

export default App;