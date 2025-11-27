import neo4j, { Driver } from "neo4j-driver";
import 'dotenv/config';

const isDocker = process.env.DOCKER === "true";

const host = process.env.NEO4J_URI
  || (isDocker ? "neo4j" : "127.0.0.1");

const user = process.env.NEO4J_USER || "neo4j";
const pass = process.env.NEO4J_PASS || "password";

export const driver: Driver = neo4j.driver(
  `bolt://${host}:7687`,
  neo4j.auth.basic(user, pass)
);
