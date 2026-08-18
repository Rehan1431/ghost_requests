import express from 'express';
import { createGhostProxy } from './proxy/proxyMiddleware';

export const app = express();

app.use('/', createGhostProxy());
