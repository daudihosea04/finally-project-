// src/pages/JoinGroup.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const JoinGroup = () => {
    const { code } = useParams();
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [group, setGroup] = useState(null);
    const [loading, setLoading] = useState(true);
    const [joining, setJoining] = useState(false);
    const [error, setError] = useState('');
    const [alreadyMember, setAlreadyMember] = useState(false);

    useEffect(() => {
        fetchGroupDetails();
    }, [code]);

    const fetchGroupDetails = async () => {
        try {
            const response = await api.get(`/groups/by-code/${code}`);
            if (response.data.success) {
                setGroup(response.data.data);
            } else {
                setError('Invalid or expired invite link');
            }
        } catch (err) {
            setError('Invalid or expired invite link');
        } finally {
            setLoading(false);
        }
    };

    const handleJoinGroup = async () => {
        if (!isAuthenticated) {
            // Redirect to login then come back
            localStorage.setItem('redirectAfterLogin', `/join-group/${code}`);
            navigate('/login');
            return;
        }

        setJoining(true);
        try {
            const response = await api.post('/groups/join-by-code', { code });
            if (response.data.success) {
                if (response.data.already_member) {
                    setAlreadyMember(true);
                } else {
                    // Redirect to group chat
                    navigate(`/student/chat/group/${response.data.group.id}`);
                }
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to join group');
        } finally {
            setJoining(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading group information...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
                <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
                    <div className="text-red-500 text-5xl mb-4">⚠️</div>
                    <h2 className="text-xl font-bold mb-2">Invalid Invite Link</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button 
                        onClick={() => navigate('/')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                    >
                        Go to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
            <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
                <div className="text-5xl mb-4">👥</div>
                <h1 className="text-2xl font-bold mb-2">Join {group?.name}</h1>
                <p className="text-gray-600 mb-2">
                    Course: <strong>{group?.course?.name || 'General'}</strong>
                </p>
                <p className="text-gray-500 mb-6">
                    {group?.members_count || 0} members • {group?.max_members || 50} max
                </p>

                {alreadyMember ? (
                    <div>
                        <p className="text-green-600 mb-4">✅ You are already a member of this group!</p>
                        <button 
                            onClick={() => navigate(`/student/chat/group/${group?.id}`)}
                            className="w-full py-2 bg-blue-600 text-white rounded-lg"
                        >
                            Go to Group Chat
                        </button>
                    </div>
                ) : (
                    <button 
                        onClick={handleJoinGroup}
                        disabled={joining}
                        className="w-full py-2 bg-green-600 text-white rounded-lg disabled:opacity-50"
                    >
                        {joining ? 'Joining...' : isAuthenticated ? 'Join Group' : 'Login to Join'}
                    </button>
                )}

                {!isAuthenticated && (
                    <p className="text-sm text-gray-500 mt-4">
                        You need to login first to join this group
                    </p>
                )}
            </div>
        </div>
    );
};

export default JoinGroup;