
const MediaModel = require('../models/media')
const config = require('../config/config')
const fs = require('fs')



const generateMediaURLs = (media) => {

    const mediaURLs = []
    let host = config.host

    if(config.host == 'http://localhost') {
        host = config.host + ':' + config.port
    }

    for(let i=0;i<media.length;i++) {

        mediaURLs.push(`${host}/file-storage-service/api/auction-media/view/${media[i]._id}`)
    }

    return mediaURLs
}

const splitMediaData = (media) => {

    const imageMedia = []
    const videoMedia = []

    for(let i=0;i<media.length;i++) {
        if(media[i].mediaType == 'image') {
            imageMedia.push(media[i])
        } else {
            videoMedia.push(media[i])
        }
    }

    return {
        images: imageMedia,
        videos: videoMedia
    }
}



const fetchFile = async (request, response) => {

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

const fetchAuctionImages = async (request, response) => {

    try {

        const auctionImages = await MediaModel.find({
            $and: [
                {
                    auctionID: request.params.auctionID
                },
                {
                    mediaType: 'image'
                }
            ]
        })

        const imagesURLs = generateMediaURLs(auctionImages)
        
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

const fetchAuctionVideos = async (request, response) => {

    try {

        auctionVideos = await MediaModel.find({
            $and: [
                {
                    auctionID: request.params.auctionID
                },
                {
                    mediaType: 'video'
                }
            ]
        })

        const videosURLs = generateMediaURLs(auctionVideos)

        return response.status(200).send({
            accepted: true,
            videosURLs: videosURLs,
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

const fetchAuctionMedia = async (request, response) => {

    try {

        auctionMedia = await MediaModel.find({ auctionID: request.params.auctionID })

        const media = splitMediaData(auctionMedia)

        media.images = generateMediaURLs(media.images)
        media.videos = generateMediaURLs(media.videos)
        
        return response.status(200).send({
            accepted: true,
            media: media,
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
    fetchFile,
    fetchAuctionImages,
    fetchAuctionVideos,
    fetchAuctionMedia
}