import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import { AuthProvider } from './context/AuthContext';
import RequireAuth from './components/RequireAuth';

function App() {
  return (
    <AuthProvider>
      <div className="bg-gray-900 min-h-screen text-white">
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<RequireAuth><Dashboard /></RequireAuth>} />
          </Routes>
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;
