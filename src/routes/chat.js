const express = require('express');
const { userAuth } = require('../middelware/auth');
const { Chat } = require("./../models/chat");
 USER_SAFE_DATA=["firstName","lastName","photoUrl","age","gender","about","skills"];

const chatRouter = express.Router();

chatRouter.get('/chat/:targetUserId', userAuth, async (req, res) => {
    try {
        console.log("triggered");
        const targetUserId = req.params.targetUserId;
        const userId = req.user._id;
        const chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
        }).populate("messages.senderId",USER_SAFE_DATA).populate()
        if (chat) {
            res.send(chat);
            return;
        }
        res.send({});
    }
    catch (err) {
        console.log(err.message);
        res.status(400).send(`something went wrong ${err.message}`);

    }




})

module.exports = chatRouter;