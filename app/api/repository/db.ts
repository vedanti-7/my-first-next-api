import { Pool } from 'pg';

// 1. Maintain a single pool instance across hot-reloads in Next.js development
const globalForPg = global as unknown as { pool: Pool };

export const pool =
  globalForPg.pool ||
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

if (process.env.NODE_ENV !== 'production') globalForPg.pool = pool;

// ============================================================================
// CRITICAL ORDER: We import and instantiate your logger repository *after* // exporting the pool. This prevents circular dependency runtime issues if 
// PostgresRepository imports the pool back from this file!
// ============================================================================

import { PostgresRepository } from "./postgresRepo";

// Swapping the storage layer!
// Our routes remain 100% untouched because PostgresRepository implements ILogRepository.
export const logRepository = new PostgresRepository();