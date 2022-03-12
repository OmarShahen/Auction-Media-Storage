
const config = require('../config/config')
const mediaModel = require('../models/media')

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


const uploadImage = async (request, response) => {

    try {

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

        const saveImage = await request.files.auctionImage.mv(`./${ config.storageDirectory }/${ request.body.auctionID}/${ request.files.auctionImage.name }`)
        
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
}



const uploadVideo = async (request, response) => {

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
}


const uploadMultipleImages = async (request, response) => {

    try {

        console.log(request.files)

        return response.status(200).send({
            accepted: true,
            message: 'after party',
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
    uploadImage,
    uploadVideo,
    uploadMultipleImages
}