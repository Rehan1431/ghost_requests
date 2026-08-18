// @ts-nocheck
import { createProxyMiddleware } from 'http-proxy-middleware';
import { TARGET_URL } from '../config';
import { findMatchingSchema } from '../openapi/routeMatcher';
import { generateMockData } from '../mocker/generator';
import { Request, Response, RequestHandler, NextFunction } from 'express';

export function createGhostProxy(): RequestHandler {
  return createProxyMiddleware({
    target: TARGET_URL,
    changeOrigin: true,
    on: {
      error: (err: any, req: Request, res: Response | any) => {
        if ((err as any).code === 'ECONNREFUSED') {
          console.log(`[Ghost-Environment] Target ${TARGET_URL} is down (ECONNREFUSED).`);
          console.log(`[Ghost-Environment] Attempting to generate mock for ${(req as any).method} ${(req as any).url}`);
          
          try {
            const path = (req as any).path || (req as any).url;
            const schema = findMatchingSchema(path, (req as any).method);

            if (schema) {
              const mockData = generateMockData(schema);
              
              res.status(200);
              res.setHeader('Content-Type', 'application/json');
              res.setHeader('X-Ghost-Environment', 'true');
              res.end(JSON.stringify(mockData));
              
              console.log(`[Ghost-Environment] Successfully returned mock data for ${(req as any).method} ${(req as any).url}`);
            } else {
              res.status(404);
              res.setHeader('Content-Type', 'application/json');
              res.setHeader('X-Ghost-Environment', 'true');
              res.end(JSON.stringify({
                error: 'Not Found',
                message: `No matching OpenAPI schema found for ${(req as any).method} ${(req as any).url} to generate a mock response.`
              }));
              
              console.log(`[Ghost-Environment] No schema found for ${(req as any).method} ${(req as any).url}`);
            }
          } catch (mockError) {
            console.error('[Ghost-Environment] Error generating mock data:', mockError);
            if (!res.headersSent) {
              res.status(500).end('Internal Server Error inside Ghost-Environment');
            }
          }
        } else {
          if (!res.headersSent) {
            res.writeHead(502, { 'Content-Type': 'text/plain' });
            res.end(`Proxy error: ${(err as any).message}`);
          }
        }
      }
    }
  }) as unknown as RequestHandler;
}
