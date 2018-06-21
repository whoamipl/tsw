//jshint esversion: 6
let mongoose = require('mongoose');
let path = require('path');
let Schema = mongoose.Schema;
let addressSchema = require('./address').schema;
let passportLocalMongoose = require('passport-local-mongoose');
let UserSchema = new Schema({
    username: String,
    password: String,
    firstName: String,
    lastName: String,
    phoneNumber: String,
    eMail: String,
    addresses: [addressSchema],
    items: [{type: Schema.Types.ObjectId, ref: "Item"}]
});

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', UserSchema);