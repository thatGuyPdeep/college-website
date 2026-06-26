#!/usr/bin/env node
import pg from "pg";
import "dotenv/config";

const { Client } = pg;
const password = encodeURIComponent(process.env.SUPABASE_DB_PASSWORD ?? "RKMN@2026;;");
const ref = process.env.NEXT_PUBLIC_SUPABASE_URL?.match(/https:\/\/([^.]+)/)?.[1] ?? "ngccdhdnijrupubzbell";
const connection = `postgresql://postgres:${password}@db.${ref}.supabase.co:5432/postgres`;

const client = new Client({ connectionString: connection, ssl: { rejectUnauthorized: false } });
await client.connect();

await client.query(`ALTER TYPE faculty_app_status ADD VALUE IF NOT EXISTS 'accepted'`);

const { rows } = await client.query(`
  SELECT enumlabel
  FROM pg_enum e
  JOIN pg_type t ON e.enumtypid = t.oid
  WHERE t.typname = 'faculty_app_status'
  ORDER BY enumsortorder
`);
console.log("faculty_app_status values:", rows.map((r) => r.enumlabel).join(", "));

await client.end();
