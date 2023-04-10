const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

var userSchema=new Schema({

    "userName":String,
    "password":String,
    "email":String,
    "loginHistory":[{"dateTime":Date,"userAgent":String}]

});

let User; // to be defined on new connection (see initialize)

module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {
        let db = mongoose.createConnection("mongodb+srv://gauti2295:gauti2295@gautamdatabase.swhkfs6.mongodb.net/web322_week8?retryWrites=true&w=majority");
       
        db.on('error', (err) => {
            reject(err);
        });

        db.once('open', () => {
            User = db.model("users", userSchema);
            resolve();
        });
    });
};

module.exports.registerUser=function(userData){
    return new Promise((resolve,reject)=>{
        if(userData.password!== userData.password2){
            reject("Passwords do not match")
        }
        else {
            let newUser = new User(userData);
             
            newUser.save().then(() => {
                resolve();
            }).catch((err)=>{
                if(err.code=11000){
                    reject("User Name already taken");
                }
                else if(err.code!=1100){
                    reject("There was an error creating the user: err");
                }
                else
                {
                    reject();
                }
            })
        }
    })
}


module.exports.checkUser=function(checkUser){
    return new Promise((resolve,reject)=>{
        User.find({ userName: userData.userName }) .exec().then((users)=>{
            if(users.length==0){
                reject(`Unable to find user: ${userData.userName}`);
            }
            else if(users[0].password!=userData.password){
                reject(`Incorrect Password for user: ${userData.userName}`);
            }
            else if(users[0].password==userData.password){
                users[0].loginHistory.push({"dateTime":Date,"userAgent":String});

                User.updateOne(
                    {"username":users[0].userName},
                    {"$set":{"loginHistory":users[0].loginHistory}},

                    ).exec.then(()=>{
                        resolve(users[0]);
                    }).catch((err)=>{
                        reject(`There was an error verifying the user: ${err}`);
                    })
            }
        }).catch((err)=>{
            reject(`Unable to find user: ${userData.userName }`);
        })
    })
}
