import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, Filter, CheckCircle, ChevronRight } from 'lucide-react';
import './Problems.css';

const Problems = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [tagFilter, setTagFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const { user, refreshUser } = useAuth();

  const handleToggleStatus = async (e, problemId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return alert("Please log in to track progress");
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/auth/toggle-problem`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ problemId })
      });
      if (response.ok) {
        refreshUser();
      }
    } catch (err) {
      console.error("Failed to toggle problem status:", err);
    }
  };

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/problems');
        const data = await response.json();
        setProblems(data);
      } catch (err) {
        console.error('Error fetching problems:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  const filteredProblems = (problems || []).filter(p => {
    if (!p) return false;
    const matchesSearch = (p.title || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'All' || p.difficulty === difficultyFilter;
    const matchesTag = tagFilter === 'All' || p.category === tagFilter;
    
    const isSolved = Array.isArray(user?.solvedProblems) && user.solvedProblems.includes(p._id);
    const matchesStatus = statusFilter === 'All' || 
                         (statusFilter === 'Solved' && isSolved) || 
                         (statusFilter === 'Todo' && !isSolved);

    return matchesSearch && matchesDifficulty && matchesTag && matchesStatus;
  });

  const categories = ['All', ...new Set(problems.map(p => p.category))];

  return (
    <div className="problems-page">
      <div className="problems-header">
        <h1 className="gradient-text">Problem Set</h1>
        <p className="subtitle">Master your coding skills with {problems.length} challenges.</p>
      </div>

      <div className="content-grid">
        <div className="problems-main">
          <div className="filters-bar glass">
            <div className="search-box">
              <Search size={18} className="search-icon" />
              <input 
                type="text" 
                placeholder="Search questions..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="filter-dropdowns">
              <select 
                className="filter-select"
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
              >
                <option value="All">Difficulty</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>

              <select 
                className="filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">Status</option>
                <option value="Solved">Solved</option>
                <option value="Todo">Todo</option>
              </select>

              <select 
                className="filter-select"
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
              >
                <option value="All">Tags</option>
                {categories.filter(c => c !== 'All').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="problems-list glass">
            <div className="list-header">
              <span className="col-status">Status</span>
              <span className="col-title">Title</span>
              <span className="col-difficulty">Difficulty</span>
            </div>
            {filteredProblems.length > 0 ? filteredProblems.map(p => {
              const isSolved = user?.solvedProblems?.includes(p._id);
              return (
                <Link to={`/problem/${p._id}`} key={p._id} className="problem-row">
                  <span className="col-status">
                    <div 
                      className={`status-radio ${isSolved ? 'checked' : ''}`}
                      onClick={(e) => handleToggleStatus(e, p._id)}
                    >
                      {isSolved && <div className="radio-inner" />}
                    </div>
                  </span>
                  <span className="col-title">{p.order}. {p.title}</span>
                  <span className={`col-difficulty ${p.difficulty.toLowerCase()}`}>{p.difficulty}</span>
                </Link>
              );
            }) : (
              <div className="no-problem-row">No problems found matching your filters.</div>
            )}
          </div>
        </div>

        <aside className="problems-sidebar">
          <div className="progress-card glass">
            <h3>Progress</h3>
            <div className="progress-stats">
              {['Easy', 'Medium', 'Hard'].map(diff => {
                const total = problems.filter(p => p.difficulty === diff).length;
                const solved = problems.filter(p => p.difficulty === diff && user?.solvedProblems?.includes(p._id)).length;
                const percent = total === 0 ? 0 : Math.round((solved / total) * 100);
                
                return (
                  <div className="stat-item" key={diff}>
                    <div className="stat-header">
                      <span>{diff}</span>
                      <span>{solved}/{total}</span>
                    </div>
                    <div className="progress-bar">
                      <div className={`bar ${diff.toLowerCase()}`} style={{width: `${percent}%`}}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Problems;
