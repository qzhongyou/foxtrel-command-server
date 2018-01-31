/**
 * @authors       qzhongyou
 * @date          2018-01-31
 * @description 支持自动刷新服务端  支持服务端es6语法 todo 客户端自动刷新
 */

'use strict';
const gulp = require('gulp');
const project = foxtrel.project;
const projectRoot = project.getProjectRoot();

//gulp插件调用
const gulpLoadPlugins = require('gulp-load-plugins')();

//服务端构建路径
const projectBuild = project.getProjectRoot('app');

//服务端入口文件
const projectServer = project.getProjectRoot('server/**/**.js');

//开发环境使用日志
const LOGPATH = project.getTempPath('log');


gulp.task('build', function () {
    return gulp.src([__dirname + '/server.js', projectServer])
    //过滤最新
        .pipe(gulpLoadPlugins.newer(projectBuild))
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
    let watcher = gulp.watch([__dirname + '/server.js', projectServer], ['build'])
})

gulp.task('defalut', ['nodemon', 'build']);

module.exports = gulp;

