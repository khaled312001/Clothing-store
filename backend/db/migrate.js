import fs from 'node:fs';
import path from 'node:path';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Splits SQL into individual statements while respecting strings, comments,
// and multi-line CREATE TABLE blocks. Sufficient for our schema.sql.
function splitSql(sql) {
  const statements = [];
  let buf = '';
  let inSingle = false, inDouble = false, inBacktick = false, inLineComment = false, inBlockComment = false;
  for (let i = 0; i < sql.length; i++) {
    const c = sql[i], next = sql[i + 1];

    if (inLineComment) {
      if (c === '\n') inLineComment = false; else continue;
    } else if (inBlockComment) {
      if (c === '*' && next === '/') { inBlockComment = false; i++; }
      continue;
    } else if (inSingle) {
      buf += c;
      if (c === '\\' && next) { buf += next; i++; continue; }
      if (c === "'") inSingle = false;
      continue;
    } else if (inDouble) {
      buf += c;
      if (c === '\\' && next) { buf += next; i++; continue; }
      if (c === '"') inDouble = false;
      continue;
    } else if (inBacktick) {
      buf += c;
      if (c === '`') inBacktick = false;
      continue;
    } else {
      if (c === '-' && next === '-') { inLineComment = true; i++; continue; }
      if (c === '/' && next === '*') { inBlockComment = true; i++; continue; }
      if (c === "'") { inSingle = true; buf += c; continue; }
      if (c === '"') { inDouble = true; buf += c; continue; }
      if (c === '`') { inBacktick = true; buf += c; continue; }
      if (c === ';') {
        const trimmed = buf.trim();
        if (trimmed) statements.push(trimmed);
        buf = '';
        continue;
      }
    }
    buf += c;
  }
  if (buf.trim()) statements.push(buf.trim());
  return statements;
}

async function run() {
  const dbName = process.env.DB_NAME;
  const host   = process.env.DB_HOST || 'localhost';
  const isRemote = host !== 'localhost' && host !== '127.0.0.1';

  console.log(`→ Connecting to MySQL at ${host}:${process.env.DB_PORT || 3306}…`);

  // Local MySQL: try to create the database. Remote (Hostinger): assume it exists.
  if (!isRemote) {
    try {
      const root = await mysql.createConnection({
        host,
        port: Number(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
      });
      await root.query(
        `CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
      );
      console.log(`✓ Database '${dbName}' ready`);
      await root.end();
    } catch (e) {
      console.warn('⚠ Could not auto-create DB (skipping):', e.message);
    }
  } else {
    console.log(`↳ Remote host detected — using existing database '${dbName}'.`);
  }

  // Connect to the target DB and apply schema statement-by-statement
  const conn = await mysql.createConnection({
    host,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: dbName,
    connectTimeout: 30000,
  });

  const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  const statements = splitSql(sql);
  console.log(`→ Applying ${statements.length} SQL statements…`);

  let i = 0;
  for (const stmt of statements) {
    i++;
    try {
      await conn.query(stmt);
    } catch (err) {
      console.error(`✗ Statement #${i} failed:\n   ${stmt.split('\n')[0]}…\n   → ${err.message}`);
      throw err;
    }
  }

  console.log('✓ Schema migrated successfully');
  await conn.end();
}

run().catch((err) => {
  console.error('✗ Migration failed:', err.message);
  if (err.code === 'ETIMEDOUT' || err.code === 'ECONNREFUSED') {
    console.error('  ⚠ Cannot reach the MySQL server. For Hostinger:');
    console.error('    1. Open hPanel → Databases → Remote MySQL');
    console.error('    2. Add your current IP to the whitelist (or use "Any Host")');
  } else if (err.code === 'ER_ACCESS_DENIED_ERROR') {
    console.error('  ⚠ Wrong username/password, or your IP is not whitelisted.');
  }
  process.exit(1);
});
