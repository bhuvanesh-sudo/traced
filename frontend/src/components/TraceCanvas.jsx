import React, { useRef, useEffect, useState } from 'react';

// GAME MODE CONFIGURATION
const DIFFICULTY_SETTINGS = {
  easy: { 
    label: "Easy",
    extraWidth: 30,  // Very forgiving (30px buffer)
    penaltyPerFrame: 0.05, // Lose points slowly
    color: '#4caf50' 
  },
  medium: { 
    label: "Medium", 
    extraWidth: 15,  // Standard buffer
    penaltyPerFrame: 0.2, // Lose points normally
    color: '#ff9800' 
  },
  hard: { 
    label: "Hard", 
    extraWidth: 0,   // No buffer (Exact precision)
    penaltyPerFrame: 1.0, // Lose 1 full point per frame (Punishing)
    color: '#f44336' 
  }
};

const TraceCanvas = ({ shape, difficulty = 'medium', onComplete }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  
  // SCORING STATE
  const [score, setScore] = useState(0);
  const [penaltyScore, setPenaltyScore] = useState(0); // Track errors separately
  const [finalScore, setFinalScore] = useState(0);
  
  const [message, setMessage] = useState("Trace the Gray Line!");
  const [coveredPoints, setCoveredPoints] = useState(new Set());
  const [showDebug, setShowDebug] = useState(false); 

  // SETTINGS FROM DIFFICULTY
  const currentMode = DIFFICULTY_SETTINGS[difficulty];
  
  // CONSTANTS
  const CANVAS_SIZE = 400; 
  const SCALE_FACTOR = 4;  
  const VISUAL_WIDTH = 40; 
  const HITBOX_WIDTH = VISUAL_WIDTH + currentMode.extraWidth; // Dynamic Width
  const BRUSH_SIZE = 12;

  const [scaledPath, setScaledPath] = useState(null);

  // 1. CALCULATE SCORE (Coverage - Penalty)
  useEffect(() => {
    // Math.max(0, ...) ensures score never goes below 0
    const calculated = Math.max(0, score - Math.floor(penaltyScore));
    setFinalScore(calculated);
  }, [score, penaltyScore]);

  // 2. SETUP PATH & RESET ON CHANGE
  useEffect(() => {
    if(!shape) return;

    const rawPath = new Path2D(shape.svgPath);
    const bakedPath = new Path2D();
    const matrix = new DOMMatrix().scale(SCALE_FACTOR);
    bakedPath.addPath(rawPath, matrix);
    
    setScaledPath(bakedPath);
    
    // Reset Game State
    setScore(0);
    setPenaltyScore(0);
    setCoveredPoints(new Set());
    setMessage(`Mode: ${currentMode.label} - Start Tracing!`);

  }, [shape, difficulty]); // Re-run if difficulty changes

  // 3. DRAW SCENE
  useEffect(() => {
    const canvas = canvasRef.current;
    if(canvas && scaledPath) {
        canvas.width = CANVAS_SIZE;
        canvas.height = CANVAS_SIZE;
        const ctx = canvas.getContext('2d');
        drawScene(ctx, scaledPath);
    }
  }, [scaledPath, showDebug, difficulty]);

  const drawScene = (ctx, path) => {
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Draw Debug Hitbox (Shows the difficulty margin)
    if (showDebug) {
        ctx.lineWidth = HITBOX_WIDTH;
        ctx.strokeStyle = 'rgba(33, 150, 243, 0.2)'; 
        ctx.stroke(path);
    }

    // Draw Visual Target
    ctx.lineWidth = VISUAL_WIDTH; 
    ctx.strokeStyle = '#e0e0e0';
    ctx.stroke(path);
    
    // Draw Center Helper
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#ffeb3b';
    ctx.stroke(path);
  };

  const getMousePos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX, clientY;
    if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const draw = (e) => {
    if (!isDrawing || !scaledPath) return;
    if(e.type === 'touchmove') e.preventDefault();

    const { x, y } = getMousePos(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // COLLISION CHECK
    // Use the dynamic HITBOX_WIDTH determined by difficulty
    ctx.lineWidth = HITBOX_WIDTH; 
    const isInside = ctx.isPointInStroke(scaledPath, x, y);

    ctx.beginPath();
    ctx.arc(x, y, BRUSH_SIZE, 0, 2 * Math.PI);
    
    if (isInside) {
      // --- SUCCESS LOGIC ---
      ctx.fillStyle = 'rgba(76, 175, 80, 1.0)'; // Green
      
      const gridKey = `${Math.floor(x/15)},${Math.floor(y/15)}`;
      setCoveredPoints(prev => {
          const newSet = new Set(prev);
          if(!newSet.has(gridKey)) {
             newSet.add(gridKey);
             // Cap max raw score at 100 (before penalties)
             setScore(Math.min(100, newSet.size * 2)); 
             return newSet;
          }
          return prev;
      });

    } else {
      // --- PENALTY LOGIC ---
      ctx.fillStyle = 'rgba(255, 82, 82, 1.0)'; // Red
      
      // Increase penalty score based on difficulty multiplier
      setPenaltyScore(prev => prev + currentMode.penaltyPerFrame);
      
      setMessage("Off Track! -" + currentMode.penaltyPerFrame);
    }
    
    ctx.fill();
  };

  return (
    <div style={{ textAlign: 'center', touchAction: 'none' }}>
      
      <div style={{ marginBottom: '10px' }}>
          <label style={{ marginRight: '15px' }}>
              <input type="checkbox" checked={showDebug} onChange={(e) => setShowDebug(e.target.checked)} /> 
              Show Hitbox
          </label>
          <span style={{color: currentMode.color, fontWeight: 'bold'}}>
             Mode: {currentMode.label} (Margin: +{currentMode.extraWidth}px)
          </span>
      </div>

      <div style={{ position: 'relative', display: 'inline-block' }}>
        <canvas
            ref={canvasRef}
            style={{ 
                width: '400px', 
                height: '400px',
                border: `2px solid ${currentMode.color}`, 
                borderRadius: '10px', 
                cursor: 'crosshair',
                touchAction: 'none'
            }}
            onMouseDown={() => setIsDrawing(true)}
            onMouseUp={() => setIsDrawing(false)}
            onMouseLeave={() => setIsDrawing(false)}
            onMouseMove={draw}
            onTouchStart={() => setIsDrawing(true)}
            onTouchEnd={() => setIsDrawing(false)}
            onTouchMove={draw}
        />
        
        {/* Score Bar with visual "Penalty" indication */}
        <div style={{ height: '20px', width: '100%', background: '#333', marginTop: '10px', borderRadius: '6px', overflow: 'hidden', position: 'relative' }}>
            {/* The Green Bar (Base Score) */}
            <div style={{ 
                position: 'absolute',
                height: '100%', 
                width: `${score}%`, 
                background: '#4caf50',
                transition: 'width 0.1s linear'
            }} />
            
            {/* The Red Overlay (Penalty) - Shows how much was lost */}
            <div style={{ 
                position: 'absolute',
                right: 0,
                height: '100%', 
                width: `${Math.min(100, penaltyScore)}%`, 
                background: 'rgba(255,0,0,0.5)',
                transition: 'width 0.1s linear'
            }} />
        </div>
      </div>
      
      <h3>Final Score: {finalScore} / 100</h3>
      <small>Raw Score: {score} | Penalties: -{Math.floor(penaltyScore)}</small>
    </div>
  );
};

export default TraceCanvas;