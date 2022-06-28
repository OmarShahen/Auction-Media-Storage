const mongoose = require('mongoose')

const isObjectID = (objectID) => {
    return mongoose.Types.ObjectId.isValid(objectID)
}

module.exports =  { isObjectID }