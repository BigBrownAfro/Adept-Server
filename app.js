var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');
var productsRouter = require('./routes/products')//Temp

// connect to the mongoDB collection
var mongoConnected = false;
mongoose.connect(
  'mongodb+srv://BigBrownAfro:4422@cluster0.z2hdg.azure.mongodb.net/testDB?retryWrites=true&w=majority',
  {
    useNewUrlParser: true, 
    useUnifiedTopology: true 
  }
).then(res => {
  console.log("Connection to database made.");
  mongoConnected = true;
}).catch(err => {
  console.log("Failed to connect to database: ");
  console.log(err);
  mongoConnected = false;
});

// start express
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === 'OPTIONS'){
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/products', productsRouter);//Temp

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

//To run
//$env:DEBUG='myapp:*'; npm start
//To connect to mongoDB (replace <password> and <dbname>)
//mongodb+srv://BigBrownAfro:<password>@cluster0.z2hdg.azure.mongodb.net/<dbname>?retryWrites=true&w=majority
