const express = require("express");
const router = express.Router();
const messagesController = require("../controllers/messagesController");

router.post("/addmsg/", messagesController.addMessage);
router.post("/getmsg/", messagesController.getAllMessage);

module.exports = router;
