/**
 * @authors       qzhongyou
 * @date          2017-11-15
 * @description  启动文件
 */
const http = require('http');

http.createServer(function (req, res) {
    res.end('123');
}).listen(2119);
console.log(123);

process.on('SIGTERM',function(){
    console.log('SIGTERM');
    process.exit();
    // child.send('123');
});

process.on('message', (m) => {
    console.log('CHILD got message:', m);
    process.send({foo: 'bar'});
   // process.exit();
});

//todo 生产环境使用pm2
