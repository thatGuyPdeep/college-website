// Run: node scripts/migrate.mjs
import pg from "pg";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const { Client } = pg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PASSWORD = encodeURIComponent("RKMN@2026;;");
const CONNECTION = `postgresql://postgres:${PASSWORD}@db.ngccdhdnijrupubzbell.supabase.co:5432/postgres`;

const MIGRATIONS = [
  "001_initial_schema.sql",
  "002_admissions_backend.sql",
  "003_otp_codes.sql",
  "004_programs_and_storage.sql",
];

// Errors we can safely skip (idempotent re-runs)
const SKIP_PATTERNS = [
  "already exists",
  "duplicate key",
  "relation .* already exists",
  "type .* already exists",
  "column .* of relation .* already exists",
  "trigger .* already exists",
  "policy .* already exists",
  "multiple default values",
];
function isSkippable(msg) {
  return SKIP_PATTERNS.some(p => new RegExp(p, "i").test(msg));
}

/**
 * Split a SQL file into individual statements.
 * Handles $$ dollar-quote blocks so they are kept whole.
 */
function splitStatements(sql) {
  const statements = [];
  let current = "";
  let inDollarQuote = false;
  let dollarTag = "";

  const lines = sql.split("\n");
  for (const line of lines) {
    // Skip standalone comment lines
    const trimmed = line.trim();
    if (!inDollarQuote && (trimmed.startsWith("--") || trimmed === "")) {
      current += line + "\n";
      continue;
    }

    // Detect dollar quote start/end
    const dollarMatch = line.match(/\$\w*\$/g);
    if (dollarMatch) {
      for (const tag of dollarMatch) {
        if (!inDollarQuote) { inDollarQuote = true; dollarTag = tag; }
        else if (tag === dollarTag) { inDollarQuote = false; dollarTag = ""; }
      }
    }

    current += line + "\n";

    if (!inDollarQuote && trimmed.endsWith(";")) {
      const stmt = current.trim();
      if (stmt && stmt !== ";") statements.push(stmt);
      current = "";
    }
  }
  if (current.trim()) statements.push(current.trim());
  return statements.filter(s => s.replace(/--[^\n]*/g, "").trim().length > 1);
}

async function run() {
  const client = new Client({ connectionString: CONNECTION, ssl: { rejectUnauthorized: false } });

  try {
    console.log("Connecting to Supabase…");
    await client.connect();
    console.log("Connected ✓\n");

    for (const file of MIGRATIONS) {
      const filePath = path.join(__dirname, "..", "db", "migrations", file);
      if (!fs.existsSync(filePath)) { console.log(`⚠  Skipping ${file} (not found)`); continue; }

      const sql = fs.readFileSync(filePath, "utf8");
      const statements = splitStatements(sql);
      console.log(`Running ${file} (${statements.length} statements)…`);

      let ok = 0, skipped = 0, errors = 0;
      for (const stmt of statements) {
        try {
          await client.query(stmt);
          ok++;
        } catch (err) {
          if (isSkippable(err.message)) {
            skipped++;
          } else {
            errors++;
            const preview = stmt.replace(/\s+/g, " ").slice(0, 80);
            console.error(`  ✗ ${err.message.trim()}`);
            console.error(`    ↳ ${preview}`);
          }
        }
      }
      console.log(`  ✓ applied=${ok}  skipped(existing)=${skipped}  errors=${errors}\n`);
    }

    console.log("Done ✓");
  } finally {
    await client.end();
  }
}

run().catch(err => { console.error("Fatal:", err.message); process.exit(1); });
