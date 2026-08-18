import express from 'express';
import { createGhostProxy } from './proxy/proxyMiddleware';

/**
 * Sets up the Express server.
 */
export const app = express();

// Attach the proxy middleware for all incoming requests.
app.use('/', createGhostProxy());
