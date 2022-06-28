const mongoose = require('mongoose')
const mediaSchema = require('./media')

mongoose.connect('mongodb://localhost/auction-file-bucket', { useNewUrlParser: true, useUnifiedTopology: true })

const Schema = mongoose.Schema

const itemSchema = new Schema({

    ownerID: {
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
        type: String,
        required: true
    },

    imageURL: {
        type: String,
        required: true
    }

}, { timestamps: true })

itemSchema.index({ name: 'text' })

module.exports = mongoose.model('Item', itemSchema)