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
  const { user } = useAuth();

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
                    <div className={`status-radio ${isSolved ? 'checked' : ''}`}>
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
              <div className="stat-item">
                <div className="stat-header">
                  <span>Easy</span>
                  <span>12/15</span>
                </div>
                <div className="progress-bar"><div className="bar easy" style={{width: '80%'}}></div></div>
              </div>
              <div className="stat-item">
                <div className="stat-header">
                  <span>Medium</span>
                  <span>4/20</span>
                </div>
                <div className="progress-bar"><div className="bar medium" style={{width: '20%'}}></div></div>
              </div>
              <div className="stat-item">
                <div className="stat-header">
                  <span>Hard</span>
                  <span>1/10</span>
                </div>
                <div className="progress-bar"><div className="bar hard" style={{width: '10%'}}></div></div>
              </div>
            </div>
          </div>

          <div className="challenge-card glass">
            <div className="challenge-tag">PREMIUM WEEKLY</div>
            <h4>30 Days of JavaScript</h4>
            <p>Master JavaScript basics with our curated challenge.</p>
            <button className="challenge-btn" onClick={() => alert('Redirecting to JavaScript challenge...')}>Start Now</button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Problems;
