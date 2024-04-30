const db = require("../models");
const UserAccounts = db.useraccount;
const WhereBuilder = require('../helpers/where_builder');
const HTTPError = require('http-errors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');
const bbPromise = require('bluebird');
const emailService = require('../helpers/email_service');

exports.create = async (req, res, next) => {
  const { user_type_id, email, password, date_of_birth, gender, contact_number, sms_notification_active,
    email_notification_active, image } = req.body;
  
  if (!user_type_id) {
    return next(HTTPError(500, "UserAccount not created, user_type_id field is empty"));
  }

  if (!email) {
    return next(HTTPError(500, "UserAccount not created, email field is empty"));
  }

  if (!password) {
    return next(HTTPError(500, "UserAccount not created, password field is empty"));
  }

  const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if(!emailRegexp.test(email)){
    return next(HTTPError(500, "UserAccount not created, email field is invalid")); 
  }

  var newDate = new Date;
  newDate = newDate.toDateString();
  var emailOTP = Math.floor(1000 + Math.random() * 9000);
  var mobileOTP = Math.floor(1000 + Math.random() * 9000);
  var useraccount;
  try {
    useraccount = await UserAccounts.create({
      user_type_id: user_type_id,
      email: email,
      password: password,
      date_of_birth : date_of_birth ? date_of_birth : '',
      gender : gender ? gender : '',
      contact_number : contact_number ? contact_number : '',
      sms_notification_active : sms_notification_active ? sms_notification_active : false,
      email_notification_active : email_notification_active ? email_notification_active : true,
      image : image ? image : '',
      is_active: true,
      email_notification_otp:emailOTP,
      email_verified: false,
      mobile_notification_otp: mobileOTP,
      mobile_verified: false,
      registration_date: newDate
    });
    if (!useraccount) {
      return next(HTTPError(500, "UserAccount not created"))
    }
  } 
  catch (err) {
    console.log(err)
    if(err["errors"]){
      return next(HTTPError(500,err["errors"][0]["message"]))
    }
    else if(err["original"]){
      return next(HTTPError(500, err["original"]["detail"]));
    }
    else{
      return next(HTTPError(500,"Internal error has occurred, while creating the useraccount."))
    }
  }

  emailService.send_email(email, emailOTP);
  useraccount = useraccount.toJSON();
  req.responseData = useraccount;
  next();
  return req.responseData
};

exports.sign_in = async (req, res, next) =>{
 const user= await UserAccounts.scope('withPassword').findOne({
  where: {
    email: req.body.email
  }
})

 if( !user  || user.status === false){
  return next(HTTPError(401,"Authentication failed. Invalid user or password."))
}

if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
  return next(HTTPError(401,"Authentication failed. Invalid user or password."));
}

req.responseData = {
 token: jwt.sign({ email: user.email },'jobportalsecret'),
 email: user.email,
 is_active: user.is_active
}
next();
return req.responseData;
};

exports.loginRequired = async (req, res, next) =>{
  if (req.user) {
    next();
  } else {
    return res.status(401).json({ message: 'Unauthorized user!' });
  }
};

exports.getAll = async (req, res, next) =>{
  const { user_type_id, email, date_of_birth, gender, contact_number, sms_notification_active,
    email_notification_active, is_active } = req.query;

 const whereClause = new WhereBuilder()
 .clause('user_type_id', user_type_id)
 .clause('email', email)
 .clause('date_of_birth', date_of_birth)
 .clause('gender', gender)
 .clause('contact_number', contact_number)
 .clause('sms_notification_active', sms_notification_active)
 .clause('email_notification_active', email_notification_active)
 .clause('is_active', is_active).toJSON();

 var getAllUserAccount = await UserAccounts.findAll({
  where:whereClause
});

 if (!getAllUserAccount[0]) {
  return next(HTTPError(400, "UserAccount not found"));
}

getAllUserAccount = getAllUserAccount.map ( el => { return el.get({ plain: true }) } );
req.getAllUserAccount = getAllUserAccount;
req.responseData = getAllUserAccount;
next();
return req;
};

exports.update = async (req, res, next) => {
  const { id } = req.params;
  const { email, password, date_of_birth, gender, contact_number, sms_notification_active,
    email_notification_active, image, is_active } = req.body;

  const whereClause = new WhereBuilder()
  .clause('password', password)
  .clause('email', email)
  .clause('date_of_birth', date_of_birth)
  .clause('gender', gender)
  .clause('contact_number', contact_number)
  .clause('sms_notification_active', sms_notification_active)
  .clause('email_notification_active', email_notification_active)
  .clause('image', image)
  .clause('is_active', is_active).toJSON();

  try{
    var updatedUserAccount = await UserAccounts.update(whereClause,{
      where: {
        id: id
      }
    });

    if (!updatedUserAccount) {
      return next(HTTPError(500, "UserAccount not updated"))
    }
  }
  catch (err) {
    if(err["errors"]){
      return next(HTTPError(500,err["errors"][0]["message"]))
    }
    else if(err["original"]){
      return next(HTTPError(500, err["original"]["detail"]));
    }
    else{
      return next(HTTPError(500,"Internal error has occurred, while updating the useraccount."))
    }
  }

  req.updatedUserAccount = updatedUserAccount;
  req.responseData = updatedUserAccount;
  next();
};

exports.getById = async (req, res, next) => {

  const { id } = req.params;

  const foundUserAccount = await UserAccounts.findByPk(id);
  if (!foundUserAccount) {
    return next(HTTPError(500, "UserAccount not found"))
  }
  req.foundUserAccount = foundUserAccount;
  req.responseData = req.foundUserAccount;
  next();
}
