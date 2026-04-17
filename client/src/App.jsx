import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Problems from './pages/Problems';
import Workspace from './pages/Workspace';
import Login from './pages/Login';
import Register from './pages/Register';
import { Code, User, Bell, Settings, LogOut } from 'lucide-react';

function AppContent() {
  const location = useLocation();
  const isWorkspace = location.pathname.startsWith('/problem/');

  return (
    <div className={`app-layout ${isWorkspace ? 'workspace-mode' : ''}`}>
      {!isWorkspace && <Sidebar />}
      <div className="main-content">
        <Navbar />
        <div className="page-container">
          <Routes>
            <Route path="/" element={<Problems />} />
            <Route path="/problems" element={<Problems />} />
            <Route path="/problem/:id" element={<Workspace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
