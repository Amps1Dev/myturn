// Simple in-memory database for localhost development
// Data will be lost when server restarts

class InMemoryDB {
    constructor() {
      this.users = new Map();
      this.sessions = new Map();
    }
  
    // User operations
    createUser(userData) {
      const userId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      const user = {
        id: userId,
        ...userData,
        createdAt: new Date().toISOString()
      };
      this.users.set(userId, user);
      return user;
    }
  
    getUserByEmail(email) {
      for (const [id, user] of this.users) {
        if (user.email === email) {
          return user;
        }
      }
      return null;
    }
  
    getUserById(id) {
      return this.users.get(id) || null;
    }
  
    // Session operations
    createSession(userId) {
      const sessionId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      const session = {
        id: sessionId,
        userId,
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString()
      };
      this.sessions.set(sessionId, session);
      return session;
    }
  
    getSession(sessionId) {
      const session = this.sessions.get(sessionId);
      if (session) {
        // Update last active time
        session.lastActive = new Date().toISOString();
        this.sessions.set(sessionId, session);
      }
      return session || null;
    }
  
    deleteSession(sessionId) {
      return this.sessions.delete(sessionId);
    }
  
    // Debug methods
    getAllUsers() {
      return Array.from(this.users.values());
    }
  
    getAllSessions() {
      return Array.from(this.sessions.values());
    }
  }
  
  // Create singleton instance
  const db = new InMemoryDB();
  
  if (process.env.NODE_ENV === 'development') {
    console.log('🗄️ In-memory database initialized');
  }
  
  export default db;