import express from 'express';
import SwaggerParser from '@apidevtools/swagger-parser';
import { handleMockRequest } from './mocker';
import { resilienceMiddleware } from './simulation';

export async function startMockServer(port: number, specPath: string, enableSimulation: boolean) {
  console.log(`[Ghost-Environment] Loading OpenAPI spec from ${specPath}...`);
  
  const api = await SwaggerParser.dereference(specPath);
  console.log(`[Ghost-Environment] Spec loaded successfully: ${(api as any).info?.title}`);

  const app = express();

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  if (enableSimulation) {
    console.log('[Ghost-Environment] Resilience Simulation Engine is ENABLED');
    app.use(resilienceMiddleware);
  }

  app.all('*', (req, res) => handleMockRequest(req, res, api));

  app.listen(port, '0.0.0.0', () => {
    console.log(`[Ghost-Environment] Server listening on http://127.0.0.1:${port}`);
  });
}
