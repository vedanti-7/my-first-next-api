import { pool } from './db';
import { UserRecord, IUserRepository } from './types';

export class PostgresUserRepository implements IUserRepository {
  
  async createUser(email: string, passwordHash: string): Promise<UserRecord> {
    const text = `
      INSERT INTO users (email, password_hash) 
      VALUES ($1, $2) 
      RETURNING id, email, password_hash, created_at
    `;
    const params = [email.toLowerCase().trim(), passwordHash];
    
    const result = await pool.query(text, params);
    return result.rows[0];
  }

  async findUserByEmail(email: string): Promise<UserRecord | null> {
    const text = 'SELECT id, email, password_hash, created_at FROM users WHERE email = $1';
    const result = await pool.query(text, [email.toLowerCase().trim()]);
    
    if (result.rows.length === 0) return null;
    return result.rows[0];
  }

  async findUserById(id: number): Promise<UserRecord | null> {
    const text = 'SELECT id, email, created_at FROM users WHERE id = $1';
    const result = await pool.query(text, [id]);
    
    if (result.rows.length === 0) return null;
    return result.rows[0];
  }
}

// Export a single instance to be used by our API endpoints
export const userRepository = new PostgresUserRepository();