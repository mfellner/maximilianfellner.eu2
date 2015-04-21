const router      = require('koa-router')();
const contentCtrl = require('../controllers/content-controller');

router.get('/api/content/:key', contentCtrl.pageContent);

module.exports = router.routes();
