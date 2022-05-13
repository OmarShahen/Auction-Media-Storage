const router = require('express').Router()
const { response } = require('express')
const itemsController = require('../controllers/items')

//router.post('/auction-media/images', (request, response) => uploadImageController.uploadImage(request, response))

//router.post('/auction-media/videos', (request, response) => itemsController.uploadVideo(request, response))

router.post('/items', (request, response) => itemsController.createItem(request, response))

router.get('/images/:imageID', (request, response) => itemsController.getImage(request, response))

router.get('/items/:itemID/images', (request, response) => itemsController.getImages(request, response))

router.get('/items/:itemID', (request, response) => itemsController.getItem(request, response))

router.get('/auctions/:auctionID/items', (request, response) => itemsController.getAuctionItem(request, response))


module.exports = router