var express = require('express');
var router = express.Router();
var user_type = require('../controllers/user_type.controller');
var send_response = require('../functions/send_response');

router.post("/", user_type.create, send_response.send_create_response);
router.get("/", user_type.getAll, send_response.send_find_response);
router.get("/:id", user_type.getById, send_response.send_find_response);
router.put("/:id", user_type.update, send_response.send_create_response);

module.exports = router;