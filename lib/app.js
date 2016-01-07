var fs = require('fs');
var path = require('path');
var color = require('bash-color');
var express = require('express');
var config = require('vpm-config');

// 注册子App
// 默认App路由：/g/:app.name
// 默认App静态：/static/:app.name
module.exports = function(system){
    return {
        reg: function(conf){
            var app, route, static;
            try{
                // 尝试解析app
                app = require(conf.path);
                app.path = conf.path;
            }
            // 报警信息
            catch(e){
                throw e;
                return console.error(color.red(e.message), 'from', conf.name, '/lib/app.js 21');
            }
            // 检查是否为Home.app
            if(conf.home && !system.HOME){
                route = '/';
                static = '/static';
                system.HOME = app;
            }
            // 普通app
            else{
                route = path.join(config.get('app.route'), app.name);
                static = path.join(config.get('app.static'), app.name);
            }
            // 注册app
            system.app[app.name] = app;
            system.use(route, app.router)
            system.use(static, express.static(app.static))
        },

        // 自动注册配置文件内的所有app
        auto: function(){
            var sup = this;
            var JSONData = require(config.get('app.config'));
            JSONData.apps.forEach(this.reg);
        }
    }
}
