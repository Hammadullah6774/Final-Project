import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '../components/Layout';

const Chat = () => {
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole'); // Retrieve role for conditional text
    const location = useLocation();
    const [chatList, setChatList] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [activePartner, setActivePartner] = useState(null);
    const messageEndRef = useRef(null);

    const loadChats = useCallback(() => {
        fetch(`http://localhost:5000/chat-list/${userId}`)
            .then(res => res.json())
            .then(data => setChatList(data || []));
    }, [userId]);

    useEffect(() => {
        if (location.state?.openMentorId && chatList.length > 0) {
            const partnerToOpen = chatList.find(m => m.id == location.state.openMentorId);
            if (partnerToOpen) setActivePartner(partnerToOpen);
        }
    }, [chatList, location.state]);

    const loadMessages = useCallback(() => {
        const pId = activePartner?.id || activePartner?.partner_id;
        if (pId) {
            fetch(`http://localhost:5000/get-messages/${userId}/${pId}`)
                .then(res => res.json())
                .then(data => setMessages(data || []));
        }
    }, [activePartner, userId]);

    useEffect(() => {
        loadChats();
    }, [loadChats]);

    useEffect(() => {
        if (activePartner) {
            loadMessages();
            const interval = setInterval(loadMessages, 3000);
            return () => clearInterval(interval);
        }
    }, [loadMessages, activePartner]);

    const handleSendMessage = async (e) => {
        if (e) e.preventDefault();
        const pId = activePartner?.id || activePartner?.partner_id;
        if (!newMessage.trim() || !pId) return;

        try {
            const res = await fetch('http://localhost:5000/send-message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sender_id: userId, receiver_id: pId, message_text: newMessage })
            });
            if (res.ok) {
                setNewMessage('');
                loadMessages();
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <Layout>
            <div className="container py-4">
                <div className="row g-0 shadow-lg rounded-4 overflow-hidden bg-white mx-auto" style={{ height: '85vh', maxWidth: '1200px' }}>
                    
                    {/* Sidebar */}
                    <div className="col-md-3 border-end d-flex flex-column h-100 bg-white">
                        <div className="p-3 bg-primary text-white shadow-sm">
                            <h5 className="mb-0 fw-bold">Messages</h5>
                        </div>
                        <div className="list-group list-group-flush overflow-auto flex-grow-1">
                            {chatList.map(chat => (
                                <button 
                                    key={chat.id} 
                                    onClick={() => setActivePartner(chat)} 
                                    className={`list-group-item list-group-item-action p-3 border-0 ${activePartner?.id === chat.id ? 'bg-primary-subtle border-start border-4 border-primary' : ''}`}
                                >
                                    <h6 className="mb-1 fw-bold">{chat.name}</h6>
                                    <small className="text-muted text-truncate d-block">{chat.last_msg}</small>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="col-md-9 d-flex flex-column bg-light h-100">
                        {activePartner ? (
                            <>
                                <div className="p-3 bg-white border-bottom fw-bold text-primary shadow-sm d-flex align-items-center">
                                    <i className="fas fa-user-circle fa-lg me-2"></i>
                                    {activePartner.name}
                                </div>
                                
                                <div className="flex-grow-1 p-4 overflow-auto d-flex flex-column" style={{ backgroundColor: '#f8f9fa' }}>
                                    {messages.map((m, i) => (
                                        <div key={i} className={`mb-3 d-flex ${m.message_text.startsWith('System:') ? 'justify-content-center w-100' : (m.sender_id == userId ? 'justify-content-end' : 'justify-content-start')}`}>
                                            {m.message_text.startsWith('System:') ? (
                                                <span className="badge bg-white text-muted border py-2 px-3 rounded-pill fw-normal shadow-sm small">{m.message_text}</span>
                                            ) : (
                                                <div className={`p-3 rounded-4 shadow-sm ${m.sender_id == userId ? 'bg-primary text-white' : 'bg-white border'}`} style={{ maxWidth: '75%' }}>
                                                    {m.message_text}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    <div ref={messageEndRef} />
                                </div>

                                {/* Fixed Alignment for Chat Input */}
                                <div className="p-3 bg-white border-top">
                                    <form className="d-flex align-items-center gap-2" onSubmit={handleSendMessage}>
                                        <input 
                                            className="form-control rounded-pill border-0 bg-light px-4 py-2 shadow-sm flex-grow-1" 
                                            placeholder={`Message ${activePartner.name}...`} 
                                            value={newMessage} 
                                            onChange={e => setNewMessage(e.target.value)} 
                                        />
                                        <button 
                                            type="submit" 
                                            className="btn btn-primary rounded-circle shadow d-flex align-items-center justify-content-center" 
                                            style={{ width: '45px', height: '45px', minWidth: '45px', padding: '0' }}
                                        >
                                            <i className="fas fa-paper-plane" style={{ fontSize: '1.1rem' }}></i>
                                        </button>
                                    </form>
                                </div>
                            </>
                        ) : (
                            <div className="h-100 d-flex flex-column align-items-center justify-content-center text-muted bg-white">
                                <i className="fas fa-comments fa-5x mb-3 opacity-25"></i>
                                {/* Conditional Greeting Text */}
                                <h4 className="fw-bold text-secondary">
                                    {userRole === 'alumni' ? 'Select a student to chat' : 'Select a mentor to chat'}
                                </h4>
                                <p className="small">Your professional conversations will appear here.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Chat;