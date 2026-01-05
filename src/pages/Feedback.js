import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import toast, { Toaster } from 'react-hot-toast';

const Feedback = () => {
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');
    const [history, setHistory] = useState([]);
    const [selectedMentor, setSelectedMentor] = useState(null);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [alumniFeedback, setAlumniFeedback] = useState([]);

    useEffect(() => {
        if (userRole === 'student') {
            fetch(`http://localhost:5000/chat-list/${userId}`)
                .then(res => res.json()).then(data => setHistory(data || []));
        } else {
            fetch(`http://localhost:5000/get-feedback/${userId}`)
                .then(res => res.json()).then(data => setAlumniFeedback(data || []));
        }
    }, [userId, userRole]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedMentor) return toast.error("Please select a mentor from the list");
        if (rating === 0) return toast.error("Please select stars");

        const res = await fetch('http://localhost:5000/submit-feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                student_id: userId, 
                alumni_id: selectedMentor.id, 
                rating, 
                comment 
            })
        });

        if (res.ok) {
            // Confirmation pop-up
            toast.success(`Feedback for ${selectedMentor.name} Submitted Successfully!`, {
                position: 'top-center',
                style: { padding: '20px', fontSize: '1.2rem', borderRadius: '15px', background: '#fff', color: '#0d6efd', border: '2px solid #0d6efd' }
            });

            // Locally remove mentor from the sidebar list immediately
            setHistory(prev => prev.filter(m => m.id !== selectedMentor.id));
            
            // Reset form fields
            setRating(0);
            setComment('');
            setSelectedMentor(null);
        } else {
            toast.error("Submit failed. Check server logs.");
        }
    };

    return (
        <Layout>
            <Toaster />
            <div className="container py-5">
                {userRole === 'student' ? (
                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
                                <h5 className="fw-bold mb-3 border-bottom pb-2">Your Mentors</h5>
                                {history.length > 0 ? history.map(m => (
                                    <button key={m.id} onClick={() => setSelectedMentor(m)} 
                                        className={`w-100 text-start p-3 rounded-3 mb-2 border-0 transition-all ${selectedMentor?.id === m.id ? 'bg-primary text-white shadow' : 'bg-light hover-shadow'}`}>
                                        <p className="mb-0 fw-bold">{m.name}</p>
                                        <small className={selectedMentor?.id === m.id ? 'text-white-50' : 'text-muted'}>Mentor</small>
                                    </button>
                                )) : (
                                    <p className="text-center text-muted py-4">No pending feedback sessions.</p>
                                )}
                            </div>
                        </div>
                        <div className="col-md-8">
                            <div className="card border-0 shadow-lg rounded-4 p-5 bg-white">
                                <h2 className="text-primary fw-bold mb-4">{selectedMentor ? `Feedback for ${selectedMentor.name}` : "Share Your Experience"}</h2>
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-4">
                                        <label className="fw-bold mb-2 d-block">Overall Rating</label>
                                        <div className="d-flex">
                                            {[1,2,3,4,5].map(s => (
                                                <i key={s} className={`fas fa-star fa-2x me-2 cursor-pointer transition-all ${rating >= s ? 'text-warning' : 'text-secondary opacity-25'}`} onClick={() => setRating(s)}></i>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label className="fw-bold mb-2">Detailed Feedback</label>
                                        <textarea className="form-control rounded-3 bg-light border-0 p-3" rows="5" value={comment} onChange={e => setComment(e.target.value)} required></textarea>
                                    </div>
                                    <button className="btn btn-primary btn-lg w-100 rounded-pill shadow-sm py-3 fw-bold" disabled={!selectedMentor}>Submit Review</button>
                                </form>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="row justify-content-center">
                        <div className="col-lg-10">
                            <h2 className="fw-bold text-primary mb-4 text-center">Reviews from Students</h2>
                            <div className="row g-4">
                                {alumniFeedback.length > 0 ? alumniFeedback.map(f => (
                                    <div className="col-md-6" key={f.id}>
                                        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
                                            <div className="d-flex justify-content-between mb-2">
                                                <h6 className="fw-bold text-primary">{f.student_name}</h6>
                                                <div className="text-warning">{[...Array(f.rating)].map((_, i) => <i key={i} className="fas fa-star small"></i>)}</div>
                                            </div>
                                            <p className="text-muted small italic">"{f.comment}"</p>
                                            <hr className="opacity-10" />
                                            <small className="text-secondary opacity-50">{new Date(f.created_at).toLocaleDateString()}</small>
                                        </div>
                                    </div>
                                )) : <div className="text-center text-muted p-5 w-100">No feedback received yet.</div>}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};
export default Feedback;