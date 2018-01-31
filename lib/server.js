const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
const http =require('http');
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}
const _config = require('./config');
const _config2 = _interopRequireDefault(_config).default;
const _routes = require('./routes/routes');
const _routes2 = _interopRequireDefault(_routes).default;
const _middles = require('./middleware/index');
const _middles2 = new (_interopRequireDefault(_middles).default)();

//todo 暂时使用ejs
var ejs = require('ejs');
app.engine('html', ejs.__express);
app.set('views', './dist');
app.set('view engine', 'html');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/assets',express.static(_config2.static));
app.use(session({
    secret:'keys',
    name: 'sid',
    rolling: true,
    resave: true,
    saveUninitialized: false
}));

//全局config
app.locals.config = _config2;

//路由
_routes2(app);

//404
app.use(_middles2.notFound);
//500
app.use(_middles2.Error500);

const server = http.createServer(app).listen(_config2.port || 3110, function () {
    let addr = server.address();
    console.log('Listening on ' + addr.port);
});


if (process.env.NODE_ENV != 'product') {
    process.on('SIGTERM', function () {
        process.exit();
    });
}
