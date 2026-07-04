// Runs SQL against the Supabase database using SUPABASE_DB_URL.
// Source order: process.env, then .env.local, then .env (all gitignored except .env.example).
//
// Usage (from project root):
//   node scripts/db.mjs path/to/file.sql        run a .sql file
//   node scripts/db.mjs -c "select 1"           run inline SQL
import pg from "pg";
import { readFileSync, existsSync } from "fs";

function loadDbUrl() {
  if (process.env.SUPABASE_DB_URL) return process.env.SUPABASE_DB_URL;
  for (const f of [".env.local", ".env"]) {
    if (existsSync(f)) {
      const m = readFileSync(f, "utf8").match(/^SUPABASE_DB_URL=(.+)$/m);
      if (m) return m[1].trim();
    }
  }
  throw new Error("SUPABASE_DB_URL not set (checked env, .env.local, .env).");
}

const args = process.argv.slice(2);
let sql;
if (args[0] === "-c") sql = args.slice(1).join(" ");
else if (args[0]) sql = readFileSync(args[0], "utf8");
else {
  console.error('Usage: node scripts/db.mjs <file.sql> | -c "SQL"');
  process.exit(1);
}

const client = new pg.Client({ connectionString: loadDbUrl(), ssl: { rejectUnauthorized: false } });
await client.connect();
try {
  const res = await client.query(sql);
  for (const r of Array.isArray(res) ? res : [res]) {
    if (r.rows && r.rows.length) console.table(r.rows);
    else console.log(r.command ?? "OK", r.rowCount ?? "");
  }
} catch (e) {
  console.error("SQL error:", e.message);
  process.exit(1);
} finally {
  await client.end();
}
