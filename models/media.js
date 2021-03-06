
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/auction-file-bucket', { useNewUrlParser: true, useUnifiedTopology: true })

const Schema = mongoose.Schema


const mediaSchema = new Schema({

    fileName: {
        type: String,
        required: true
    },

    path: {
        type: String,
        required: true
    },

    size: {
        type: Number,
        required: true
    },

    itemID: {
        type: String,
        required: true
    },

    mediaType: {
        type: String,
        enum: ['image', 'video'], 
    },

    mimeType: {
        type: String,
        required: true
    }

})

module.exports = mongoose.model('Media', mediaSchema)