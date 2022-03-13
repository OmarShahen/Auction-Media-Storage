const router = require('express').Router()
const itemsController = require('../controllers/items')

//router.post('/auction-media/images', (request, response) => uploadImageController.uploadImage(request, response))

//router.post('/auction-media/videos', (request, response) => itemsController.uploadVideo(request, response))

router.post('/auction-media/items', (request, response) => itemsController.createItem(request, response))

router.get('/auction-media/view/:mediaID', (request, response) => itemsController.getImage(request, response))

router.get('/auction-media/:itemID', (request, response) => itemsController.getImages(request, response))

module.exports = router