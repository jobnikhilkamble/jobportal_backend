const db = require("../models");
const UserType = db.usertype;
const WhereBuilder = require('../helpers/where_builder');
var HTTPError = require('http-errors');

exports.create = async (req, res, next) => {
  var { name } = req.body;
  
  if (!name) {
    return next(HTTPError(500, "User Type not created, name field is empty"));
  }

  var userType;
  try {
    userType = await UserType.create({
      name: name,
      status: true,
    });
    if (!userType) {
      return next(HTTPError(500, "User Type not created"))
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
      return next(HTTPError(500,"Internal error has occurred, while creating the User Type."))
    }
  }

  userType = userType.toJSON();
  req.responseData = userType;
  next();
  return req.responseData
};

exports.getAll = async (req, res, next) =>{
  var { name, status } = req.query;

  var whereClause = new WhereBuilder()
  .clause('name', name)
  .clause('status', status).toJSON();

  var getAllUserType = await UserType.findAll({
    where:whereClause
  });
  
  if (!getAllUserType[0]) {
    req.responseData = [];
  }
  
  getAllUserType = getAllUserType.map ( el => { return el.get({ plain: true }) } );
  req.getAllUserType = getAllUserType;
  req.responseData = getAllUserType;
  next();
  return req.responseData
};

exports.update = async (req, res, next) => {
  const { id } = req.params;
  var { name, status } = req.body;

  var whereClause = new WhereBuilder()
  .clause('name', name)
  .clause('status', status).toJSON();

  try{
    var updatedUserType = await UserType.update(whereClause,{
      where: {
        id: id
      }
    });

    if (!updatedUserType) {
      return next(HTTPError(500, "User Type not updated"))
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
      return next(HTTPError(500,"Internal error has occurred, while updating the User Type."))
    }
  }

  req.updatedUserType = updatedUserType;
  req.responseData = updatedUserType;
  next();
  return req.responseData
};

exports.getById = async (req, res, next) => {

  const { id } = req.params;

  var foundUserType = await UserType.findByPk(id);
  if (!foundUserType) {
    return next(HTTPError(500, "User Type not found"))
  }
  req.foundUserType = foundUserType;
  req.responseData = req.foundUserType;
  next();
}
