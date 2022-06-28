
const config = require('../config/config')
const mediaModel = require('../models/media')
const itemModel = require('../models/items')
const categoryModel = require('../models/collection')
const { isObjectID } = require('../utils/verifyObjectID')

const extractFileExtension = (fileName) => {

    const splitLength = fileName.split('.').length
    return fileName.split('.')[splitLength - 1]
}

const isExtensionValid = (extension, allowedExtensions) => {

    for(let i=0;i<allowedExtensions.length;i++) {
        
        if(extension.toLowerCase() == allowedExtensions[i]) {
            return true
        }
    }
    return false
}

const checkImagesExtensionsValid = (images, allowedExtensions) => {
    let invalidFiles = []

    for(const image in images) {
        valid = isExtensionValid(extractFileExtension(images[image].name), allowedExtensions)
        if(!valid) {
            invalidFiles.push(images[image].name) 
        }
    }
    return invalidFiles
}

const numberOfFiles = (files) => {
    let counter = 0
    for(const file in files) {
        counter++
    }
    
    return counter
}

const generateMediaURLs = (host, media) => {

    const mediaURLs = []

    for(let i=0;i<media.length;i++) {
        mediaURLs.push(`${host}/api/${config.service}/images/${media[i]._id}`)
    }

    return mediaURLs
}



const createItem = async (request, response) => {

    try {

        if(!request.body.name) {
            return response.status(406).send({
                accepted: false,
                message: 'item name is required',
                service: config.service,
                field: 'name'
            })
        }

        if(!request.body.description) {
            return response.status(406).send({
                accepted: false,
                message: 'item description is required',
                service: config.service,
                field: 'description'
            })
        }

        if(!request.body.condition) {
            return response.status(406).send({
                accepted: false,
                message: 'item condition is required',
                service: config.service,
                field: 'condition'
            })
        }

        if(!request.body.category) {
            return response.status(406).send({
                accepted: false,
                message: 'item category is required',
                service: config.service,
                field: 'category'
            })
        }

        const category = await categoryModel.find({ name: request.body.category })
        if(category.length == 0) {
            return response.status(406).send({
                accepted: false,
                message: 'invalid category',
                service: config.service,
                field: 'category'
            })
        }

        if(!request.body.ownerID) {
            return response.status(406).send({
                accepted: false,
                message: 'owner ID is required',
                service: config.service,
                field: 'owner ID'
            })
        }

        const usedItemsNames = await itemModel
        .find({ name: request.body.name, ownerID: request.body.ownerID })

        if(usedItemsNames.length != 0) {
            return response.status(406).send({
                accepted: false,
                message: 'item name is already used in your account',
                service: config.service,
                field: 'name'
            })
        }

        if(!request.body.imageURL) {
            return response.status(406).send({
                accepted: false,
                message: 'image url is required',
                service: config.service,
                field: 'image'
            })
        }


        const itemData = {
            auctionID: request.body.auctionID,
            ownerID: request.body.ownerID,
            name: request.body.name,
            description: request.body.description,
            condition: request.body.condition,
            category: request.body.category,
            imageURL: request.body.imageURL,
        }

        const Item = new itemModel(itemData)
        const saveItem = await Item.save()

        return response.status(200).send({
            accepted: true,
            message: 'item added successfully',
            service: config.service,
            item: saveItem
        })

    } catch(error) {
        console.error(error)
        return response.status(500).send({
            accepted: false,
            message: 'internal server error',
            service: config.service
        })
    }
}

const getImage = async (request, response) => {

    try {

        if(!request.params.imageID) {
            return response.status(406).send({
                accepted: false,
                message: 'image id is required'
            })
        }

        if(!ObjectID.isValid(request.params.imageID)) {
            return response.status(406).send({
                accepted: false,
                message: 'invalid id format'
            })
        }

        const mediaFile = await mediaModel.find({ _id: request.params.imageID })

        if(mediaFile.length == 0) {

            return response.status(406).send({
                accepted: false,
                message: 'there is no media document',
                service: config.service
            })
        }

        
        return response.status(200).sendFile(
            mediaFile[0].fileName,
             {
                 root: `./${ mediaFile[0].path }`
            }
        )   

    } catch(error) {
        console.error(error)
        return response.status(500).send({
            accepted: false,
            message: 'internal server error',
            service: config.service
        })
    }
}

const getImages = async (request, response) => {

    try {

        if(!ObjectID.isValid(request.params.itemID)) {
            return response.status(406).send({
                accepted: false,
                message: 'invalid id format'
            })
        }

        const itemImages = await mediaModel.find({
            $and: [
                {
                    itemID: request.params.itemID
                },
                {
                    mediaType: 'image'
                }
            ]
        })

        const host = `http://${config.proxy}`
        const imagesURLs = generateMediaURLs(host, itemImages)
        
        return response.status(200).send({
            accepted: true,
            imagesURLS: imagesURLs,
            service: config.service
        })

    } catch(error) {
        console.error(error)
        return response.status(500).send({
            accepted: false,
            message: 'internal server error',
            service: config.service
        })
    }
}

const getItem = async (request, response) => {

    try {

        if(!isObjectID(request.params.itemID)) {
            return response.status(406).send({
                accepted: false,
                message: 'invalid item ID',
                service: config.service
            })
        }

        const item = await itemModel.find({ _id: request.params.itemID }).select({ '__v': 0 })

        return response.status(200).send({
            accepted: true,
            item: item,
            service: config.service
        })

    } catch(error) {
        console.error(error)
        return response.status(500).send({
            accepted: false,
            message: 'internal server error',
            service: config.service
        })
    }
}

const getOwnerItems = async (request, response) => {

    try {

        const { ownerID } = request.params

        const items = await itemModel
        .find({ ownerID })
        .select({ __v: 0, updatedAt: 0 })

        return response.status(200).send({
            accepted: true,
            items,
            service: config.service
        })

    } catch(error) {
        console.error(error)
        return response.status(500).send({
            accepted: false,
            message: 'internal server error',
            service: config.service
        })
    }
}

const searchItems = async (request, response) => {

    try {

        const qCategory = request.query.category
        const qItemName = request.query.itemName

        let items

        if(qCategory) {
            items = await itemModel.find({
                category: qCategory
            })
        } else if(qItemName) {
            items = await itemModel.find({
                $text: { $search: qItemName }
            })
        } else {
            items = await itemModel.find().limit(12)
        }

        return response.status(200).send({
            accepted: true,
            items: items,
            service: config.service
        })

    } catch(error) {
        console.error(error)
        return response.status(500).send({
            accepted: false,
            message: 'internal server error'
        })
    }
}

const getAuctionItem = async (request, response) => {

    try {
         
        if(!request.params.auctionID) {
            return response.status(406).send({
                accepted: false,
                message: 'auction id is required'
            })
        }

        /*if(!ObjectID.isValid(request.params.auctionID)) {
            return response.status(406).send({
                accepted: false,
                message: 'invalid id format'
            })
        }*/

        const item = await itemModel.find({ auctionID: request.params.auctionID }).select({ '__v': 0 })
        if(item.length == 0) {
            return response.status(406).send({
                accepted: false,
                message: 'invalid auction id'
            })
        }
        const images = await mediaModel.find({ itemID: item[0]._id })

        const host = `http://${config.proxy}`
        const imagesURLs = generateMediaURLs(host, images)

        return response.status(200).send({
            accepted: true,
            item: item[0],
            images: [ ...imagesURLs ]
        })

    } catch(error) {
        console.error(error)
        return response.status(500).send({
            accepted: false,
            message: 'internal server error'
        })
    }
}

module.exports = {
    createItem,
    getImage,
    getImages,
    getItem,
    getAuctionItem,
    searchItems,
    getOwnerItems
}