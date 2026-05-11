import { Router, Request, Response } from 'express';
import { upsData } from '../../data/ups.data';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.render('theme/ups/index', { layout: 'layouts/blank', title: 'Dashboard — UPS Management', state: upsData });
});

router.get('/outlets', (_req: Request, res: Response) => {
  res.render('theme/ups/outlets', { layout: 'layouts/blank', title: 'Outlets — UPS Management', state: upsData });
});

router.get('/events', (req: Request, res: Response) => {
  const severityFilter = (req.query.severity as string) || 'ALL';
  const events = severityFilter === 'ALL'
    ? upsData.eventLog
    : upsData.eventLog.filter(e => e.severity === severityFilter);
  res.render('theme/ups/events', { layout: 'layouts/blank', title: 'Event Log — UPS Management', state: upsData, events, severityFilter });
});

router.get('/settings', (_req: Request, res: Response) => {
  res.render('theme/ups/settings', { layout: 'layouts/blank', title: 'Settings — UPS Management', state: upsData });
});

export default router;
