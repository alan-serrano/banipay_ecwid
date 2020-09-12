import express from 'express';
import createError from 'http-errors';
import path from 'path';
import clientRouter from './routes/payment';
import homeRouter from './routes/home';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/static', express.static(path.join(__dirname, '..', '..', 'dist', 'static')));

app.use('/payment', clientRouter);
app.use('/', homeRouter);

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
