const express = require('express');
const cors = require('cors');
const mongoDB = require('./config/mongoose');
const socket = require("socket.io");
const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());

//route
app.use('/api/auth', require('./routes/userRoutes'));
app.use('/api/messages', require('./routes/messagesRoute'));

const server = app.listen(process.env.PORT, () => {
    console.log(`server running on PORT ${process.env.PORT}`);
})

const io = socket(server, {
    cors: {
        origin: "http://localhost:3000",
        Credentials: true,
    },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
     global.chatSocket = socket;

     socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
     });

     socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if(sendUserSocket){
            socket.to(sendUserSocket).emit("msg-recieve", data.message);
        }
     })

})
