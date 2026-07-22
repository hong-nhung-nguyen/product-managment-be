const mongoose = require("mongoose");

module.exports.connect = async () => {
    const mongoUrl = process.env.MONGO_URL;

    try {
        console.log(`Connecting to MongoDB: ${mongoUrl.replace(/:([^:@]+)@/, ":***@")}`);
        await mongoose.connect(mongoUrl);
        console.log("Connect Success!");
    } catch (error) {
        console.log("Connect Error!");
        console.log(error.message);
        if (error?.reason?.message) {
            console.log(error.reason.message);
        }
    }
};
