import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'
interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();  // Use useNavigate instead of useHistory

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const validEmail = 'shrihari@gmail.com'; // Specified user ID
    const validPassword = 'Shrihari@198'; // Specified password

    if (email === validEmail && password === validPassword) {
      // Call onLogin from props to indicate successful login
      onLogin();
      navigate('/dashboard');  // Use navigate to redirect to the dashboard
    } else {
      setErrorMessage('Invalid credentials, please try again.');
    }
  };

  return (
    <div className="login-container">
      <section className="full-height">
        <div className="form-wrapper">
          <div className="form-card">
            <div className="form-body">
              <h1 className="form-title">Login to Admin Panel</h1>
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label htmlFor="email">E-Mail Address</label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <div className="error-message">
                    {errorMessage && <span>{errorMessage}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <div className="error-message">
                    {errorMessage && <span>{errorMessage}</span>}
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="submit-button">
                    Continue to Login
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
