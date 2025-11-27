import express, { Router, type Request, type Response } from 'express';
import { driver } from '../db/neo4j.js';

const router: Router = express.Router();

router.get('/search', async (req: Request, res: Response) => {
  const q = req.query.q as string;
  const s = driver.session();
  try {
    const cypher =
      "CALL db.index.fulltext.queryNodes('requirement_search', $q) YIELD node, score RETURN node, score";
    const r = await s.run(cypher, { q });
    res.json(r.records.map(x => x.toObject()));
  } finally {
    await s.close();
  }
});

export default router;
