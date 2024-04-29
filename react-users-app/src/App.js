import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Users from './Users';
import './App.css'; // Ensure you have an App.css for additional custom styles

function App() {
  return (
      <Router>
        <div>
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
              <Link className="navbar-brand" to="/">MyApp</Link>
              <div className="collapse navbar-collapse">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                    <Link className="nav-link" to="/users">Users</Link>
                  </li>
                </ul>
              </div>
            </div>
          </nav>

          <div className="container mt-4">
            <Routes>
              <Route path="/users" element={<Users />} />
              <Route path="/" element={<Home />} />
            </Routes>
          </div>
        </div>
      </Router>
  );
}

function Home() {
  return <h2>Home Page</h2>;
}

export default App;