// jshint esversion: 6
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ItemSchema = new Schema({
    title: String
});

module.exports = mongoose.model('Item', ItemSchema);