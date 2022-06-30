const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/auction-file-bucket', { useNewUrlParser: true, useUnifiedTopology: true })

const Schmea = mongoose.Schema
const categorySchema = new Schmea({

    name: {
        type: String,
        required: true,
        unique: true
    },

    imageURL: {
        type: String,
        required: true
    }

})

categorySchema.index({ name: 1 })

module.exports = mongoose.model('Collection', categorySchema)