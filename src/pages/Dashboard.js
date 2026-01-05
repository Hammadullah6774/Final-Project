import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

const Dashboard = () => {
    const navigate = useNavigate();
    const userRole = localStorage.getItem('userRole');

    return (
        <Layout>
            <div className="container py-5">
                <div className="bg-white p-5 rounded-4 shadow-sm mb-5 border-start border-primary border-5">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h1 className="text-primary fw-bold display-4">Welcome Back, {userRole === 'alumni' ? 'Alumni' : 'Student'}</h1>
                            <p className="text-muted fs-5">Your gateway to professional growth. Connect with experts and manage your sessions.</p>
                        </div>
                        <i className="fas fa-rocket fa-5x text-primary opacity-25"></i>
                    </div>
                </div>

                <div className="row g-4 justify-content-center">
                    {/* CONDITIONAL CARD: "My Sessions" for Alumni, "Book Session" for Student */}
                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm rounded-4 p-4 text-center h-100">
                            {userRole === 'alumni' ? (
                                <>
                                    <i className="fas fa-calendar-check fa-4x text-primary mb-3"></i>
                                    <h3 className="fw-bold">My Sessions</h3>
                                    <p className="text-muted">View your active bookings and session history with students.</p>
                                    <button className="btn btn-primary w-100 rounded-pill py-2 mt-auto fw-bold" onClick={() => navigate('/my-sessions')}>
                                        Explore <i className="fas fa-arrow-right ms-2"></i>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-handshake fa-4x text-primary mb-3"></i>
                                    <h3 className="fw-bold">Book Session</h3>
                                    <p className="text-muted">Find and book a 1-on-1 session with industry experts.</p>
                                    <button className="btn btn-primary w-100 rounded-pill py-2 mt-auto fw-bold" onClick={() => navigate('/sessions')}>
                                        Explore <i className="fas fa-arrow-right ms-2"></i>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm rounded-4 p-4 text-center h-100">
                            <i className="fas fa-user-circle fa-4x text-primary mb-3"></i>
                            <h3 className="fw-bold">View Profile</h3>
                            <p className="text-muted">Keep your personal and professional details up to date.</p>
                            <button className="btn btn-primary w-100 rounded-pill py-2 mt-auto fw-bold" onClick={() => navigate('/profile')}>
                                Update <i className="fas fa-arrow-right ms-2"></i>
                            </button>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm rounded-4 p-4 text-center h-100">
                            <i className="fas fa-comments fa-4x text-primary mb-3"></i>
                            <h3 className="fw-bold">Open Chat</h3>
                            <p className="text-muted">Stay connected with your mentors and peers in real-time.</p>
                            <button className="btn btn-primary w-100 rounded-pill py-2 mt-auto fw-bold" onClick={() => navigate('/chat')}>
                                Message <i className="fas fa-arrow-right ms-2"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};
export default Dashboard;