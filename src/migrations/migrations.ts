import { driver } from "../db/neo4j.ts";
export async function runMigrations() {
const s = driver.session();
try {
    await s.run("CREATE CONSTRAINT policy_id IF NOT EXISTS FOR (p:Policy) REQUIRE p.id IS UNIQUE");
    await s.run("CREATE CONSTRAINT clause_id IF NOT EXISTS FOR (c:Clause) REQUIRE c.id IS UNIQUE");
    await s.run("CREATE CONSTRAINT requirement_id IF NOT EXISTS FOR (r:Requirement) REQUIRE r.id IS UNIQUE");
    await s.run("CREATE FULLTEXT INDEX requirement_search IF NOT EXISTS FOR (r:Requirement) ON EACH [r.text]");
    } finally { await s.close(); }
}