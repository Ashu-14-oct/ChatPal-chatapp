const Message = require('../model/message');

module.exports.addMessage = async (req, res, next) => {
    try{
        const {from, to, message} = req.body;
        const data = await Message.create({
            message: {text: message},
            users: [from, to],
            sender: from,
        });
        if(data){
            return res.json({message: "Message added successfully"});
        }
        return res.json({message: "Failed to the add message to the database"});
    }catch(err){
        return res.status(500).json({message: "Internal server error"});
    }
}

module.exports.getAllMessage = async (req, res, next) => {
     try{
        const {from, to} = req.body;
        const messages = await Message.find({
            users: {
                $all: [from, to],
            },
        }).sort({updatedAt: 1});

        const projectMessages = messages.map((msg) => {
            return {
                fromSelf: msg.sender.toString() === from,
                message: msg.message.text,
            };
        });
        return res.json(projectMessages);
    }catch(err){
        return res.status(500).json({message: "Internal server error"});
    }
}