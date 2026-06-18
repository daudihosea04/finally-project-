// src/services/websocket.js
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Set Pusher globally (required for Laravel Echo)
window.Pusher = Pusher;

let echo = null;
let initPromise = null;

/**
 * Initialize WebSocket connection using Laravel Reverb
 * @param {string} token - Bearer token for authentication
 * @returns {Promise<Echo|null>} Echo instance or null if failed
 */
export const initWebSocket = async (token) => {
    // Return existing instance if already connected
    if (echo) {
        console.log('📡 Using existing Echo instance');
        return echo;
    }

    // Wait for ongoing initialization
    if (initPromise) {
        console.log('⏳ Waiting for existing initialization...');
        return await initPromise;
    }

    console.log('🔌 Creating new Echo instance with token');

    initPromise = (async () => {
        try {
            // Create Echo instance configured for Laravel Reverb
            echo = new Echo({
                broadcaster: 'reverb',
                key: import.meta.env.VITE_REVERB_APP_KEY || 'test-key',
                wsHost: import.meta.env.VITE_REVERB_HOST || '127.0.0.1',
                wsPort: import.meta.env.VITE_REVERB_PORT || 8080,
                forceTLS: false,
                enabledTransports: ['ws', 'wss'],
                authEndpoint: '/broadcasting/auth',
                auth: {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                }
            });

            // Add connection event listeners
            if (echo.connector && echo.connector.socket) {
                // Connection established
                echo.connector.socket.on('connect', () => {
                    console.log('✅ WebSocket connected successfully to Reverb!');
                });

                // Connection in progress
                echo.connector.socket.on('connecting', () => {
                    console.log('🔄 WebSocket connecting...');
                });

                // Connection lost
                echo.connector.socket.on('disconnect', (reason) => {
                    console.log('❌ WebSocket disconnected:', reason);
                });

                // Connection error
                echo.connector.socket.on('error', (error) => {
                    console.error('❌ WebSocket error:', error);
                });
            }

            console.log('🎉 Echo instance created successfully');
            return echo;
            
        } catch (error) {
            console.error('❌ Failed to create Echo instance:', error);
            echo = null;
            initPromise = null;
            return null;
        }
    })();

    return await initPromise;
};

/**
 * Get existing Echo instance without creating new one
 * @returns {Echo|null} Echo instance or null
 */
export const getEcho = () => {
    return echo;
};

/**
 * Disconnect WebSocket and clean up
 */
export const disconnectWebSocket = () => {
    if (echo) {
        console.log('🔌 Disconnecting WebSocket...');
        try {
            if (typeof echo.disconnect === 'function') {
                echo.disconnect();
            }
        } catch (err) {
            console.warn('Error disconnecting Echo:', err);
        }
        echo = null;
        initPromise = null;
        console.log('✅ WebSocket disconnected');
    }
};

/**
 * Check if WebSocket is connected
 * @returns {boolean} True if connected
 */
export const isWebSocketConnected = () => {
    if (!echo || !echo.connector || !echo.connector.socket) {
        return false;
    }
    return echo.connector.socket.connected === true;
};

/**
 * Subscribe to a channel and listen for events
 * @param {string} channelName - Channel name (e.g., 'course.1' or 'group.5')
 * @param {string} eventName - Event name (e.g., 'NewCourseMessage')
 * @param {Function} callback - Callback function when event received
 * @returns {Object|null} Channel subscription object
 */
export const subscribeToChannel = async (channelName, eventName, callback) => {
    const echoInstance = await initWebSocket(localStorage.getItem('token'));
    
    if (!echoInstance) {
        console.error('Cannot subscribe: Echo not initialized');
        return null;
    }
    
    try {
        const channel = echoInstance.channel(channelName);
        channel.listen(eventName, (data) => {
            console.log(`📨 Event received from ${channelName}:`, data);
            callback(data);
        });
        
        console.log(`✅ Subscribed to ${channelName} for ${eventName}`);
        return channel;
    } catch (error) {
        console.error(`❌ Failed to subscribe to ${channelName}:`, error);
        return null;
    }
};

/**
 * Leave a channel safely
 * @param {string} channelName - Channel name to leave
 * @returns {boolean} Success status
 */
export const leaveChannelByName = (channelName) => {
    // Validate channel name
    if (!channelName || typeof channelName !== 'string' || channelName.trim() === '') {
        console.warn('⚠️ Invalid channel name for leaveChannelByName:', channelName);
        return false;
    }
    
    if (echo && typeof echo.leave === 'function') {
        try {
            echo.leave(channelName);
            console.log(`👋 Left channel: ${channelName}`);
            return true;
        } catch (err) {
            console.error(`❌ Error leaving channel ${channelName}:`, err);
            return false;
        }
    }
    return false;
};

/**
 * Stop listening on a channel safely - FIXED
 * @param {Object} channel - Channel object
 * @returns {boolean} Success status
 */
export const safeStopListening = (channel) => {
    // Check if channel exists
    if (!channel) {
        console.log('⚠️ Channel is null or undefined, skipping cleanup');
        return false;
    }
    
    try {
        // Check if channel has a valid name before trying to stop listening
        const channelName = channel.name;
        
        if (channelName && typeof channelName === 'string' && channelName.length > 0) {
            // Try to stop listening
            if (typeof channel.stopListening === 'function') {
                channel.stopListening();
                console.log(`🛑 Stopped listening on channel: ${channelName}`);
            }
            
            // Also try to leave via Echo
            if (echo && typeof echo.leave === 'function') {
                echo.leave(channelName);
                console.log(`👋 Left channel via Echo: ${channelName}`);
            }
        } else {
            console.log('⚠️ Channel name is invalid, skipping stopListening');
            
            // Try to stop listening anyway without name check
            if (channel && typeof channel.stopListening === 'function') {
                try {
                    channel.stopListening();
                    console.log('🛑 Stopped listening on channel (without name validation)');
                } catch (err) {
                    console.warn('Error in stopListening without name:', err);
                }
            }
        }
        
        return true;
    } catch (err) {
        console.warn('❌ Error stopping listening on channel:', err);
        return false;
    }
};

/**
 * Safe cleanup for any channel - prevents charAt error
 * @param {Object} channel - Channel object 
 * @param {string} channelName - Channel name as backup
 */
export const safeCleanupChannel = (channel, channelName) => {
    console.log('🔄 Safe cleanup for channel:', channelName);
    
    // Try to leave by name first (safest)
    if (channelName && typeof channelName === 'string' && channelName.length > 0) {
        leaveChannelByName(channelName);
    }
    
    // Then try to stop listening on the channel object
    if (channel) {
        safeStopListening(channel);
    }
};