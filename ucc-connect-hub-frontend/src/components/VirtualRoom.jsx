import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import Peer from 'simple-peer';
import { 
    Video, VideoOff, Mic, MicOff, 
    PhoneOff, Monitor, Users, MessageCircle,
    Volume2, VolumeX, Maximize2, Minimize2
} from 'lucide-react';

const VideoCall = ({ roomId, roomName, onClose }) => {
    const { colors } = useTheme();
    const { user } = useAuth();
    
    // State
    const [participants, setParticipants] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [peers, setPeers] = useState({});
    const [localStream, setLocalStream] = useState(null);
    const [showChat, setShowChat] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    
    // Refs
    const localVideoRef = useRef(null);
    const remoteVideoRefs = useRef({});
    const peerRefs = useRef({});
    const socketRef = useRef(null);
    const streamRef = useRef(null);

    // Initialize WebRTC
    const initializeWebRTC = useCallback(async () => {
        try {
            // Get local media stream
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });
            
            setLocalStream(stream);
            streamRef.current = stream;
            
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }
            
            console.log('✅ WebRTC initialized successfully');
            setIsConnected(true);
            
        } catch (error) {
            console.error('❌ WebRTC initialization failed:', error);
            alert('Failed to access camera/microphone. Please check permissions.');
        }
    }, []);

    // Initialize room
    const initializeRoom = useCallback(async () => {
        try {
            const response = await api.post(`/video-call/initialize/${roomId}`);
            if (response.data.success) {
                console.log('✅ Room initialized:', response.data.data);
                await initializeWebRTC();
                
                // Load participants
                await loadParticipants();
            }
        } catch (error) {
            console.error('❌ Room initialization failed:', error);
            alert('Failed to join video call');
        }
    }, [roomId, initializeWebRTC]);

    // Load participants
    const loadParticipants = useCallback(async () => {
        try {
            const response = await api.get(`/video-call/participants/${roomId}`);
            if (response.data.success) {
                setParticipants(response.data.data.participants);
            }
        } catch (error) {
            console.error('❌ Failed to load participants:', error);
        }
    }, [roomId]);

    // Toggle mute
    const toggleMute = useCallback(() => {
        if (streamRef.current) {
            const audioTrack = streamRef.current.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setIsMuted(!audioTrack.enabled);
            }
        }
    }, []);

    // Toggle video
    const toggleVideo = useCallback(() => {
        if (streamRef.current) {
            const videoTrack = streamRef.current.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setIsVideoOff(!videoTrack.enabled);
            }
        }
    }, []);

    // Toggle screen sharing
    const toggleScreenShare = useCallback(async () => {
        try {
            if (!isScreenSharing) {
                const displayStream = await navigator.mediaDevices.getDisplayMedia({
                    video: true
                });
                setIsScreenSharing(true);
            } else {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                });
                setIsScreenSharing(false);
            }
        } catch (error) {
            console.error('Screen sharing failed:', error);
        }
    }, [isScreenSharing]);

    // Toggle fullscreen
    const toggleFullscreen = useCallback(() => {
        const elem = document.getElementById('video-container');
        if (!document.fullscreenElement) {
            elem?.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    }, []);

    // End call
    const endCall = useCallback(async () => {
        try {
            await api.post(`/video-call/end/${roomId}`);
            
            // Clean up
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
            
            // Close peer connections
            Object.values(peerRefs.current).forEach(peer => {
                peer.destroy();
            });
            
            setIsConnected(false);
            if (onClose) onClose();
            
        } catch (error) {
            console.error('Failed to end call:', error);
        }
    }, [roomId, onClose]);

    // Send chat message
    const sendChatMessage = useCallback(() => {
        if (!newMessage.trim()) return;
        
        const message = {
            id: Date.now(),
            sender_id: user?.id,
            sender_name: user?.name,
            message: newMessage,
            created_at: new Date().toISOString()
        };
        
        setChatMessages(prev => [...prev, message]);
        setNewMessage('');
    }, [newMessage, user]);

    // Initialize on mount
    useEffect(() => {
        initializeRoom();
        
        return () => {
            // Clean up
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
            Object.values(peerRefs.current).forEach(peer => {
                peer.destroy();
            });
        };
    }, [initializeRoom]);

    // Format time
    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div 
            id="video-container"
            className="fixed inset-0 z-50 bg-black/90 flex flex-col"
        >
            {/* Header */}
            <div className="flex justify-between items-center p-4 bg-black/50 backdrop-blur">
                <div className="flex items-center gap-4">
                    <span className="text-white font-bold text-lg">{roomName}</span>
                    <span className="text-green-400 text-sm">
                        {isConnected ? '🟢 Live' : '🔄 Connecting...'}
                    </span>
                    <span className="text-gray-400 text-sm">
                        {participants.length} participants
                    </span>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowChat(!showChat)}
                        className="p-2 rounded-lg hover:bg-white/10 transition"
                    >
                        <MessageCircle size={20} color="#fff" />
                    </button>
                    <button
                        onClick={toggleFullscreen}
                        className="p-2 rounded-lg hover:bg-white/10 transition"
                    >
                        {isFullscreen ? 
                            <Minimize2 size={20} color="#fff" /> : 
                            <Maximize2 size={20} color="#fff" />
                        }
                    </button>
                    <button
                        onClick={endCall}
                        className="p-2 rounded-lg bg-red-500 hover:bg-red-600 transition"
                    >
                        <PhoneOff size={20} color="#fff" />
                    </button>
                </div>
            </div>

            {/* Video Grid */}
            <div className="flex-1 p-4 overflow-y-auto">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 h-full">
                    {/* Local Video */}
                    <div className="relative rounded-lg overflow-hidden bg-gray-900">
                        <video
                            ref={localVideoRef}
                            autoPlay
                            muted
                            playsInline
                            className={`w-full h-full object-cover ${isVideoOff ? 'hidden' : ''}`}
                        />
                        {isVideoOff && (
                            <div className="w-full h-full flex items-center justify-center bg-gray-800">
                                <div className="text-center">
                                    <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center mx-auto mb-2">
                                        <span className="text-2xl text-white">
                                            {user?.name?.charAt(0) || 'U'}
                                        </span>
                                    </div>
                                    <p className="text-white text-sm">{user?.name || 'You'}</p>
                                </div>
                            </div>
                        )}
                        <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-black/50 text-white text-xs">
                            You {isMuted && '🔇'}
                        </div>
                    </div>

                    {/* Remote Videos - Simulated */}
                    {participants.map((p, index) => (
                        <div key={p.id} className="relative rounded-lg overflow-hidden bg-gray-900">
                            <div className="w-full h-full flex items-center justify-center bg-gray-800">
                                <div className="text-center">
                                    <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center mx-auto mb-2">
                                        <span className="text-2xl text-white">
                                            {p.name?.charAt(0) || 'U'}
                                        </span>
                                    </div>
                                    <p className="text-white text-sm">{p.name}</p>
                                    <p className="text-xs text-gray-400">{p.role}</p>
                                </div>
                            </div>
                            <div className="absolute top-2 right-2">
                                <span className={`px-2 py-0.5 rounded text-xs ${
                                    p.is_online ? 'bg-green-500' : 'bg-gray-500'
                                } text-white`}>
                                    {p.is_online ? 'Online' : 'Offline'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Sidebar */}
            {showChat && (
                <div className="absolute right-0 top-0 bottom-0 w-80 bg-gray-900/95 backdrop-blur flex flex-col">
                    <div className="p-4 border-b border-gray-700 flex justify-between">
                        <h3 className="text-white font-semibold">Chat</h3>
                        <button onClick={() => setShowChat(false)} className="text-gray-400 hover:text-white">
                            ✕
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {chatMessages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-lg p-3 ${
                                    msg.sender_id === user?.id ? 'bg-blue-500' : 'bg-gray-700'
                                }`}>
                                    <p className="text-xs text-gray-300">{msg.sender_name}</p>
                                    <p className="text-white text-sm">{msg.message}</p>
                                    <p className="text-xs text-gray-400 text-right">{formatTime(msg.created_at)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 border-t border-gray-700">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                                placeholder="Type a message..."
                                className="flex-1 px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
                            />
                            <button
                                onClick={sendChatMessage}
                                className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Controls */}
            <div className="flex justify-center items-center gap-4 p-4 bg-black/50 backdrop-blur">
                <button
                    onClick={toggleMute}
                    className={`p-3 rounded-full transition ${
                        isMuted ? 'bg-red-500' : 'bg-white/10 hover:bg-white/20'
                    }`}
                >
                    {isMuted ? <MicOff size={24} color="#fff" /> : <Mic size={24} color="#fff" />}
                </button>
                
                <button
                    onClick={toggleVideo}
                    className={`p-3 rounded-full transition ${
                        isVideoOff ? 'bg-red-500' : 'bg-white/10 hover:bg-white/20'
                    }`}
                >
                    {isVideoOff ? <VideoOff size={24} color="#fff" /> : <Video size={24} color="#fff" />}
                </button>
                
                <button
                    onClick={toggleScreenShare}
                    className={`p-3 rounded-full transition ${
                        isScreenSharing ? 'bg-blue-500' : 'bg-white/10 hover:bg-white/20'
                    }`}
                >
                    <Monitor size={24} color="#fff" />
                </button>
                
                <button
                    onClick={endCall}
                    className="p-3 rounded-full bg-red-500 hover:bg-red-600 transition"
                >
                    <PhoneOff size={24} color="#fff" />
                </button>
            </div>
        </div>
    );
};

export default VideoCall;