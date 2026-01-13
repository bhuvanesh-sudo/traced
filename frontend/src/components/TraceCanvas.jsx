import React, { useRef, useEffect, useState } from 'react';

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

const TraceCanvas = ({ shape, difficulty = 'medium' }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  
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
  
  // GUIDE STATE (Start/End coordinates)
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);

  // SCORE CALCULATION
  useEffect(() => {
    const calculated = Math.max(0, Math.floor(highestProgress) - Math.floor(penaltyScore));
    setFinalScore(calculated);
    if(highestProgress === 100 && !isDrawing) setMessage("🎉 Perfect! Select next level.");
  }, [highestProgress, penaltyScore, isDrawing]);

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
    for(let i=0; i <= totalLen; i += 0.5) { // Resolution 0.5 for smoother arrows
        const pt = tempSvgPath.getPointAtLength(i);
        points.push({
            x: pt.x * SCALE_FACTOR,
            y: pt.y * SCALE_FACTOR,
            progress: (i / totalLen) * 100 
        });
    }
    pathPointsRef.current = points;

    // Set Start (0%) and End (100%) coordinates
    if (points.length > 0) {
        setStartPoint(points[0]);
        setEndPoint(points[points.length - 1]);
    }

    // Reset
    setHighestProgress(0);
    setPenaltyScore(0);
    setMessage(`Start at the Green Circle`);
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

    // 2. Visual Guide (Gray)
    ctx.lineWidth = VISUAL_WIDTH; 
    ctx.strokeStyle = '#374151'; 
    ctx.stroke(path);
    
    // 3. Center Guide (Yellow)
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#fbbf24';
    ctx.stroke(path);

    // 4. DRAW GUIDES (Start, End, Arrows)
    drawGuides(ctx);
  };

  const drawGuides = (ctx) => {
      // A. DIRECTION ARROWS
      // We draw arrows at 25%, 50%, and 75% marks to show flow
      const points = pathPointsRef.current;
      if(points.length > 0) {
          const arrowIndices = [
              Math.floor(points.length * 0.25), 
              Math.floor(points.length * 0.50), 
              Math.floor(points.length * 0.75)
          ];

          ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'; // Faint white arrows
          
          arrowIndices.forEach(idx => {
              const p = points[idx];
              const nextP = points[Math.min(idx + 5, points.length - 1)]; // Look ahead for angle
              
              if(p && nextP) {
                  const angle = Math.atan2(nextP.y - p.y, nextP.x - p.x);
                  
                  ctx.save();
                  ctx.translate(p.x, p.y);
                  ctx.rotate(angle);
                  
                  // Draw Triangle Arrow
                  ctx.beginPath();
                  ctx.moveTo(0, 0);
                  ctx.lineTo(-10, -5);
                  ctx.lineTo(-10, 5);
                  ctx.fill();
                  
                  ctx.restore();
              }
          });
      }

      // B. START POINT (Pulsing Green Circle)
      if (startPoint) {
          ctx.beginPath();
          ctx.arc(startPoint.x, startPoint.y, 12, 0, 2 * Math.PI);
          ctx.fillStyle = '#22c55e'; // Green
          ctx.fill();
          ctx.lineWidth = 3;
          ctx.strokeStyle = '#ffffff';
          ctx.stroke();
          
          // "S" Text
          ctx.fillStyle = 'white';
          ctx.font = 'bold 12px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText("S", startPoint.x, startPoint.y);
      }

      // C. END POINT (Red/Checkered Circle)
      if (endPoint) {
          ctx.beginPath();
          ctx.arc(endPoint.x, endPoint.y, 12, 0, 2 * Math.PI);
          ctx.fillStyle = '#ef4444'; // Red
          ctx.fill();
          ctx.lineWidth = 3;
          ctx.strokeStyle = '#ffffff';
          ctx.stroke();

           // "E" Text
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
      
      // LOGIC: Ensure user starts near the start point
      if (highestProgress === 0 && newProgress > 10) {
          setMessage("⚠️ Start at the Green Circle!");
          return; // Ignore drawing if they jumped to the middle
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
      {/* HEADER INFO */}
      <div className="flex justify-between w-full max-w-[400px] mb-2 text-sm text-gray-400">
        <label className="flex items-center cursor-pointer hover:text-white">
          <input type="checkbox" className="mr-2" checked={showDebug} onChange={(e) => setShowDebug(e.target.checked)} /> 
          Debug
        </label>
        <span style={{color: currentMode.color}}>{currentMode.label} Mode</span>
      </div>

      {/* CANVAS CONTAINER */}
      <div className="relative inline-block shadow-2xl rounded-xl overflow-hidden bg-gray-900 border border-gray-700">
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
        
        {/* INSTRUCTION OVERLAY */}
        <div className="absolute top-4 left-0 w-full text-center pointer-events-none">
            <span className={`px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm transition-colors ${
                message.includes("⚠️") || message.includes("Off") 
                ? "bg-red-500/80 text-white" 
                : "bg-black/50 text-white"
            }`}>
                {message}
            </span>
        </div>

        {/* PROGRESS BAR */}
        <div className="absolute bottom-0 left-0 w-full h-2 bg-gray-800">
            <div style={{ width: `${highestProgress}%` }} className="h-full bg-emerald-500 transition-all duration-75 absolute top-0 left-0" />
            <div style={{ width: `${Math.min(100, penaltyScore)}%` }} className="h-full bg-red-500/50 transition-all duration-75 absolute top-0 right-0" />
        </div>
      </div>
      
      {/* BIG SCORE DISPLAY */}
      <div className="mt-6 text-center">
        <div className="text-5xl font-bold text-white mb-1">{finalScore}</div>
        <div className="text-xs text-gray-500 uppercase tracking-widest">Score</div>
      </div>
    </div>
  );
};

export default TraceCanvas;