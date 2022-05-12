const mongoose = require('mongoose')
const mediaSchema = require('./media')

mongoose.connect('mongodb://localhost/auction-file-bucket', { useNewUrlParser: true, useUnifiedTopology: true })

const Schema = mongoose.Schema

const itemSchema = new Schema({

    auctionID: {
        type: String,
        required: true
    },

    name: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    condition: {
        type: String,
        required: true
    },

    category: {
        type: Array,
        required: true
    },

    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Item', itemSchema)