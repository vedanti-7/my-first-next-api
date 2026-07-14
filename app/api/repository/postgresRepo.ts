import { Pool } from "pg";
import { ILogRepositary,UserLog } from "./types";

const pool=new Pool({
    connectionString: process.env.DATABASE_URL,
});

export class PostgresRepository implements ILogRepositary{
    async getAllLogs(): Promise<UserLog[]> {
        const result= await pool.query('SELECT * FROM user_logs ORDER BY id ASC;');
        return result.rows;
    }
    async createLog(name: string, email: string): Promise<UserLog> {
        const queryText='INSERT INTO user_logs(name,email) VALUES($1, $2) RETURNING *;';
        const result=await pool.query(queryText,[name, email]);
        return result.rows[0];
    }
}