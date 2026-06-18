import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

const echo = new Echo({
    broadcaster: 'reverb',
    key: 'test-key',
    wsHost: '127.0.0.1',
    wsPort: 8080,
    forceTLS: false,
    enabledTransports: ['ws', 'wss']
});

export default echo;