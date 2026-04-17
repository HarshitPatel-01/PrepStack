import React from 'react';
import { Home, Zap, Target, BookOpen } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar glass">
      <div className="sidebar-logo">
        <div className="logo-box">F</div>
      </div>
      <div className="sidebar-links">
        <button className="sidebar-btn active"><Home size={22} /> <span>Home</span></button>
      </div>
      <div className="sidebar-footer">
        <button className="sidebar-btn"><BookOpen size={22} /></button>
      </div>
    </aside>
  );
};

export default Sidebar;
