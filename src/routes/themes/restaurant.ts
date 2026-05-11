import { Router, Request, Response } from 'express';
import { restaurantData } from '../../data/restaurant.data';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const activeCategory = (req.query.category as string) || null;
  res.render('theme/restaurant/index', {
    layout: 'layouts/blank',
    title: 'Menu — Tre Olive',
    data: restaurantData,
    activeCategory,
  });
});

router.get('/qr/:tableNumber', (req: Request, res: Response) => {
  const tableNumber = parseInt(req.params.tableNumber as string, 10) || 1;
  const table = restaurantData.tables.find(t => t.tableNumber === tableNumber) || restaurantData.tables[0];
  res.render('theme/restaurant/qr', {
    layout: 'layouts/blank',
    title: `Table ${tableNumber} — Tre Olive`,
    data: restaurantData,
    table,
    menuUrl: 'http://localhost:3000/theme/restaurant',
  });
});

router.get('/item/:id', (req: Request, res: Response) => {
  const item = restaurantData.menuItems.find(i => i.id === req.params.id);
  if (!item) { res.status(404).render('404', { layout: 'layouts/main', title: '404' }); return; }
  const related = restaurantData.menuItems.filter(i => i.category === item.category && i.id !== item.id).slice(0, 3);
  res.render('theme/restaurant/item', {
    layout: 'layouts/blank',
    title: `${item.name} — Tre Olive`,
    data: restaurantData,
    item,
    related,
  });
});

export default router;
