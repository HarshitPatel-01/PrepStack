import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Problems from './pages/Problems';
import Workspace from './pages/Workspace';
import Login from './pages/Login';
import Register from './pages/Register';
import { Code, User, Bell, Settings, LogOut } from 'lucide-react';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-layout">
          <Sidebar />
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
      </Router>
    </AuthProvider>
  );
}

export default App;
