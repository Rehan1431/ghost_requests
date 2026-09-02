import { Request, Response, NextFunction } from 'express';

export function resilienceMiddleware(req: Request, res: Response, next: NextFunction) {
  const rand = Math.random();

  if (rand < 0.3) {
    const status = Math.random() > 0.5 ? 500 : 503;
    console.log(`[Simulation Engine] Dropping request ${req.method} ${req.path} with status ${status}`);
    return res.status(status).json({ error: 'Resilience Simulation Engine: Request dropped intentionally' });
  } else {
    const latency = Math.floor(Math.random() * (2500 - 300 + 1)) + 300;
    console.log(`[Simulation Engine] Simulating ${latency}ms latency for ${req.method} ${req.path}`);
    setTimeout(() => {
      next();
    }, latency);
  }
}
