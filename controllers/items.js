
const config = require('../config/config')
const mediaModel = require('../models/media')
const itemModel = require('../models/items')

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
        mediaURLs.push(`${host}/file-storage-service/api/auction-media/view/${media[i]._id}`)
    }

    return mediaURLs
}

/*
const createItem = async (request, response) => {

    try {

        console.log(request.body)

        if(!request.body.name) {
            return response.status(406).send({
                accepted: false,
                message: 'item name is required',
                service: config.service
            })
        }

        if(!request.body.description) {
            return response.status(406).send({
                accepted: false,
                message: 'item description is required',
                service: config.service
            })
        }

        if(!request.body.condition) {
            return response.status(406).send({
                accepted: false,
                message: 'item condition is required',
                service: config.service
            })
        }

        if(!request.body.category) {
            return response.status(406).send({
                accepted: false,
                message: 'item category is required',
                service: config.service
            })
        }

        if(!request.files) {
            
            return response.status(406).send({
                accepted: false,
                message: 'no file was uploaded',
                service: config.service
            })
        }

        if(!request.body.auctionID) {

            return response.status(406).send({
                accepted: false,
                message: 'auction ID is required',
                service: config.service
            })
        }

        const imageExtension = extractFileExtension(request.files.auctionImage.name)

        if(!isExtensionValid(imageExtension, config.allowedImageExtension)) {

            return response.status(406).send({
                accepted: false,
                message: 'invalid image extension',
                service: config.service
            })
        }
    
        const imageData = {
            fileName: request.files.auctionImage.name,
            size: request.files.auctionImage.size,
            auctionID: request.body.auctionID,
            mediaType: 'image',
            mimeType: request.files.auctionImage.mimetype,
            path: `${ config.storageDirectory }/${ request.body.auctionID }`
        }

        const Media = new mediaModel(imageData)
        const saveMedia = await Media.save()

        const saveImage = await request.files.auctionImage.mv()
        `./${ config.storageDirectory }/${ request.body.auctionID}/${ request.files.auctionImage.name }`
        return response.status(200).send({
            accepted: true,
            message: 'image uploaded successfully',
            service: config.service
        })

    } catch(error) {
        console.error(error)
        return response.stattus(500).send({
            accepted: false,
            message: 'internal server error',
            service: config.service
        })
    }
}*/



/*const uploadVideo = async (request, response) => {

    try {

        if(!request.files) {

            return response.status(406).send({
                accepted: false,
                message: 'no video was uploaded',
                service: config.service
            })
        }

        if(!request.body.auctionID) {

            return response.status(406).send({
                accepted: false,
                message: 'auction ID is required',
                service: config.service
            })
        }

        const videoExtension = extractFileExtension(request.files.auctionVideo.name)

        if(!isExtensionValid(videoExtension, config.allowedVideoExtension)) {

            return response.status(406).send({
                accepted: false,
                message: 'invalid video extension',
                service: config.service
            })
        }

        const videoData = {
            fileName: request.files.auctionVideo.name,
            size: request.files.auctionVideo.size,
            auctionID: request.body.auctionID,
            mediaType: 'video',
            mimeType: request.files.auctionVideo.mimetype,
            path: `${ config.storageDirectory }/${ request.body.auctionID }`
        }

        const Media = new mediaModel(videoData)
        const saveMedia = await Media.save()

        const saveVideo = await request.files.auctionVideo.mv(`./${ config.storageDirectory }/${ request.body.auctionID}/${ request.files.auctionVideo.name }`)

        return response.status(200).send({
            accepted: true,
            message: 'video uploaded successfully',
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
}*/


const createItem = async (request, response) => {

    try {

        if(!request.body.name) {
            return response.status(406).send({
                accepted: false,
                message: 'item name is required',
                service: config.service
            })
        }

        if(!request.body.description) {
            return response.status(406).send({
                accepted: false,
                message: 'item description is required',
                service: config.service
            })
        }

        if(!request.body.condition) {
            return response.status(406).send({
                accepted: false,
                message: 'item condition is required',
                service: config.service
            })
        }

        if(!request.body.category) {
            return response.status(406).send({
                accepted: false,
                message: 'item category is required',
                service: config.service
            })
        }

        if(!request.files) {
            return response.status(406).send({
                accepted: false,
                message: 'no file was uploaded',
                service: config.service
            })
        }

        if(!request.body.auctionID) {
            return response.status(406).send({
                accepted: false,
                message: 'auction ID is required',
                service: config.service
            })
        }

        const items = await itemModel.find({ auctionID: request.body.auctionID })
        if(items.length != 0) {
            return response.status(406).send({
                accepted: true,
                message: 'this auction already contains items',
                service: config.service
            }) 
        }

        const invalidImages = checkImagesExtensionsValid(request.files, config.allowedImageExtension)
        if(invalidImages != 0) {
            return response.status(406).send({
                accepted: false,
                message: 'invalid images extension',
                invalidImages: invalidImages,
                service: config.service
            })
        }

        if(numberOfFiles(request.files) > config.allowedImagesNumber) {
            return response.status(406).send({
                accepted: false,
                message: `${config.allowedImagesNumber} or less images is acceptable`,
                service: config.service
            })
        }

        const itemData = {
            auctionID: request.body.auctionID,
            name: request.body.name,
            description: request.body.description,
            condition: request.body.condition,
            category: request.body.category
        }

        const Item = new itemModel(itemData)
        const saveItem = await Item.save()

        const images = request.files
        for(const image in images) {

            const imageData = {
                fileName: images[image].name,
                size: images[image].size,
                itemID: saveItem._id,
                mediaType: 'image',
                mimeType: images[image].mimetype,
                path: `${ config.storageDirectory }/${ saveItem._id.toString() }`
            }

            const Media = new mediaModel(imageData)
            const saveMedia = await Media.save()

            const saveImage = await images[image].mv(`./${ config.storageDirectory }/${ saveItem._id.toString() }/${ images[image].name }`)
        }

        return response.status(200).send({
            accepted: true,
            message: 'item added successfully',
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

const getImage = async (request, response) => {

    try {

        const mediaFile = await MediaModel.find({ _id: request.params.mediaID })

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

        const host = `${request.protocol}://${request.hostname}`
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

module.exports = {
    createItem,
    getImage,
    getImages
}