import { ILogRepositary, UserLog } from "./types";

let logsInMemory: UserLog[] = [];
let currentId = 1;

export class InMemoryRepository implements ILogRepositary {
    async getAllLogs(): Promise<UserLog[]> {
        return logsInMemory;
    }
    async createLog(name: string, email: string): Promise<UserLog> {
        const newLog: UserLog = {
            id: currentId++,
            name, 
            email,
            created_at: new Date().toISOString()
        };
        logsInMemory.push(newLog);
        return newLog;
    }
}
