// @ts-nocheck
import { createProxyMiddleware } from 'http-proxy-middleware';
import { TARGET_URL } from '../config';
import { findMatchingSchema } from '../openapi/routeMatcher';
import { generateMockData } from '../mocker/generator';
import { Request, Response, RequestHandler, NextFunction } from 'express';

/**
 * Creates the proxy middleware that routes traffic to the target URL
 * and intercepts ECONNREFUSED errors to serve OpenAPI mocks instead.
 */
export function createGhostProxy(): RequestHandler {
  return createProxyMiddleware({
    target: TARGET_URL,
    changeOrigin: true,
    // Provide a custom error handler to intercept specific proxy errors using v3 syntax
    on: {
      error: (err: any, req: Request, res: Response | any) => {
        // Check if the target server is down/unreachable
        if ((err as any).code === 'ECONNREFUSED') {
          console.log(`[Ghost-Environment] Target ${TARGET_URL} is down (ECONNREFUSED).`);
          console.log(`[Ghost-Environment] Attempting to generate mock for ${(req as any).method} ${(req as any).url}`);
          
          try {
            // Express populates req.path with the path part of the URL, without the query string
            const path = (req as any).path || (req as any).url;
            
            // Try to find a matching OpenAPI schema for this route and method
            const schema = findMatchingSchema(path, (req as any).method);

            if (schema) {
              // Generate mock data using Faker
              const mockData = generateMockData(schema);
              
              // Send the mocked response
              res.status(200);
              res.setHeader('Content-Type', 'application/json');
              // Add custom header so clients know this is a mocked response
              res.setHeader('X-Ghost-Environment', 'true');
              res.end(JSON.stringify(mockData));
              
              console.log(`[Ghost-Environment] Successfully returned mock data for ${(req as any).method} ${(req as any).url}`);
            } else {
              // Fallback if we cannot find a matching schema in the OpenAPI document
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
          // For other types of proxy errors, return a standard 502 Bad Gateway
          if (!res.headersSent) {
            res.writeHead(502, { 'Content-Type': 'text/plain' });
            res.end(`Proxy error: ${(err as any).message}`);
          }
        }
      }
    }
  }) as unknown as RequestHandler;
}
