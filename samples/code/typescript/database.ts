import pg from 'pg';
import { promisify } from 'util';

const { Pool } = pg;

/**
 * Database Connection Manager
 * Manages PostgreSQL connection pool and provides query interface
 */
export class Database {
  private pool: pg.Pool;
  public users: UserRepository;
  public sessions: SessionRepository;

  constructor(connectionString: string) {
    this.pool = new Pool({
      connectionString,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    this.users = new UserRepository(this.pool);
    this.sessions = new SessionRepository(this.pool);
  }

  /**
   * Execute a query
   * @param query - SQL query string
   * @param params - Query parameters
   */
  async query<T = any>(query: string, params?: any[]): Promise<T[]> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(query, params);
      return result.rows;
    } finally {
      client.release();
    }
  }

  /**
   * Execute a transaction
   * @param callback - Transaction callback
   */
  async transaction<T>(callback: (client: pg.PoolClient) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Close all database connections
   */
  async close(): Promise<void> {
    await this.pool.end();
  }

  /**
   * Check if database is connected
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.query('SELECT 1');
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * User Repository
 * Database operations for users table
 */
class UserRepository {
  constructor(private pool: pg.Pool) {}

  async create(data: {
    email: string;
    password: string;
    createdAt: Date;
  }): Promise<User> {
    const result = await this.pool.query(
      'INSERT INTO users (email, password, created_at) VALUES ($1, $2, $3) RETURNING *',
      [data.email, data.password, data.createdAt]
    );
    return result.rows[0];
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
  }

  async findById(id: string): Promise<User | null> {
    const result = await this.pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const setClause = fields.map((f, i) => `${f} = $${i + 2}`).join(', ');

    const result = await this.pool.query(
      `UPDATE users SET ${setClause} WHERE id = $1 RETURNING *`,
      [id, ...values]
    );
    return result.rows[0];
  }

  async delete(id: string): Promise<void> {
    await this.pool.query('DELETE FROM users WHERE id = $1', [id]);
  }
}

/**
 * Session Repository
 * Database operations for sessions table
 */
class SessionRepository {
  constructor(private pool: pg.Pool) {}

  async create(userId: string, token: string, expiresAt: Date): Promise<void> {
    await this.pool.query(
      'INSERT INTO sessions (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [userId, token, expiresAt]
    );
  }

  async findByToken(token: string): Promise<Session | null> {
    const result = await this.pool.query(
      'SELECT * FROM sessions WHERE token = $1 AND expires_at > NOW()',
      [token]
    );
    return result.rows[0] || null;
  }

  async deleteExpired(): Promise<number> {
    const result = await this.pool.query('DELETE FROM sessions WHERE expires_at <= NOW()');
    return result.rowCount || 0;
  }
}

interface User {
  id: string;
  email: string;
  password: string;
  name?: string;
  bio?: string;
  avatar?: string;
  createdAt: Date;
}

interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
}

