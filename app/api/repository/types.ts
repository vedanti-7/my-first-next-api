export interface UserLog{
    id ?: number;
    name: string;
    email: string;
    created_at?: string;
}
export interface ILogRepositary{
    getAllLogs():Promise<UserLog[]>;
    createLog(name: string,email: string): Promise<UserLog>;
}

export interface UserRecord{
    id: number;
    email: string;
    password_hash: string;
    created_at: Date;
}
export interface IUserRepository{
    createUser(email: string, password_hash: string): Promise<UserRecord>;
    findUserByEmail(email: string): Promise<UserRecord | null>;
    findUserById(id: number): Promise<UserRecord | null>;
}