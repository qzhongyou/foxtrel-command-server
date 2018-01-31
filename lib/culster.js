/**
 * @authors       qzhongyou
 * @date          2017-11-15
 * @description   culster集群 暂时dev环境使用
 */

'use strict';
const path = require('path');
const logger = require('./logger')(path.join(process.env.LOGPATH, 'server.log'));


/**
 * @description         Windows多进程
 * @param options       入参
 */

function win32Process(options) {
    const fork = require('child_process').fork;
    const len = options.count || require('os').cpus.length();
    const respawn = options.respawn;
    let workers = [];

    for (let i = 0; count > i; i++) {
        creatework();
    }

    function creatework() {
        let work = fork(options.exec, {silent: true});
        logger.write(`Create a new worker ${work.pid}`);
        workers.push(work);
        logger.takecare(worker.stdout);
        logger.takecare(worker.stderr);
        worker.stderr.pipe(process.stderr);

        work.on("exit", function (code, signal) {
            logger.write(`worker ${worker.pid} died ${signal || code}`);
            //删除
            let index = workers.indexOf(worker);
            ~index && workers.splice(index, 1);
            //重启
            if (respawn) {
                logger.write(`worker ${respawn ? 'restarting' : ''}`);
                creatework();
            }
        })
    }

    function killworkAll(signal) {
        for (let i = 0; workers.length > i; i++) {
            workers[i].removeAllListeners();
            process.kill(workers[i].pid, signal);
        }
    }

    // kill()默认SIGTERM
    process.on('SIGTERM', function () {
        logger.write('QUIT received, will exit once all workers have finished current requests.');
        killworkAll('SIGTERM');
    });

    //exit 虽然程序会立刻退出,无法收集日志,但是可以关闭子进程,如果不设置,执行`process.exit();`子进程将无法关闭
    process.on('exit', function () {
        logger.write('QUIT received, will exit once all workers have finished current requests.');
        killworkAll('SIGTERM');
    });

    process.on('uncaughtException', function (error) {
        logger.write(`UncaughtException: ${error}.`);
    });
}


/**
 * @description         culster
 * @param options       入参
 */
function culster(options) {
    const cluster = require("cluster");
    const count = options.count || require('os').cpus().length;
    const respawn = options.respawn;
    let workers = [];

    //为logger使用stdout,stderr日志收集,设置silent为true
    cluster.setupMaster({
        exec: options.exec,
        silent: true
    });


    for (let i = 0; count > i; i++) {
        creatework();
    }

    function creatework() {
        let worker = cluster.fork();
        logger.write(`Create a new worker ${worker.pid}`);
        workers.push(worker);
        logger.takecare(worker.process.stdout);
        logger.takecare(worker.process.stderr);
        worker.process.stderr.pipe(process.stderr);

    }

    function killworkAll(signal) {
        for (let i = 0; workers.length > i; i++) {
            workers[i].removeAllListeners();
            workers[i].process.kill(signal);
        }
    }


    cluster.on("exit", function (worker, code, signal) {
        logger.write(`worker ${worker.process.pid} died ${signal || code}`);
        //删除
        let index = workers.indexOf(worker);
        ~index && workers.splice(index, 1);
        //重启
        if (respawn) {
            logger.write(`worker ${respawn ? 'restarting' : ''}`);
            creatework();
        }

    })

    // kill()默认SIGTERM
    process.on('SIGTERM', function () {
        logger.write('QUIT received, will exit once all workers have finished current requests.');
        killworkAll('SIGTERM');
        process.exit();
    })

    //捕获异常
    process.on('uncaughtException', function (error) {
        logger.write(`UncaughtException: ${error}.`);
    });

    process.on('exit', function () {
        killworkAll('SIGTERM');
    });
}


if (process.platform.indexOf('win') === 0) {
    module.exports = win32Process;
} else {
    module.exports = culster;
}
