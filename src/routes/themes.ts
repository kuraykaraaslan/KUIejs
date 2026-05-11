import { Router } from 'express';
import commonRouter     from './themes/common';
import modemRouter      from './themes/modem';
import apiDocRouter     from './themes/api-doc';
import restaurantRouter from './themes/restaurant';
import invoiceRouter    from './themes/invoice';
import upsRouter        from './themes/ups';

const router = Router();

router.use('/common',     commonRouter);
router.use('/modem',      modemRouter);
router.use('/api-doc',    apiDocRouter);
router.use('/restaurant', restaurantRouter);
router.use('/invoice',    invoiceRouter);
router.use('/ups',        upsRouter);

router.get('/', (_req, res) => {
  res.redirect('/theme/common');
});

export default router;
