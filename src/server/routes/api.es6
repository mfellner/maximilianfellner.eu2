const router      = require('koa-router')();
const contentCtrl = require('../controllers/content.es6');

router.get('/api/db', contentCtrl.dbInfo);

module.exports = router.routes();
