import express from 'express';
import createError from 'http-errors';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import helmet from 'helmet';
import { paymentRouter, homeRouter, testRouter } from './routes';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackConfig from '../../webpack.config';
import {config} from 'dotenv';
config();

const app = express();

// webpack on development
if(process.env.NODE_ENV === 'development') {
    app.use(webpackDevMiddleware(webpack(webpackConfig)));
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            frameAncestors: [
                "'self'",
                "*.ecwid.com"
            ],
            frameSrc: [
                "'self'",
                "*.ecwid.com"
            ],
            childSrc: [
                "'self'",
                "*.ecwid.com"
            ],
            defaultSrc: [
                "'self'",
                "'unsafe-inline'",
                "*.ecwid.com",
                "*.cloudfront.net",
                "data:"
            ],
            blockAllMixedContent: [],
            upgradeInsecureRequests: []
        }
    },
    frameguard: false
}));
app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/static', express.static(path.join(__dirname, '..', '..', 'dist', 'static')));

// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

function removeFrameguard (req, res, next) {
    res.removeHeader('X-Frame-Options')
    next()
}

app.use('/payment', paymentRouter);
app.use('/', removeFrameguard, homeRouter);
app.use('/test', testRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
  

app.listen(process.env.PORT || 3000, () => {
    console.log('server started: http://localhost:3000')
});
