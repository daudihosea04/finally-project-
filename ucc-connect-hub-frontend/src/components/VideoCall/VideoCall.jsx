import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import VideoCall from './VideoCall/VideoCall';

const VirtualRoom = ({ room, onClose }) => {
    const { colors } = useTheme();
    const [inCall, setInCall] = useState(false);

    if (inCall) {
        return (
            <VideoCall 
                roomId={room.id} 
                roomName={room.name} 
                onClose={() => setInCall(false)} 
            />
        );
    }

    return (
        <div className="glass-card p-6" style={{ border: `1px solid ${colors.border}` }}>
            <h3 className="font-bold" style={{ color: colors.textPrimary }}>{room.name}</h3>
            <p style={{ color: colors.textSecondary }}>{room.description}</p>
            <button 
                onClick={() => setInCall(true)}
                className="mt-4 px-4 py-2 rounded-lg"
                style={{ backgroundColor: colors.primary, color: '#000' }}
            >
                Join Video Call
            </button>
        </div>
    );
};

export default VirtualRoom;