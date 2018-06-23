// jshint esversion: 6
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let AdressSchema = new Schema({
    street: String,
    number: String,
    city: String,
    zip: String
});

module.exports = mongoose.model('Adress', AdressSchema);
