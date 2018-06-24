// jshint esversion: 6
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let User = require('../models/user');
let offerSchema = require('../models/offer').schema;
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
    isFinished: { type: Boolean, default: false },
    owner: {type: Schema.Types.ObjectId, ref: User},
    bids: [offerSchema]
});

module.exports = mongoose.model('Item', ItemSchema);