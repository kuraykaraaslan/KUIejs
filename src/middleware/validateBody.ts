import type { NextFunction, Request, Response } from 'express';
import type { ZodSchema, ZodError } from 'zod';

/**
 * Express middleware factory for server-side form validation with Zod.
 *
 * Usage in a route file:
 *   import { validateBody } from '../middleware/validateBody';
 *   import { z } from 'zod';
 *
 *   const ContactSchema = z.object({
 *     name:    z.string().min(1, 'Name is required'),
 *     email:   z.string().email('Invalid email'),
 *     message: z.string().min(10, 'Message too short'),
 *   });
 *
 *   router.post('/contact', validateBody(ContactSchema), (req, res) => {
 *     // req.body is typed and validated here
 *     res.render('contact-success', { name: req.body.name });
 *   });
 *
 *   // Re-render form with errors (next('route') skips to this handler):
 *   router.post('/contact', (req, res) => {
 *     res.render('contact', {
 *       errors: res.locals.errors,
 *       values: res.locals.values,
 *     });
 *   });
 *
 * When validation fails:
 *   - res.locals.errors is set to Zod's fieldErrors map
 *     (Record<string, string[]> — each key is a field name)
 *   - res.locals.values is set to the raw req.body (for re-populating the form)
 *   - next('route') is called to skip to the next matching route handler
 *     (which should re-render the form with errors)
 */
export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (result.success) {
      req.body = result.data as T;
      next();
      return;
    }
    const zodError = result.error as ZodError;
    res.locals.errors = zodError.flatten().fieldErrors as Record<string, string[]>;
    res.locals.values = req.body as Record<string, unknown>;
    next('route');
  };
}
