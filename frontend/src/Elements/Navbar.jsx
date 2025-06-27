import React, { useState, useEffect } from 'react';
import dsr from '../assets/img/logo1.png';
import { NavLink } from 'react-router-dom';
import '../assets/css/Navbar.css';

function Navbar() {
  const [darkMode, setDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100); // shrink if scrolled more than 10px
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar navbar-expand-lg custom-navbar ${darkMode ? 'dark-navbar' : ''} ${isScrolled ? 'shrink' : ''}`}>
      <div className="container-fluid d-flex justify-content-between align-items-center px-4">
        <NavLink
          to="/"
          className={({ isActive }) => `nav-link fs-5 ${isActive ? 'active' : ''} navbar-brand d-flex align-items-center`}
        >
          <img src={dsr} alt="Logo" className="logo-img" />
        </NavLink>

        {/* Toggler */}
        <button
          className="navbar-toggler homenav"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 gap-lg-4 text-center text-lg-start">
            <li className="nav-item">
              <NavLink to="/" className={({ isActive }) => `nav-link fs-5 ${isActive ? 'active' : ''}`}>Home</NavLink>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle fs-5" href="#" role="button" data-bs-toggle="dropdown">Register</a>
              <ul className="dropdown-menu">
                <li><NavLink to="/EnpRegistration" className={({ isActive }) => `nav-link fs-5 ${isActive ? 'active' : ''}`}>Entrepreneur Register</NavLink></li>
                <li><NavLink to="/InvestorRegistration" className={({ isActive }) => `nav-link fs-5 ${isActive ? 'active' : ''}`}>Investor Register</NavLink></li>
              </ul>
            </li>
            <li className="nav-item"><NavLink to="/Login" className={({ isActive }) => `nav-link fs-5 ${isActive ? 'active' : ''}`}>Login</NavLink></li>
            {/* <li className="nav-item"><NavLink to="" className={({ isActive }) => `nav-link fs-5 ${isActive ? 'active' : ''}`}>Feedbacks</NavLink></li> */}
            <li className="nav-item">
              <a href="#feedback-section" className="nav-link fs-5">Feedbacks</a>
            </li>
            <li className="nav-item"><NavLink to="/about" className={({ isActive }) => `nav-link fs-5 ${isActive ? 'active' : ''}`}>About Us</NavLink></li>
            <li className="nav-item">
              <button onClick={toggleDarkMode} className="btn btn-sm btn-outline-secondary ms-lg-3">
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
