import type { NextFunction, Request, Response } from 'express';

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  console.error('[errorHandler]', error);
  if (res.headersSent) return;
  try {
    res.status(500).render('404', { title: '500 — Server Error' });
  } catch {
    res.status(500).send('Internal Server Error');
  }
}
