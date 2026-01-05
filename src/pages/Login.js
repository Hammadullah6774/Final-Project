import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (data.success) {
                // Store EVERY field from the database
                localStorage.setItem('userId', data.user.id);
                localStorage.setItem('userName', data.user.name);
                localStorage.setItem('userEmail', data.user.email);
                localStorage.setItem('userRole', data.user.role);
                localStorage.setItem('userDept', data.user.department);
                localStorage.setItem('userBio', data.user.bio);
                localStorage.setItem('userSkills', data.user.skills);
                navigate('/dashboard');
            } else {
                alert("Invalid Email or Password");
            }
        } catch (error) {
            alert("Error: Is your Backend running?");
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center vh-100 bg-light-blue">
            <div className="card shadow-lg p-4 login-card border-0 animate__animated animate__zoomIn" style={{width: '400px'}}>
                <h2 className="text-center text-primary fw-bold mb-4">SkillConnect</h2>
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label fw-bold">Email</label>
                        <input type="email" className="form-control" required value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="mb-4">
                        <label className="form-label fw-bold">Password</label>
                        <input type="password" className="form-control" required value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button type="submit" className="btn btn-primary w-100 py-2 fw-bold">Login</button>
                </form>
            </div>
        </div>
    );
};
export default Login;