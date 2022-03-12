const router = require('express').Router()
const fetchFileController = require('../controllers/fetch-file')


router.get('/auction-media/view/:mediaID', (request, response) => fetchFileController.fetchFile(request, response))

router.get('/auction-media/images/:auctionID', (request, response) => fetchFileController.fetchAuctionImages(request, response))

router.get('/auction-media/videos/:auctionID', (request, response) => fetchFileController.fetchAuctionVideos(request, response))

router.get('/auction-media/:auctionID', (request, response) => fetchFileController.fetchAuctionMedia(request, response))


module.exports = router