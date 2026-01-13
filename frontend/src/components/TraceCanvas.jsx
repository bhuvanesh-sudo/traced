import React, { useRef, useEffect, useState } from 'react';
import './TraceCanvas.css';
// GAME MODE CONFIGURATION
const DIFFICULTY_SETTINGS = {
  easy: { 
    label: "Easy",
    extraWidth: 20,
    penaltyPerFrame: 0.05,
    color: '#4caf50' 
  },
  medium: { 
    label: "Medium", 
    extraWidth: 5,
    penaltyPerFrame: 0.2,
    color: '#ff9800' 
  },
  hard: { 
    label: "Hard", 
    extraWidth: -10,
    penaltyPerFrame: 2.0,
    color: '#f44336' 
  }
};

const TraceCanvas = ({ shape, difficulty = 'medium', userId, onScoreUpdate }) => {
  const canvasRef = useRef(null);
  
  // STATE
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isLevelComplete, setIsLevelComplete] = useState(false); // New state for button visibility
  
  // SCORING
  const [highestProgress, setHighestProgress] = useState(0);
  const [penaltyScore, setPenaltyScore] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  
  const [message, setMessage] = useState("Start at the Green Circle");
  const [showDebug, setShowDebug] = useState(false); 

  // CONFIGURATION
  const currentMode = DIFFICULTY_SETTINGS[difficulty];
  const CANVAS_SIZE = 600; 
  const SCALE_FACTOR = 6;  
  
  // VISUALS
  const VISUAL_WIDTH = 30; 
  const HITBOX_WIDTH = Math.max(5, VISUAL_WIDTH + currentMode.extraWidth);
  const BRUSH_SIZE = 10;

  const pathPointsRef = useRef([]); 
  const [scaledPath, setScaledPath] = useState(null);
  
  // GUIDE STATE
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);

  // --- ACTIONS ---

  const handleHotReset = () => {
    // 1. Reset Game State
    setHighestProgress(0);
    setPenaltyScore(0);
    setFinalScore(0);
    setIsDrawing(false);
    setHasSubmitted(false);
    setIsLevelComplete(false); // Hide the button
    setMessage("Start at the Green Circle");

    // 2. Force Redraw
    const canvas = canvasRef.current;
    if(canvas && scaledPath) {
        const ctx = canvas.getContext('2d');
        drawScene(ctx, scaledPath);
    }
  };

  const handleManualSubmit = async () => {
    if (!userId) {
        alert("Please log in to save your XP!");
        return;
    }

    setHasSubmitted(true);
    setMessage("⏳ Saving..."); // Changed icon to hourglass

    try {
      console.log("📤 Sending Score:", { userId, shapeId: shape._id, finalScore });

      const res = await fetch('http://localhost:5000/api/game/attempt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          shapeId: shape._id,
          isSuccess: true,
          accuracyScore: finalScore
        })
      });

      const data = await res.json();
      console.log("📥 Server Response:", data);

      if (!res.ok) {
        throw new Error(data.message || "Server Error");
      }

      // SUCCESS CASE
      if (data.newXP !== undefined) {
        setMessage(`✅ Saved! Total XP: ${data.newXP}`);
        if (onScoreUpdate) onScoreUpdate(data.newXP); 
      } else {
        setMessage("✅ Saved (No XP Change)");
      }

    } catch (err) {
      console.error("❌ SAVE FAILED:", err);
      setMessage("⚠️ Error: " + err.message); // Show actual error on screen
      setHasSubmitted(false); // Enable the button again so you can retry
    }
  };

  // --- EFFECTS ---

  // SCORE CALCULATION & COMPLETION CHECK
  useEffect(() => {
    const calculated = Math.max(0, Math.floor(highestProgress) - Math.floor(penaltyScore));
    setFinalScore(calculated);
    
    // Logic: If > 98% progress, show completion state
    if(highestProgress >= 98) {
      setIsLevelComplete(true);
      if (!hasSubmitted) setMessage("🎉 Complete! Click 'Save XP' below.");
    }
  }, [highestProgress, penaltyScore, hasSubmitted]);

  // PATH SETUP
  useEffect(() => {
    if(!shape) return;

    const rawPath = new Path2D(shape.svgPath);
    const bakedPath = new Path2D();
    const matrix = new DOMMatrix().scale(SCALE_FACTOR);
    bakedPath.addPath(rawPath, matrix);
    setScaledPath(bakedPath);
    
    // Generate Search Points & Guides
    const tempSvgPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    tempSvgPath.setAttribute("d", shape.svgPath);
    const totalLen = tempSvgPath.getTotalLength();
    
    const points = [];
    for(let i=0; i <= totalLen; i += 0.5) { 
        const pt = tempSvgPath.getPointAtLength(i);
        points.push({
            x: pt.x * SCALE_FACTOR,
            y: pt.y * SCALE_FACTOR,
            progress: (i / totalLen) * 100 
        });
    }
    pathPointsRef.current = points;

    if (points.length > 0) {
        setStartPoint(points[0]);
        setEndPoint(points[points.length - 1]);
    }

    // Reset on shape change
    handleHotReset();
  }, [shape, difficulty]);

  // RENDER LOOP
  useEffect(() => {
    const canvas = canvasRef.current;
    if(canvas && scaledPath) {
        canvas.width = CANVAS_SIZE;
        canvas.height = CANVAS_SIZE;
        const ctx = canvas.getContext('2d');
        drawScene(ctx, scaledPath);
    }
  }, [scaledPath, showDebug, difficulty, startPoint, endPoint]);

  // --- DRAWING LOGIC ---

  const drawScene = (ctx, path) => {
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // 1. Debug Hitbox
    if (showDebug) {
        ctx.lineWidth = HITBOX_WIDTH;
        ctx.strokeStyle = 'rgba(33, 150, 243, 0.2)'; 
        ctx.stroke(path);
    }

    // 2. Visual Guide
    ctx.lineWidth = VISUAL_WIDTH; 
    ctx.strokeStyle = '#374151'; 
    ctx.stroke(path);
    
    // 3. Center Guide
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#fbbf24';
    ctx.stroke(path);

    // 4. DRAW GUIDES
    drawGuides(ctx);
  };

  const drawGuides = (ctx) => {
      // A. ARROWS
      const points = pathPointsRef.current;
      if(points.length > 0) {
          const arrowIndices = [
              Math.floor(points.length * 0.25), 
              Math.floor(points.length * 0.50), 
              Math.floor(points.length * 0.75)
          ];

          ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
          
          arrowIndices.forEach(idx => {
              const p = points[idx];
              const nextP = points[Math.min(idx + 5, points.length - 1)];
              
              if(p && nextP) {
                  const angle = Math.atan2(nextP.y - p.y, nextP.x - p.x);
                  ctx.save();
                  ctx.translate(p.x, p.y);
                  ctx.rotate(angle);
                  ctx.beginPath();
                  ctx.moveTo(0, 0);
                  ctx.lineTo(-10, -5);
                  ctx.lineTo(-10, 5);
                  ctx.fill();
                  ctx.restore();
              }
          });
      }

      // B. START POINT
      if (startPoint) {
          ctx.beginPath();
          ctx.arc(startPoint.x, startPoint.y, 12, 0, 2 * Math.PI);
          ctx.fillStyle = '#22c55e';
          ctx.fill();
          ctx.lineWidth = 3;
          ctx.strokeStyle = '#ffffff';
          ctx.stroke();
          
          ctx.fillStyle = 'white';
          ctx.font = 'bold 12px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText("S", startPoint.x, startPoint.y);
      }

      // C. END POINT
      if (endPoint) {
          ctx.beginPath();
          ctx.arc(endPoint.x, endPoint.y, 12, 0, 2 * Math.PI);
          ctx.fillStyle = '#ef4444';
          ctx.fill();
          ctx.lineWidth = 3;
          ctx.strokeStyle = '#ffffff';
          ctx.stroke();

           ctx.fillStyle = 'white';
           ctx.font = 'bold 12px Arial';
           ctx.textAlign = 'center';
           ctx.textBaseline = 'middle';
           ctx.fillText("E", endPoint.x, endPoint.y);
      }
  };

  const getMousePos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    let clientX = e.touches ? e.touches[0].clientX : e.clientX;
    let clientY = e.touches ? e.touches[0].clientY : e.clientY;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const findBestProgress = (x, y, currentHigh) => {
      const points = pathPointsRef.current;
      const searchLimit = Math.min(100, currentHigh + 15);
      
      let closestDist = Infinity;
      let bestProgress = currentHigh;
      
      const totalPoints = points.length;
      const startIndex = Math.floor((currentHigh / 100) * totalPoints);
      const searchStart = Math.max(0, startIndex - 500); 
      
      for(let i = searchStart; i < totalPoints; i++) {
          const p = points[i];
          if (p.progress > searchLimit) break;

          const dx = x - p.x;
          const dy = y - p.y;
          const dist = (dx*dx) + (dy*dy); 
          
          if(dist < closestDist) {
              closestDist = dist;
              bestProgress = p.progress;
          }
      }
      return bestProgress;
  };

  const draw = (e) => {
    if (!isDrawing || !scaledPath) return;
    if(e.type === 'touchmove') e.preventDefault();

    const { x, y } = getMousePos(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.lineWidth = HITBOX_WIDTH; 
    const isInside = ctx.isPointInStroke(scaledPath, x, y);

    ctx.beginPath();
    ctx.arc(x, y, BRUSH_SIZE, 0, 2 * Math.PI);
    
    if (isInside) {
      ctx.fillStyle = '#10b981'; // Emerald
      let newProgress = findBestProgress(x, y, highestProgress);
      
      if (highestProgress === 0 && newProgress > 10) {
          setMessage("⚠️ Start at the Green Circle!");
          return;
      }

      if (newProgress >= 96) newProgress = 100;
      if (newProgress > highestProgress) setHighestProgress(newProgress);
    } else {
      ctx.fillStyle = '#ef4444'; // Red
      setPenaltyScore(prev => prev + currentMode.penaltyPerFrame);
      setMessage("Off Track!");
    }
    ctx.fill();
  };

  return (
    <div className="flex flex-col items-center">
      
      {/* 1. Header Controls (Debug, Reset) */}
      <div className="flex justify-between w-full max-w-[400px] mb-2 text-sm text-gray-400">
        <label className="flex items-center cursor-pointer hover:text-white">
          <input type="checkbox" className="mr-2" checked={showDebug} onChange={(e) => setShowDebug(e.target.checked)} /> 
          Debug
        </label>
        <span style={{color: currentMode.color}}>{currentMode.label} Mode</span>
        <button 
            onClick={handleHotReset}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-1 rounded text-sm font-bold flex items-center gap-2 transition"
        >
            <span>↺</span> Reset
        </button>
      </div>

      {/* 2. HUD Message */}
      <div className="mb-4">
        <span className={`hud-message ${
             message.includes("⚠️") || message.includes("Off") ? "msg-error" : 
             isLevelComplete ? "msg-success" : "msg-default"
        }`}>
            {message}
        </span>
      </div>

      {/* 3. CANVAS WRAPPER (Now uses standard CSS class) */}
      <div className="canvas-container">
        <canvas
            ref={canvasRef}
            style={{ width: '600px', height: '600px', cursor: 'crosshair', touchAction: 'none' }}
            onMouseDown={() => setIsDrawing(true)}
            onMouseUp={() => setIsDrawing(false)}
            onMouseLeave={() => setIsDrawing(false)}
            onMouseMove={draw}
            onTouchStart={() => setIsDrawing(true)}
            onTouchEnd={() => setIsDrawing(false)}
            onTouchMove={draw}
        />
        
        {/* --- 4. SUBMIT OVERLAY (Standard CSS Class) --- */}
        {isLevelComplete && !hasSubmitted && (
            <div className="submit-overlay">
                <button 
                    onClick={handleManualSubmit}
                    className="save-btn"
                >
                    💾 Save & Claim XP
                </button>
            </div>
        )}

        {/* 5. Progress Bar */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '8px', background: '#1f2937' }}>
            <div style={{ width: `${highestProgress}%`, height: '100%', background: '#10b981', position: 'absolute', left: 0, transition: 'width 0.1s' }} />
            <div style={{ width: `${Math.min(100, penaltyScore)}%`, height: '100%', background: 'rgba(239, 68, 68, 0.5)', position: 'absolute', right: 0 }} />
        </div>
      </div>
      
      {/* 6. Score Display */}
      <div className="mt-6 text-center">
        <div className="text-5xl font-bold text-white mb-1">{finalScore}</div>
        <div className="text-xs text-gray-500 uppercase tracking-widest">Score</div>
      </div>

    </div>
  );
};

export default TraceCanvas;