const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
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

    bcrypt
      .hash(userData.password, 10)
      .then((hash) => {
        userData.password = hash;

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
          });
      })
      .catch((err) => {
        reject(`There was an error hashing the password: ${err}`);
      });
  });
}

function checkUser(userData) {
  return new Promise((resolve, reject) => {
    User.findOne({ userName: userData.userName })
      .then(async (user) => {
        if (user === null) {
          reject(`Unable to find user: ${userData.userName}`);
          return;
        }

        let passMatch = await bcrypt.compare(userData.password, user.password);

        if (!passMatch) {
          reject(`Incorrect Password for user: ${userData.userName}`);
          return;
        } else {
          if (user.loginHistory.length === 8) {
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
            .then(() => resolve(user))
            .catch((err) =>
              reject(`There was an error verifying the user: ${err}`)
            );
        }
      })
      .catch((error) => reject(`Unable to find user: ${userData.userName}`));
  });
}

module.exports = { initialize, registerUser, checkUser };
