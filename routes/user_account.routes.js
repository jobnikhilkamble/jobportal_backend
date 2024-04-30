var express = require('express');
var router = express.Router();
var user_account = require('../controllers/user_account.controller');
var send_response = require('../functions/send_response');

router.post('/', user_account.create, send_response.send_find_response);
router.post('/sign_in', user_account.sign_in,send_response.send_find_response);
router.get("/", user_account.getAll, send_response.send_find_response);
router.get("/:id", user_account.getById, send_response.send_find_response);
router.put("/:id", user_account.update, send_response.send_create_response);

module.exports = router;