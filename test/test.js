var path = require('path');
var express = require('express');
var router = express.Router();

// 注册app.stats
module.exports = {
    name: 'test',
    router: router,
    static: path.join(__dirname, 'static')
}

router.get('/', function(req, res){
    res.status(200).send('12312')
})
