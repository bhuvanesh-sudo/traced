import { useEffect, useState } from 'react'
import { getShapes } from './services/api'
import TraceCanvas from './components/TraceCanvas'
import './App.css' // We will update CSS next

function App() {
  const [shapes, setShapes] = useState([]);
  const [currentShape, setCurrentShape] = useState(null);
  const [difficulty, setDifficulty] = useState('medium');

  useEffect(() => {
    getShapes().then(data => {
      setShapes(data);
      if(data.length > 0) setCurrentShape(data[0]); // Auto-select first level
    });
  }, []);

  return (
    <div className="app-layout">
      
      {/* SIDEBAR: LEVEL MAP */}
      <aside className="sidebar">
        <div className="brand">
          <h1>Traced</h1>
          <span className="subtitle">Motor Skills RPG</span>
        </div>

        <div className="difficulty-selector">
          <label>Difficulty</label>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="easy">Easy (Forgiving)</option>
            <option value="medium">Medium (Standard)</option>
            <option value="hard">Hard (Strict)</option>
          </select>
        </div>

        <nav className="level-list">
          <h3>Select Level</h3>
          {shapes.map((shape, index) => (
            <button 
              key={shape._id} 
              className={`level-btn ${currentShape?._id === shape._id ? 'active' : ''}`}
              onClick={() => setCurrentShape(shape)}
            >
              <span className="level-num">{index + 1}</span>
              <span className="level-name">{shape.name}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT: GAME AREA */}
      <main className="game-stage">
        {currentShape ? (
          <div className="canvas-wrapper">
             <TraceCanvas 
                key={`${currentShape._id}-${difficulty}`} // Force reset on change
                shape={currentShape} 
                difficulty={difficulty} 
             />
          </div>
        ) : (
          <div className="loading">Loading Levels...</div>
        )}
      </main>

    </div>
  )
}

export default App