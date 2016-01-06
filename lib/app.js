var fs = require('fs');
var path = require('path');
var color = require('bash-color');
var express = require('express');
var config = require('vpm-config');

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
                return console.warn(color.red('warnning: ' + conf.name + ' is not found ' + '[from /src/lib/extend.js line 13]'))
            }
            // 检查是否为Home.app
            if(conf.home && !system.HOME){
                route = '/';
                static = '/static';
                system.HOME = true;
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

        auto: function(){
            var sup = this;
            var JSONData = require(config.get('app.config'));
            JSONData.apps.forEach(this.reg);
        }
    }
}
