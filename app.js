var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var testRouter = require('./routes/dbtest')
var indexRouter = require('./routes/index');
var RegistrationRouter = require('./routes/register');
var userInfoRouter = require('./routes/userinfo');
var paymentVerificationRouter = require('./routes/verifypayment');
var purchaseStorageRouter = require('./routes/storepurchase');
var transactionPricesRouter = require('./routes/dataprices');
var pendingOrdersRouter = require('./routes/pendingorders');
var approveOrderRouter = require('./routes/approveorder');
var allOrdersRouter = require('./routes/allorders');
var checkAdminRouter = require('./routes/checkadmin');
var getAllNeworkDataPricesRouter = require('./routes/getallnetworkprices');
var addAdminRouter = require('./routes/addusertoadmin');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/dbtest', testRouter);
app.use('/api/register', RegistrationRouter);
app.use('/api/user', userInfoRouter);
app.use('/api/user/verifypayment', paymentVerificationRouter);
app.use('/api/user/storepurchases', purchaseStorageRouter);
app.use('/api/user/transactionprices', transactionPricesRouter);
app.use('/api/checkadmin', checkAdminRouter);
app.use('/api/admin/transactions/allorders', allOrdersRouter);
app.use('/api/admin/transactions/pendingorders', pendingOrdersRouter);
app.use('/api/admin/transactions/approveorder', approveOrderRouter);
app.use('/api/admin/getallnetworkprices', getAllNeworkDataPricesRouter);
app.use('/api/addusertoadmin', addAdminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;