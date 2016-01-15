var fs = require('fs');
var path = require('path');
var lib = require('linco.lab').lib;
var showdown = require('showdown');
var markdown = new showdown.Converter();
var xssFilters = require('xss-filters');

// 中间件核心
function middleware(req, res, next) {
    res.renderMD = render;
    next();
}

// 渲染Markdown方法
function render(file, opt){
    var md;
    var html;
    var filepath;
    var filecontent;
    var opt = opt || {};
    // 获取获取Markdown views路径
    var fileRoot = opt.views || system.get('md views');
    // 获取Markdown layout路径，可以是 jade/ejs/html 文件
    var fileLayout = opt.layout || system.get('md layout');
    // 获取占位符信息
    var placeholder = opt.placeholder || system.get('md placeholder') || '$$markdown$';

    // 检查是否为绝对路径
    lib.isAbsolute(file) ?
        // 绝对路径直接赋值
        filepath = file:
        // 检查是否存在根目录
        fileRoot ?
            // 拼接最终路径
            filepath = path.join(fileRoot, file):
            // 默认值
            filepath = file;

    // 检查是否为MD文件
    path.extname(filepath) === '.md' ? '' : filepath += '.md';

    try{
        // 编译Markdown layout文件
        html = compile(fileLayout, opt);
        // 获取Markdown源文件
        md = fs.readFileSync(filepath, 'utf-8');
        // 编译Markdown文件并执行XSS过滤
        filecontent = xssFilters.inHTMLComment(markdown.makeHtml(md));
        // 合并Markdown文件、Markdown layout文件
        html = html.replace(placeholder, filecontent);
        // 响应请求
        this.status(200).send(html);
    }
    catch(e){
        this.status(404).render('error', {
          message: 'Not found',
          error: {}
        });
    }
}

// 根据文件类型调用编译引擎
function compile(file, options){
    switch(path.extname(file)){
        case '.ejs':
            return ejsEngine(file, options);
            break;
        case '.jade':
            return jadeEngine(file, options);
            break;
        case '.html':
            return htmlEngine(file, options);
            break;
    }
}

// Engine for html
function htmlEngine(file, options){
    return fs.readFileSync(file, 'utf-8');
}

// Engine for jade
function jadeEngine(file, options){
    var jade = require('jade');
    return jade.renderFile(file, options);
}

// Engine for ejs
function ejsEngine(file, options){
    var ejs = require('ejs');
    return ejs.renderFile(file, options);
}

module.exports = middleware;
