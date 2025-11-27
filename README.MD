# Neo4j Policy Graph MVP

This project demonstrates a simple AI-assisted **policy management graph** using **Neo4j**, **Node.js (TypeScript)**, and a **React (Vite) graph viewer**.

![alt text](https://github.com/murdock/neo4j_node/blob/develop/Screenshot%202025-11-27%20at%2017.06.56.png?raw=true)

## Features

* Store **Policies**, **Clauses**, and **Requirements** in a Neo4j graph
* Extract mock data via a simulated LLM extraction
* Full-text search for Requirements (`/search?q=`)
* Interactive graph viewer using **Cytoscape.js**
* Migrations runner to create **constraints** and **indexes**
* Dockerized backend + Neo4j + frontend for easy setup
* TypeScript + path aliases for cleaner imports

## Prerequisites (Local Setup)

1. Install **Node.js 20+** and **pnpm**
2. Install **Neo4j Desktop** (or community server)

   * Start a database
   * Note credentials (username/password)
   * Browser available at `http://localhost:7474`
   
3. Clone repo:

```bash
git clone <repo-url>
cd <repo-name>
```

## Local Run (without Docker)

```bash
pnpm install
pnpm start
```

* API: [http://localhost:3001](http://localhost:3001)
* Frontend (Vite): [http://localhost:5173](http://localhost:5173)
* Neo4j Browser: [http://localhost:7474](http://localhost:7474)

---

## Docker Setup

```bash
docker-compose up --build
```

* API: [http://localhost:3001](http://localhost:3001)
* Frontend (Vite): [http://localhost:5173](http://localhost:5173)
* Neo4j Browser: [http://localhost:7474](http://localhost:7474)

---

## Sample API Requests

**Create Policy**

```curl -X POST http://localhost:3001/policy \
-H "Content-Type: application/json" \
-d '{
  "id": "policy-001",
  "title": "Data Privacy Policy"
}'
```

**Create Clause**

```
curl -X POST http://localhost:3001/clause \
-H "Content-Type: application/json" \
-d '{
  "id": "clause-001",
  "text": "All user data must be encrypted at rest.",
  "policyId": "policy-001"
}'
```

**Create Requirement**

```
curl -X POST http://localhost:3001/requirement \
-H "Content-Type: application/json" \
-d '{
  "id": "req-001",
  "text": "Use AES-256 encryption for database storage.",
  "clauseId": "clause-001"
}'

```

**Full Graph for Policy**

```
curl http://localhost:3001/policy/policy-001/graph
```

**Search Requirements**

```http
GET /search?q=password
```

---

## React Graph Viewer Usage

```tsx
import ReactGraphViewer from '@components/ReactGraphViewer';

<ReactGraphViewer policyId="p1" />
```

* Interactive graph with Policies, Clauses, Requirements
* Uses **Cytoscape.js**

---

## Notes

* All modules use **ESM imports**. Ensure `package.json` includes:

```json
{
  "type": "module"
}
```

* Mock LLM simulates AI extraction. Replace with real LLM integration as needed.
* Path aliases (`@db`, `@routes`, `@migrations`, `@mocks`, `@components`) make imports cleaner.

---

## Future Enhancements

* Connect real LLM for dynamic document ingestion
* Enhance graph visualization (colors, edge types, layouts)
* Implement authentication & authorization
* Expand sample data for demo purposes
