import Router     from 'koa-router';
import { dbInfo } from '../controllers/content.es6';

const router = Router();

router.get('/api/db', dbInfo);

export default router.routes();
