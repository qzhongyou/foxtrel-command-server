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
        .option('-p, --port <int>', 'server listen port', parseInt, 8080)
        .option('-e,--env <names>', 'compile environment', String, 'dev')
        .action(server);
}


function server(command, options) {

    require('./lib/boot')(command, options);

}