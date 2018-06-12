//jshint esversion: 6
let mongoose = require('mongoose');
let path = require('path');
let Schema = mongoose.Schema;
let passportLocalMongoose = require('passport-local-mongoose');
let address = require(path.join(__dirname,'adress'));

let UserSchema = new Schema({
    username: String,
    password: String,
    phoneNumber: String,
    email: String,
    adresses: [{type: Schema.Types.ObjectId, ref: address}]
});

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', UserSchema);