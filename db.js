const mongoose = require("mongoose");

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
  autoIndex: false, // Don't build indexes
  poolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4, // Use IPv4, skip trying IPv6
};

const db = mongoose.connection;

/**
 * Connected handler
 */
const connect = async () => {
  try {
    const dbInstance = await mongoose.connect(process.env.MONGO_URL, options);
    if (dbInstance == null) {
      throw "Connect fail";
    }
    console.log("Database init");

    /**
     * Mongoose Event
     */
    db.on("connected", function () {
      console.log(
        "Mongoose default connection is open to ",
        process.env.MONGO_URL
      );
    });
    db.on("error", function (err) {
      console.log(err);
    });
    db.on("disconnected", function () {
      console.log("Mongoose default connection is disconnected");
    });

    process.on("SIGINT", function () {
      db.close(function () {
        console.log(
          "Mongoose default connection is disconnected due to application termination"
        );
        process.exit(0);
      });
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  connect,
  db,
};
