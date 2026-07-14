import { PostgresRepository } from "./postgresRepo";

// Swapping the storage layer!
// Our routes remain 100% untouched because PostgresRepository implements ILogRepositary.
export const logRepository = new PostgresRepository();
