import { useState } from 'react';
import './Navbar.css';
import { useGlobalState } from '../../hooks/useGlobalState.jsx';

const Navbar = () => {
    const { menuOpen, setMenuOpen, isTerminalOpen, setIsTerminalOpen } = useGlobalState();

    return (
        <nav className="navbar">
            {/* 1. Brand / Logo */}
            <a href="#home" className="nav-logo">
                Mvelo<span>Khumalo</span>
            </a>

            {/* 2. Navigation Links */}
            <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
                <a href="#home" onClick={() => setMenuOpen(false)}>Home</a>
                <a href="#story" onClick={() => setMenuOpen(false)}>Story</a>
                <a href="#experience" onClick={() => setMenuOpen(false)}>Experience</a>
                <a href="#stack" onClick={() => setMenuOpen(false)}>Stack</a>
                <a href="#projects" onClick={() => setMenuOpen(false)}>Projects</a>
                <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
            </div>

            {/* 3. Action Buttons (CV + Contact) */}
            <div className="nav-actions">
                <a 
                    href="public/mvelokhumalo_cv.pdf" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="btn-cv"
                >
                    CV
                </a>
                <a className="btn-contact" onClick={() => setIsTerminalOpen(!isTerminalOpen)}>
                    Try the terminal interface
                </a>
            </div>

            {/* 4. Mobile Hamburger Toggle */}
            <button 
                className="nav-toggle" 
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle navigation"
            >
                {menuOpen ? '✕' : '☰'}
            </button>
        </nav>
    );
};

export default Navbar;