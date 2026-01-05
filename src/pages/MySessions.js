import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import toast, { Toaster } from 'react-hot-toast';

const MySessions = () => {
    const alumniId = localStorage.getItem('userId');
    const [sessions, setSessions] = useState([]);

    const fetchSessions = () => {
        fetch(`http://localhost:5000/alumni-sessions/${alumniId}`)
            .then(res => res.json())
            .then(data => setSessions(data || []))
            .catch(err => console.error("Error:", err));
    };

    useEffect(() => {
        fetchSessions();
    }, [alumniId]);

    const handleEndSession = async (sessionId) => {
        const res = await fetch(`http://localhost:5000/end-session/${sessionId}`, {
            method: 'PUT'
        });
        if (res.ok) {
            toast.success("Session Ended successfully");
            fetchSessions();
        }
    };

    return (
        <Layout>
            <Toaster />
            <div className="container py-5">
                <h2 className="fw-bold text-primary mb-5 text-center">My Mentorship Sessions</h2>
                
                <div className="row g-4">
                    {sessions.length > 0 ? sessions.map(s => (
                        <div className="col-md-6 col-lg-4" key={s.id}>
                            <div className={`card border-0 shadow-sm rounded-4 p-4 h-100 ${s.status === 'ended' ? 'bg-light' : 'bg-white'}`}>
                                
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div>
                                        <h5 className="fw-bold mb-1">{s.student_name}</h5>
                                        {/* Status badges */}
                                        <span className={`badge rounded-pill px-3 py-1 small ${s.status === 'active' ? 'bg-success' : 'bg-danger'}`}>
                                            {s.status.toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="bg-primary-subtle rounded-circle p-2">
                                        <i className="fas fa-graduation-cap text-primary"></i>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <p className="text-muted small mb-1">
                                        <i className="fas fa-envelope me-2"></i>{s.student_email}
                                    </p>
                                    <p className="text-muted small mb-3">
                                        <i className="fas fa-calendar-day me-2"></i>{new Date(s.session_date).toLocaleDateString()}
                                    </p>
                                </div>

                                <div className="bg-light p-3 rounded-3 mb-4 mt-auto">
                                    <small className="fw-bold text-primary d-block mb-1">Booking Details:</small>
                                    <p className="small mb-0 text-dark italic">"{s.booking_details}"</p>
                                </div>

                                {s.status === 'active' ? (
                                    <button 
                                        className="btn btn-secondary w-100 rounded-pill fw-bold py-2 shadow-sm" 
                                        onClick={() => handleEndSession(s.id)}
                                    >
                                        End Session
                                    </button>
                                ) : (
                                    <button 
                                        className="btn btn-outline-secondary w-100 rounded-pill fw-bold py-2" 
                                        disabled
                                    >
                                        Session Closed
                                    </button>
                                )}
                            </div>
                        </div>
                    )) : (
                        <div className="text-center p-5 w-100">
                            <i className="fas fa-calendar-times fa-4x text-muted opacity-25 mb-3"></i>
                            <h4 className="text-muted">No sessions booked yet.</h4>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default MySessions;