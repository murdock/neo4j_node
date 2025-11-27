import express, { Request, Response } from 'express';
import { driver } from '@db/neo4j';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

interface PolicyBody { id: string; title: string }
interface ClauseBody { id: string; text: string; policyId: string }
interface RequirementBody { id: string; text: string; clauseId: string }

// --- CRUD Endpoints ---
app.post('/policy', async (req: Request<{}, {}, PolicyBody>, res: Response) => {
  const { id, title } = req.body;
  const session = driver.session();
  try {
    await session.run(
      'MERGE (p:Policy {id:$id}) SET p.title=$title',
      { id, title }
    );
    res.json({ ok: true });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
  finally { await session.close(); }
});

app.post('/clause', async (req: Request<{}, {}, ClauseBody>, res: Response) => {
  const { id, text, policyId } = req.body;
  const session = driver.session();
  try {
    await session.run(
      'MERGE (c:Clause {id:$id}) SET c.text=$text ' +
      'MERGE (p:Policy {id:$policyId}) MERGE (p)-[:HAS_CLAUSE]->(c)',
      { id, text, policyId }
    );
    res.json({ ok: true });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
  finally { await session.close(); }
});

app.post('/requirement', async (req: Request<{}, {}, RequirementBody>, res: Response) => {
  const { id, text, clauseId } = req.body;
  const session = driver.session();
  try {
    await session.run(
      'MERGE (r:Requirement {id:$id}) SET r.text=$text ' +
      'MERGE (c:Clause {id:$clauseId}) MERGE (c)-[:CONTAINS]->(r)',
      { id, text, clauseId }
    );
    res.json({ ok: true });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
  finally { await session.close(); }
});

// --- Graph Retrieval ---
app.get('/policy/:id/graph', async (req, res) => {
  const session = driver.session();
  try {
    const result = await session.run(
      `
      MATCH (p:Policy {id: $id})
      OPTIONAL MATCH path = (p)-[*]->(n)
      UNWIND nodes(path) AS node
      UNWIND relationships(path) AS rel
      WITH p, COLLECT(DISTINCT node) AS allNodes, COLLECT(DISTINCT rel) AS allRels
      RETURN allNodes + CASE WHEN NOT p IN allNodes THEN [p] ELSE [] END AS nodes, allRels AS relationships
      `,
      { id: req.params.id }
    );

    if (!result.records.length) {
      return res.json({ nodes: [], edges: [] });
    }

    const record = result.records[0];
    const rawNodes = record.get('nodes') as any[];
    const rawRels = record.get('relationships') as any[];

    const nodesMap = new Map<string, any>();
    rawNodes.forEach(node => {
      if (!node) return;
      const elementId = node.elementId;
      const graphId = node.properties.id || elementId;
      if (!nodesMap.has(elementId)) {
        nodesMap.set(elementId, { data: { id: graphId, label: node.labels[0], ...node.properties } });
      }
    });

    const edges: any[] = [];
    rawRels.forEach(r => {
      if (!r) return;
      const startElementId = r.startNodeElementId;
      const endElementId = r.endNodeElementId;
      if (nodesMap.has(startElementId) && nodesMap.has(endElementId)) {
        edges.push({
          data: {
            id: r.elementId,
            source: nodesMap.get(startElementId)!.data.id,
            target: nodesMap.get(endElementId)!.data.id,
            type: r.type
          }
        });
      }
    });

    res.json({
      nodes: Array.from(nodesMap.values()),
      edges
    });
  } catch (e: any) {
    console.error('Graph fetch error:', e.message);
    res.status(500).json({ error: e.message });
  } finally {
    await session.close();
  }
});

app.listen(3001, () => console.log('API running on http://localhost:3001'));
