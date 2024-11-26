const mongoose = require("mongoose");
require("dotenv").config();
let Schema = mongoose.Schema;

// mongoose.connect(process.env.MDBCONNECTIONSTR)
//     .then(() => console.log("connected"));

let loginHist = new Schema({
  dataTime: Date,
  userAgent: String,
});

let userSchema = new Schema({
  userName: String,
  password: String,
  email: String,
  loginHistory: [loginHist],
});
let User;

function initialize() {
  return new Promise((resolve, reject) => {
    let db = mongoose.createConnection(process.env.MDBCONNECTIONSTR);
    db.on("error", (err) => {
      reject(err);
      return;
    });

    db.once("open", () => {
      User = db.model("users", userSchema);
      resolve();
    });
  });
}

function registerUser(userData) {
  return new Promise((resolve, reject) => {
    if (userData.password !== userData.password2) {
      reject("Passwords do not match");
      return;
    }

    let newUser = new User(userData);
    newUser
      .save()
      .then(() => resolve())
      .catch((error) => {
        if (error.code === 11000) {
          reject("User Name already taken");
        } else {
          reject(`There was an error creating the user: ${error}`);
        }
        return;
      });
  });
}

function checkUser(userData) {
    
}

module.exports = { initialize, registerUser, checkUser };
