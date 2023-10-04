const mongoose = require("mongoose");
require("dotenv").config();

const connection = mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("connected to mongoDB successfully");
}).catch((err) => {
    console.log("error is: " ,err);
});

module.exports = connection;