#!/usr/bin/env node

import path from "node:path";
import process from "node:process";
import Database from "better-sqlite3";
import mysql from "mysql2/promise";

const ROOT = process.cwd();

const SQLITE_PATH = process.env.SQLITE_PATH || path.join(ROOT, "server", "data", "renora.sqlite");

const MYSQL_HOST = process.env.DB_HOST || "127.0.0.1";
const MYSQL_PORT = Number(process.env.DB_PORT || 3306);
const MYSQL_USER = process.env.DB_USERNAME || process.env.DB_USER || "root";
const MYSQL_PASSWORD = process.env.DB_PASSWORD || process.env.DB_PASS || "";
const MYSQL_DATABASE = process.env.DB_NAME || "renora";

async function main() {
  console.log(`Reading SQLite from: ${SQLITE_PATH}`);
  const sqlite = new Database(SQLITE_PATH, { readonly: true });

  const row = sqlite
    .prepare("SELECT json FROM content WHERE id = 1")
    .get();

  if (!row || typeof row.json !== "string") {
    throw new Error("SQLite content row not found (content.id=1). Nothing to migrate.");
  }

  console.log(`Connecting to MySQL: ${MYSQL_USER}@${MYSQL_HOST}:${MYSQL_PORT}/${MYSQL_DATABASE}`);

  const bootstrap = await mysql.createConnection({
    host: MYSQL_HOST,
    port: MYSQL_PORT,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
  });
  await bootstrap.query(`CREATE DATABASE IF NOT EXISTS \`${MYSQL_DATABASE}\``);
  await bootstrap.end();

  const pool = mysql.createPool({
    host: MYSQL_HOST,
    port: MYSQL_PORT,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
    connectionLimit: 4,
  });

  await pool.query(
    `CREATE TABLE IF NOT EXISTS content (
      id INT NOT NULL PRIMARY KEY,
      json LONGTEXT NOT NULL,
      updated_at DATETIME NOT NULL
    )`,
  );

  const nowIso = new Date().toISOString();
  await pool.query(
    "INSERT INTO content (id, json, updated_at) VALUES (1, ?, ?) ON DUPLICATE KEY UPDATE json = VALUES(json), updated_at = VALUES(updated_at)",
    [row.json, nowIso],
  );

  await pool.end();
  sqlite.close();

  console.log("Migration complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
