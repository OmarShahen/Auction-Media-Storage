
const MediaModel = require('./models/media')



/* const mediaItem = new MediaModel({

    fileName: 'first-image',
    path: 'Auction/1',
    size: 5000,
    auctionID: '1',
    mediaType: 'image',
    mimeType: 'jpg'
})
.save()
.then(data => console.log(data))
.catch(error => console.log(error)) */

const mediaData = MediaModel.find({
    auctionID: '1'
})
.then(data => console.log(data))
.catch(error => console.error(error))
