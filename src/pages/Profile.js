import React, { useState } from 'react';
import Layout from '../components/Layout';
import toast, { Toaster } from 'react-hot-toast';

const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);
    
    // Initializing state from localStorage to ensure immediate display
    const [userData, setUserData] = useState({
        id: localStorage.getItem('userId'),
        name: localStorage.getItem('userName'),
        email: localStorage.getItem('userEmail'),
        dept: localStorage.getItem('userDept') || '',
        bio: localStorage.getItem('userBio') || '',
        skills: localStorage.getItem('userSkills') || '',
        password: ''
    });

    const handleSave = async () => {
        // Updated URL to include the userId as a parameter for the backend
        try {
            const response = await fetch(`http://localhost:5000/update-profile/${userData.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    department: userData.dept, // Mapping 'dept' to database 'department'
                    bio: userData.bio,
                    skills: userData.skills,
                    password: userData.password
                })
            });

            const data = await response.json();
            
            if (data.success) {
                // Synchronizing localStorage so changes show on other pages
                localStorage.setItem('userBio', userData.bio);
                localStorage.setItem('userSkills', userData.skills);
                localStorage.setItem('userDept', userData.dept);
                
                setIsEditing(false);
                setUserData({ ...userData, password: '' }); // Clear password field after save

                toast.success('Profile Updated Successfully!', {
                    position: 'bottom-right',
                    style: { padding: '20px', fontSize: '1.1rem', borderRadius: '10px' }
                });
            } else {
                toast.error('Update failed. Check server connection.');
            }
        } catch (error) {
            console.error("Save error:", error);
            toast.error('Network error. Is the backend running?');
        }
    };

    return (
        <Layout>
            <Toaster />
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-8 card border-0 shadow-lg p-5 rounded-4 bg-white">
                        <div className="text-center mb-4">
                            {/* Visual user header */}
                            <i className="fas fa-user-circle fa-6x text-primary mb-3"></i>
                            <h2 className="fw-bold">{userData.name}</h2>
                            <button className="btn btn-outline-primary btn-sm mt-2 rounded-pill px-4" onClick={() => setIsEditing(!isEditing)}>
                                {isEditing ? 'Cancel' : 'Edit Professional Profile'}
                            </button>
                        </div>
                        
                        <div className="row g-4 mt-2">
                            <div className="col-md-6">
                                <label className="fw-bold text-muted small">DEPARTMENT</label>
                                <input 
                                    className={`form-control ${isEditing ? 'bg-white' : 'bg-light'}`} 
                                    readOnly={!isEditing} 
                                    value={userData.dept} 
                                    onChange={e => setUserData({...userData, dept: e.target.value})} 
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="fw-bold text-muted small">EMAIL</label>
                                <input 
                                    className="form-control bg-light" 
                                    readOnly 
                                    value={userData.email} 
                                />
                            </div>
                            <div className="col-12">
                                <label className="fw-bold text-muted small">BIO</label>
                                <textarea 
                                    className={`form-control ${isEditing ? 'bg-white' : 'bg-light'}`} 
                                    rows="3" 
                                    readOnly={!isEditing} 
                                    value={userData.bio} 
                                    onChange={e => setUserData({...userData, bio: e.target.value})} 
                                />
                            </div>
                            <div className="col-12">
                                <label className="fw-bold text-muted small">SKILLS</label>
                                <input 
                                    className={`form-control ${isEditing ? 'bg-white' : 'bg-light'}`} 
                                    readOnly={!isEditing} 
                                    value={userData.skills} 
                                    onChange={e => setUserData({...userData, skills: e.target.value})} 
                                />
                            </div>
                            
                            {isEditing && (
                                <div className="col-12 animate__animated animate__fadeIn">
                                    <label className="fw-bold text-danger small">UPDATE PASSWORD (OPTIONAL)</label>
                                    <input 
                                        type="password" 
                                        placeholder="Enter new password to change it" 
                                        className="form-control border-danger-subtle" 
                                        value={userData.password}
                                        onChange={e => setUserData({...userData, password: e.target.value})} 
                                    />
                                    <button 
                                        className="btn btn-primary w-100 mt-4 py-3 fw-bold shadow-sm rounded-pill" 
                                        onClick={handleSave}
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Profile;
