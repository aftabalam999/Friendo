import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5003';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect(userId) {
    if (this.socket?.connected) {
      return this.socket;
    }

    // Disconnect any existing socket connection
    if (this.socket) {
      this.socket.disconnect();
    }

    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      forceNew: true,
      timeout: 10000,
      ackTimeout: 5000, // Add acknowledgment timeout
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket.id);
      if (userId) {
        // Add error handling for emit
        try {
          this.socket.emit('user:online', userId, (response) => {
            if (response && response.error) {
              console.error('Socket emit error:', response.error);
            }
          });
        } catch (error) {
          console.error('Socket emit failed:', error);
        }
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Improved emit method with error handling
  emit(event, data, callback) {
    if (this.socket && this.socket.connected) {
      try {
        if (callback) {
          // Use acknowledgment with timeout
          const timeout = setTimeout(() => {
            console.warn(`Socket emit timeout for event: ${event}`);
            callback(new Error('Timeout'));
          }, 5000);
          
          this.socket.emit(event, data, (response) => {
            clearTimeout(timeout);
            callback(null, response);
          });
        } else {
          this.socket.emit(event, data);
        }
      } catch (error) {
        console.error(`Socket emit error for event ${event}:`, error);
        if (callback) {
          callback(error);
        }
      }
    } else {
      console.warn('Socket not connected, cannot emit event:', event);
      if (callback) {
        callback(new Error('Socket not connected'));
      }
    }
  }

  on(event, callback) {
    if (this.socket) {
      const wrappedCallback = (data) => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in socket listener for ${event}:`, error);
        }
      };
      
      this.socket.on(event, wrappedCallback);
      
      // Store listener for cleanup
      if (!this.listeners.has(event)) {
        this.listeners.set(event, []);
      }
      this.listeners.get(event).push(wrappedCallback);
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
      
      // Remove from stored listeners
      if (this.listeners.has(event)) {
        const callbacks = this.listeners.get(event);
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    }
  }

  removeAllListeners(event) {
    if (this.socket) {
      if (event) {
        this.socket.off(event);
        this.listeners.delete(event);
      } else {
        this.socket.removeAllListeners();
        this.listeners.clear();
      }
    }
  }
}

const socketService = new SocketService();

export default socketService;