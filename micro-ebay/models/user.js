//jshint esversion: 6
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let passportLocalMongoose = require('passport-local-mongoose');
let UserSchema = new Schema({
    username: String,
    password: String,
    firstName: String,
    lastName: String,
    phoneNumber: String,
    eMail: String,
    adresses: [{type: Schema.Types.ObjectId, ref: "Addres"}],
    items: [{type: Schema.Types.ObjectId, ref: "Item"}]
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);