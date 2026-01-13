import React, { useState } from 'react';
import './Login.css'; // Import the new styles

const Login = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '', email: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Ensure this matches your backend port (usually 5000)
    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
    
    try {
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      // Handle non-JSON responses (like 404 HTML errors)
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server not responding correctly. Check Backend.");
      }

      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || data.error || 'Request failed');
      
      if (isRegister) {
        alert('Registration successful! Please login.');
        setIsRegister(false);
      } else {
        onLogin(data.user, data.token);
      }
    } catch (err) {
      console.error(err);
      setError(err.message === "Failed to fetch" ? "Cannot connect to Server. Is it running?" : err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">
          {isRegister ? 'Create Hero' : 'Hero Login'}
        </h2>
        
        {error && <div className="error-msg">{error}</div>}
        
        <form onSubmit={handleSubmit} className="login-form">
          <input 
            className="login-input"
            placeholder="Username" 
            required
            onChange={e => setFormData({...formData, username: e.target.value})} 
          />
          {isRegister && (
             <input 
               className="login-input"
               type="email"
               placeholder="Email" 
               required
               onChange={e => setFormData({...formData, email: e.target.value})} 
             />
          )}
          <input 
            className="login-input"
            type="password" 
            placeholder="Password" 
            required
            onChange={e => setFormData({...formData, password: e.target.value})} 
          />
          <button className="login-btn">
            {isRegister ? 'Register Account' : 'Enter World'}
          </button>
        </form>
        
        <p className="toggle-text">
          {isRegister ? "Already have an account?" : "New to Traced?"}
          <button onClick={() => { setIsRegister(!isRegister); setError(''); }} className="toggle-btn">
            {isRegister ? 'Login' : 'Register'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;