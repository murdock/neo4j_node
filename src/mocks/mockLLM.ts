import express from "express";
import { driver } from '../db/neo4j.ts';

const app = express();
app.use(express.json());

app.post("/policy", (req, res) => {
  console.log("Policy received:", req.body);
  res.status(201).json(req.body);
});

app.post("/clause", (req, res) => {
  console.log("Clause received:", req.body);
  res.status(201).json(req.body);
});

app.post("/requirement", (req, res) => {
  console.log("Requirement received:", req.body);
  res.status(201).json(req.body);
});

export const startMockServer = () =>
  new Promise<void>((resolve) => {
    const server = app.listen(3000, () => {
      console.log("Mock LLM server listening on port 3000");
      resolve();
    });
  });

export async function mockLLMExtraction() {
  const session = driver.session();
  try {
    const policy = { id: "p1", title: "Security Policy" };
    await session.run(
      "MERGE (p:Policy {id:$id}) SET p.title=$title",
      policy
    );

    const clause = { id: "c1", text: "Passwords must be strong", policyId: policy.id };
    await session.run(
      "MERGE (c:Clause {id:$id}) SET c.text=$text " +
      "MERGE (p:Policy {id:$policyId}) MERGE (p)-[:HAS_CLAUSE]->(c)",
      clause
    );

    const requirement = { id: "r1", text: "Min length 12", clauseId: clause.id };
    await session.run(
      "MERGE (r:Requirement {id:$id}) SET r.text=$text " +
      "MERGE (c:Clause {id:$clauseId}) MERGE (c)-[:CONTAINS]->(r)",
      requirement
    );

    console.log("Mock data inserted into Neo4j");
  } finally {
    await session.close();
  }
}