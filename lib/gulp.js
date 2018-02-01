/**
 * @authors       qzhongyou
 * @date          2018-01-31
 * @description 支持自动刷新服务端  支持服务端es6语法 todo 客户端自动刷新
 */

'use strict';
const gulp = require('gulp');
const project = foxtrel.project;
const config = foxtrel.config;
const vm = require("vm");

const projectRoot = project.getProjectRoot();

//gulp插件调用
const gulpLoadPlugins = require('gulp-load-plugins')();

//开发环境使用日志
const LOGPATH = project.getTempPath('log');

//服务端构建路径
const projectBuild = config.get('ServerOutputPath') || project.getProjectRoot('output');

//服务端入口文件
let projectServer = config.get('ServerEntryPath') || project.getProjectRoot('app/!(view)/**.js');
if (Array.isArray(projectServer)) {
    projectServer.push(__dirname + '/server.js');
} else {
    projectServer = [].concat(projectServer, __dirname + '/server.js');
}


gulp.task('build', function () {
    return gulp.src(projectServer)
    //过滤最新
        .pipe(gulpLoadPlugins.newer(projectBuild))
        .pipe(gulpLoadPlugins.change(performChange))
        //es6
        .pipe(gulpLoadPlugins.babel())
        .pipe(gulp.dest(projectBuild))
})


//nodemon.tasks no work
gulp.task('nodemon', ['build'], function () {
    return gulpLoadPlugins.nodemon({
        script: __dirname + '/boot.js',
        watch: projectBuild,
        ext: 'js',
        env: {
            "NODE_ENV": "development",
            "CWD": projectRoot,
            "LOGPATH": LOGPATH,
            "SERVER": foxtrel.config.get('serverFile')
        }
    })
})

gulp.task('watch', ['nodemon', 'build'], function () {
    let watcher = gulp.watch(projectServer, ['build'])
})

gulp.task('defalut', ['nodemon', 'build']);


function performChange(content, done) {
    let contentArr = content.match(/foxtrel\.config\.get\([\'\"]+[a-zA-Z0-9_\u4e00-\u9fa5\.]+[\'\"]+\)/g);
    if (Array.isArray(contentArr)) {
        for (let item of contentArr) {
            try {
                const script = new vm.Script(`(function(){return ${item}})`);
                const value = script.runInThisContext()();
                content = content.replace(item, (value && `'${value}'`));
            } catch (err) {
                console.log(err);
            }
        }
    }

    done(null, content);
}

module.exports = gulp;

