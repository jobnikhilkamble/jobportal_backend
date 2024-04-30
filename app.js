var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
const cors = require("cors");
var encodeUrl = require('encodeurl');
const handlebars = require('express-handlebars');
var jwt = require("jsonwebtoken");
var createError = require('http-errors');

var userTypeRouter = require('./routes/user_type.routes');
var userAccountRouter = require('./routes/user_account.routes');

const app = express();

app.set('view engine', 'handlebars');

app.engine('handlebars', handlebars({
layoutsDir: __dirname + '/views/layouts',
}));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
  next();
});

app.use(function(req, res, next) {
  if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
    jwt.verify(req.headers.authorization.split(' ')[1], 'jobportalsecret', function(err, decode) {
      if (err) req.user = undefined;
      req.user = decode;
      next();
    });
  } else {
    req.user = undefined;
    next();
  }
});

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/userType', userTypeRouter);
app.use('/userAccount', userAccountRouter);

const db = require("./models");
db.sequelize.sync();

app.use(express.static('public'))

app.get("/", (req, res) => {
  res.render('main', {layout : 'index'});
});

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ error: err })
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

