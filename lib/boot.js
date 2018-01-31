/**
 * @authors       qzhongyou
 * @date          2017-11-15
 * @description  启动文件
 */
'use strict';
const cluster = require('./culster');
const path = require('path');
const www = require.resolve(path.join(process.env.CWD, process.env.SERVER));

cluster({exec: www});
