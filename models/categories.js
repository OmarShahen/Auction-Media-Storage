const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/auction-file-bucket', { useNewUrlParser: true, useUnifiedTopology: true })

const Schmea = mongoose.Schema
const categorySchema = new Schmea({

    name: {
        type: String,
        required: true,
        unique: true
    },

    description: {
        type: String,
        required: true
    }

})

module.exports = mongoose.model('Category', categorySchema)