//jshint esversion: 6
let mongoose = require('mongoose');
let path = require('path');
let Schema = mongoose.Schema;
let addressSchema = require('./address').schema;
let passportLocalMongoose = require('passport-local-mongoose');
let notificationSchema = require('./notification').schema;
let UserSchema = new Schema({
    username: String,
    password: String,
    firstName: String,
    lastName: String,
    phoneNumber: String,
    eMail: String,
    addresses: [addressSchema],
    items: [{type: Schema.Types.ObjectId, ref: "Item"}],
    notifications: [notificationSchema],
    hasUnread: {type: Boolean, default: false}
});

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', UserSchema);