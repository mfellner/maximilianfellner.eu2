const router      = require('koa-router')();
const contentCtrl = require('../controllers/content');

router.get('/api/content/:key', contentCtrl.pageContent);
router.get('/api/db', contentCtrl.dbInfo);

module.exports = router.routes();
