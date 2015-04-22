const router      = require('koa-router')();
const contentCtrl = require('../controllers/content-controller');

router.get('/api/content/:key', contentCtrl.pageContent);
router.get('/api/db', contentCtrl.dbInfo);

module.exports = router.routes();
