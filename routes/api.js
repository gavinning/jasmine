var fs = require('fs');
var path = require('path');
var express = require('express');
var router = express.Router();
var lib = require('linco.lab').lib;
var user = require('../db/user.db');
var exec = require('child_process').exec;
var api = {};


api.deploy = function(req, res){
    var output, input, filename, filepath, arr, username, hash;

    hash = {
        gavinning: '/usr/local/app/resin_gavinning/webapps/ROOT',
        haixialiu: '/usr/local/app/resin_haixialiu/webapps/ROOT'
    };

    // 解析to参数
    arr = req.body.to.split(':');

    if(arr.length === 1){
        filepath = arr[0];
    };

    if(arr.length === 2){
        username = arr[0];
        filepath = arr[1];
    };

    // 检查是否已指定用户名
    if(!username || !hash[username]) return res.status(403).send('用户名错误');
    if(!filepath) return res.status(403).send('文件路径错误');

    // 合成最终文件路径
    filename = path.join(hash[username], filepath);

    try{
        // 创建写入路径
        lib.mkdir(path.dirname(filename));

        // 创建可写流
        input = fs.createReadStream(req.files.file.path);
        output = fs.createWriteStream(filename);
        input.pipe(output)

        output.on('close', function(){
            res.status(200).send('0')
        })

    }catch(e){
        throw e
    }
};

api.stream = function(req, res){
    var output, dirname;

    if(!req.headers.filepath){
        return res.send(500, '文件路径不存在')
    }

    // 检查文件路径
    if(!isSafePath(req.headers.filepath)){
        return res.send(502, '文件路径溢出')
    }

    // 登录认证
    if(req.headers.username && user[req.headers.username] == req.headers.password){

        // 检查目标路径是否存在
        dirname = path.dirname(req.headers.filepath);
        if(!lib.isDir(dirname))
            lib.mkdir(dirname)

        // 创建可写流
        output = fs.createWriteStream(req.headers.filepath);
        req.pipe(output)
        req.on('end', function(){
            res.set('msg', 'written: ' + req.headers.filepath);
            res.end();;
        })
    }else{
        res.send(501, '登录失败');
    }

    // 检查安全路径
    function isSafePath(src){
        var safePath = [
            // app.project,
            '/usr/local/app/resin_\\w+/webapps'
        ]

        return safePath.some(function(item){
            return !!src.match(new RegExp(item))
        })
    }
};

// 发布接口
router.post('/deploy', api.deploy);

// 上传api
router.post('/stream', function(req, res){
    req.query.deploy ? api.deploy(req, res) : api.stream(req, res);
});

router.get('/test', function(req, res){
    res.send('123')
});

module.exports = router;
