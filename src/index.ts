#!/usr/bin/env node
import { Command } from 'commander';
import { startMockServer } from './server';

const program = new Command();

program
  .name('ghost-env')
  .description('Zero-config local API proxy and dynamic mocking CLI tool')
  .option('-p, --port <number>', 'Port to listen on', '3000')
  .requiredOption('-s, --spec <path>', 'Path to OpenAPI YAML/JSON specification')
  .option('-r, --resilience', 'Enable Resilience Simulation Engine (latency and dropped requests)', false);

program.parse(process.argv);

const options = program.opts();

const port = parseInt(options.port, 10);
const specPath = options.spec;
const resilience = options.resilience;

startMockServer(port, specPath, resilience).catch(err => {
  console.error('Failed to start ghost-env:', err);
  process.exit(1);
});
