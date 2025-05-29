import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

import RequireAuth from './components/RequireAuth';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import TransactionPage from './pages/TransactionPage';
import HoldingsPage from './pages/HoldingsPage';
import StockDetail from './pages/StockDetail';

export default function App() {
  return (
    <AuthProvider>
      <div className="bg-gray-900 min-h-screen text-white">
        {/* Global toaster for success/error meldinger */}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1f2937',
              color: '#fff',
              fontSize: '14px',
            },
          }}
        />

        <Router>
          <Routes>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <RequireAuth>
                  <Dashboard />
                </RequireAuth>
              }
            />
            <Route
              path="/transactions"
              element={
                <RequireAuth>
                  <TransactionPage />
                </RequireAuth>
              }
            />
            <Route
              path="/holdings"
              element={
                <RequireAuth>
                  <HoldingsPage />
                </RequireAuth>
              }
            />
            <Route
              path="/holdings/:ticker"
              element={
                <RequireAuth>
                  <StockDetail />
                </RequireAuth>
              }
            />
          </Routes>
        </Router>
      </div>
    </AuthProvider>
  );
}
