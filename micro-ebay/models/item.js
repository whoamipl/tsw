// jshint esversion: 6
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let User = require('../models/user');
let ItemSchema = new Schema({
    title: { type: String, required: true },
    img: {date: Buffer, contentType: String, filename: String},
    description : { type: String, required: true },
    price: Number,
    dateStart: {
        type: Date,
        default: Date.now
    },
    dateEnd: Date,
    isBuyNow: Boolean,
    isFinished: Boolean,
    owner: {type: Schema.Types.ObjectId, ref: User},
    auctioners: [{type: Schema.Types.ObjectId, ref: 'User'}]
});

module.exports = mongoose.model('Item', ItemSchema);