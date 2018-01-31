/**
 * @authors       qzhongyou
 * @date          2017-11-15
 * @description   server
 */

'use strict';

exports.name = 'server <command>';

exports.usage = '<command> [options]';

exports.desc = 'launch a node server';


exports.register = function (commander) {
    commander
        .option('-e,--env <names>', 'compile environment', String, 'dev')
        .option('-d, --dest <path>', 'output destination', String, '')
        .option('-f,--file <filename>', 'config file', String, 'foxtrel.config.js')
        .option('-r, --root <names>', 'set project root', String, process.cwd())
        .action(server);
}


function server(command, options) {

    //设置项目根目录
    foxtrel.project.setProjectRoot(options.root);

    foxtrel.config.set('serverFile', command);
    const gulp = require('./lib/gulp');

    if (process.env.NODE_ENV != 'product') {
        gulp.start('watch');
    } else {
        gulp.start('build');
    }
}
