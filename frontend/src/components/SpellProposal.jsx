import React, { useState } from 'react';
import './SpellProposal.css'; // We will create this next

const SpellProposal = ({ onCancel }) => {
  const [formData, setFormData] = useState({
    spellName: '',
    difficulty: 'medium',
    lore: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="proposal-success">
        <h2 className="success-title">Proposal Sent!</h2>
        <p className="success-desc">The High Council will review your sigil.</p>
        <button onClick={onCancel} className="btn-cancel">Return to Grimoire</button>
      </div>
    );
  }

  return (
    <div className="proposal-container">
      <div className="proposal-card">
        <h2 className="proposal-title">📜 Propose New Sigil</h2>

        <form onSubmit={handleSubmit} className="proposal-form">
          {/* Spell Name */}
          <div className="form-group">
            <label>Spell Name</label>
            <input
              type="text"
              name="spellName"
              value={formData.spellName}
              onChange={handleChange}
              required
              placeholder="e.g. The Chrono-Loop"
              className="proposal-input"
            />
          </div>

          {/* Difficulty */}
          <div className="form-group">
            <label>Estimated Difficulty</label>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="proposal-select"
            >
              <option value="easy">Novice (Easy)</option>
              <option value="medium">Apprentice (Medium)</option>
              <option value="hard">Archmage (Hard)</option>
            </select>
          </div>

          {/* Lore */}
          <div className="form-group">
            <label>Magical Effect (Lore)</label>
            <textarea
              name="lore"
              value={formData.lore}
              onChange={handleChange}
              required
              rows="4"
              placeholder="What does this spell do when cast?"
              className="proposal-textarea"
            />
          </div>

          {/* Buttons */}
          <div className="button-group">
            <button type="button" onClick={onCancel} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              Submit Proposal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SpellProposal;