import { useEffect, useState } from 'react'
import { getShapes } from './services/api'
import TraceCanvas from './components/TraceCanvas'
import './App.css'

function App() {
  const [shapes, setShapes] = useState([]);
  const [currentShape, setCurrentShape] = useState(null);
  const [difficulty, setDifficulty] = useState('medium'); 

  // 1. Fetch Levels on Load
  useEffect(() => {
    getShapes().then(data => {
      setShapes(data);
    });
  }, []);

  return (
    <div className="container">
      <h1>Traced: Motor Skills RPG</h1>
      
      {/* If playing, show Game. If not, show Menu */}
      {currentShape ? (
        <div>
          <button onClick={() => setCurrentShape(null)}>Back to Map</button>
          <div style={{ margin: '10px 0' }}>
          <label>Difficulty: </label>
          <select 
            value={difficulty} 
            onChange={(e) => setDifficulty(e.target.value)}
            style={{ padding: '5px', fontSize: '16px' }}
          >
            <option value="easy">Easy (Wide, Low Penalty)</option>
            <option value="medium">Medium (Normal)</option>
            <option value="hard">Hard (Strict, High Penalty)</option>
          </select>
          </div>
          <TraceCanvas shape={currentShape} difficulty={difficulty}/>
        </div>
      ) : (
        <div className="level-grid">
          <h2>Select a Level</h2>
          {shapes.map(shape => (
            <button 
              key={shape._id} 
              onClick={() => setCurrentShape(shape)}
              style={{ margin: '10px', padding: '20px', fontSize: '18px' }}
            >
              {shape.name} <br/>
              <small>Diff: {shape.difficulty}</small>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default App