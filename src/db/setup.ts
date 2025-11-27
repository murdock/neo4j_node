import { runMigrations } from '../migrations/migrations.ts';
import { mockLLMExtraction } from '../mocks/mockLLM.ts';

async function main() {
  await runMigrations();
  await mockLLMExtraction();
  console.log('DB ready with mock data');
  process.exit(0);
}

main().catch(console.error);
