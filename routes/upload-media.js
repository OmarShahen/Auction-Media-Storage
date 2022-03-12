const router = require('express').Router()
const uploadImageController = require('../controllers/upload-media')

//router.post('/auction-media/images', (request, response) => uploadImageController.uploadImage(request, response))

router.post('/auction-media/videos', (request, response) => uploadImageController.uploadVideo(request, response))

router.post('/auction-media/images', (request, response) => uploadImageController.uploadMultipleImages(request, response))

module.exports = router