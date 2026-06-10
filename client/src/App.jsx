import { useState } from 'react';
import Login from './pages/Login';
import Panel from './pages/Panel';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleLogin = (tk) => {
    localStorage.setItem('token', tk);
    setToken(tk);
  };

  const handleLogout = () => {
localStorage.removeItem('token');
    setToken(null);
  };

  if (!token) return <Login onLogin={handleLogin} />;
  return <Panel onLogout={handleLogout} />;
}

export default App;