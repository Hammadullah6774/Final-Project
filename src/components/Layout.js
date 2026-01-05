import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const userRole = localStorage.getItem('userRole'); // 'alumni' or 'student'
    const userName = localStorage.getItem('userName');

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <div className="d-flex flex-column min-vh-100 bg-light">
            {/* --- NAVBAR SECTION --- */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm py-3">
                <div className="container">
                    <Link className="navbar-brand fw-bold fs-3" to="/dashboard">
                        <i className="fas fa-user-graduate me-2"></i>SkillConnect
                    </Link>
                    
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto align-items-center">
                            <li className="nav-item">
                                <Link className={`nav-link px-3 ${location.pathname === '/dashboard' ? 'active fw-bold' : ''}`} to="/dashboard">Dashboard</Link>
                            </li>
                            <li className="nav-item">
                                <Link className={`nav-link px-3 ${location.pathname === '/profile' ? 'active fw-bold' : ''}`} to="/profile">Profile</Link>
                            </li>
                            
                            {/* DYNAMIC SESSIONS LINK: Alumni go to MySessions, Students go to Sessions */}
                            <li className="nav-item">
                                <Link 
                                    className={`nav-link px-3 ${(location.pathname === '/sessions' || location.pathname === '/my-sessions') ? 'active fw-bold' : ''}`} 
                                    to={userRole === 'alumni' ? "/my-sessions" : "/sessions"}
                                >
                                    Sessions
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link className={`nav-link px-3 ${location.pathname === '/chat' ? 'active fw-bold' : ''}`} to="/chat">Chat</Link>
                            </li>
                            <li className="nav-item">
                                <Link className={`nav-link px-3 ${location.pathname === '/feedback' ? 'active fw-bold' : ''}`} to="/feedback">Feedback</Link>
                            </li>
                            
                            <li className="nav-item ms-lg-3">
                                <div className="d-flex align-items-center bg-white rounded-pill px-3 py-1 shadow-sm">
                                    <span className="text-primary fw-bold me-3 small">
                                        {userName ? `Hi, ${userName}` : 'User'}
                                    </span>
                                    <button 
                                        className="btn btn-sm btn-primary rounded-pill px-3 fw-bold" 
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </button>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* --- MAIN CONTENT SECTION --- */}
            <main className="flex-grow-1">
                {children}
            </main>

            {/* --- FOOTER SECTION --- */}
            <footer className="bg-white py-4 mt-auto border-top">
                <div className="container text-center">
                    <p className="text-muted mb-0 fw-bold">SkillConnect - Alumni Mentorship Platform</p>
                    <small className="text-secondary opacity-50">Copyrights 2026. Developed by Hammad & Saif.</small>
                </div>
            </footer>
        </div>
    );
};

export default Layout;