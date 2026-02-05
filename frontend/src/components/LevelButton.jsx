import React from 'react';

const LevelButton = ({ shape, index, isActive, onClick }) => {
  return (
    <button 
      className={`level-btn ${isActive ? 'active' : ''}`}
      onClick={onClick}
    >
      <span className="level-num">{index + 1}</span>
      <span className="level-name truncate">{shape.name}</span>
    </button>
  );
};

export default LevelButton;