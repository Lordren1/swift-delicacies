import { DatabaseSync } from 'node:sqlite';

const db = new DatabaseSync('meals.db');

export default db;