import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import toast, { Toaster } from 'react-hot-toast';

const Sessions = () => {
    const [mentors, setMentors] = useState([]);
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        fetch('http://localhost:5000/alumni')
            .then(res => res.json())
            .then(data => setMentors(data || []))
            .catch(err => console.error("Error fetching mentors:", err));
    }, []);

    const handleBook = async (mentor) => {
        const today = new Date().toISOString().split('T')[0];
        try {
            // Book the session
            const sessionRes = await fetch('http://localhost:5000/book-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    student_id: userId,
                    alumni_id: mentor.id,
                    session_date: today,
                    booking_details: `Standard session booked.`
                })
            });

            // Send initial message to trigger chat visibility
            await fetch('http://localhost:5000/send-message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sender_id: userId,
                    receiver_id: mentor.id,
                    message_text: `System: I have booked a mentorship session with you!`
                })
            });

            if (sessionRes.ok) {
                toast.success(`Booking with ${mentor.name} Successful!`);
                // Redirect to chat and pass the ID
                setTimeout(() => {
                    navigate('/chat', { state: { openMentorId: mentor.id } });
                }, 1000);
            }
        } catch (error) {
            toast.error("Booking failed.");
        }
    };

    return (
        <Layout>
            <Toaster />
            <div className="container py-5">
                <h2 className="text-center fw-bold text-primary mb-5">Book a Mentorship Session</h2>
                <div className="row g-4">
                    {mentors.map(mentor => (
                        <div className="col-md-4" key={mentor.id}>
                            <div className="card border-0 shadow-lg rounded-4 p-4 h-100 text-center">
                                <i className="fas fa-user-graduate fa-3x text-primary mb-3"></i>
                                <h4 className="fw-bold">{mentor.name}</h4>
                                <p className="text-muted small">{mentor.bio || "Career Expert"}</p>
                                <button className="btn btn-primary w-100 rounded-pill mt-auto fw-bold" onClick={() => handleBook(mentor)}>
                                    Book Session
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default Sessions;