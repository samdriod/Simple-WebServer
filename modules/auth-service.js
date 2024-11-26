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
  return new Promise((resolve, reject) => {
    User.findOne({ userName: userData.userName })
      .then((user) => {
        if (user === null) {
          reject(`Unable to find user: ${userData.userName}`);
          return;
        }

        if (user.password !== userData.password) {
          reject(`Incorrect Password for user: ${userData.userName}`);
          return;
        } else {
          if (user.loginHistory.lenght === 8) {
            user.loginHistory.pop();
          }
          user.loginHistory.unshift({
            dataTime: new Date().toString(),
            userAgent: userData.userAgent,
          });
          User.updateOne(
            { userName: userData.userName },
            { $set: { loginHistory: user.loginHistory } }
          )
            .then(() => resolve())
            .catch((err) =>
              reject(`There was an error verifying the user: ${err}`)
            );
        }
      })
      .catch((error) => reject(`Unable to find user: ${userData.userName}`));
  });
}

module.exports = { initialize, registerUser, checkUser };
