// import { drizzle } from "drizzle-orm/mysql2";

// export const db = drizzle(process.env.DATABASE_URL);

import mysql from 'mysql2';
import { drizzle } from 'drizzle-orm/mysql2';
import { and, eq, gte, lt, sql } from 'drizzle-orm';

// Create a connection using mysql2
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'pass123',
  database: 'drizzle_db',
});

// Pass the *promise* version of the connection to drizzle
export const db = drizzle(connection.promise());

export const sqlMod = {
  lt,
  sql,
  eq,
  gte,
  and
};

