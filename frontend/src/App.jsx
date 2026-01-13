import { useEffect, useState } from 'react'
import { getShapes } from './services/api'
import TraceCanvas from './components/TraceCanvas'
import './App.css'

function App() {
  const [shapes, setShapes] = useState([]);
  const [currentShape, setCurrentShape] = useState(null);

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
          <TraceCanvas shape={currentShape} />
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