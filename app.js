const express = require('express')
const morgan = require('morgan')
const fileUpload = require('express-fileupload')






const app = express()


// middlewares

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(fileUpload({ createParentPath: true }))


// routes

app.use('/file-storage-service/api', require('./routes/fetch-file'))
app.use('/file-storage-service/api', require('./routes/upload-media'))

app.get('/', (request, response) => {
    console.log(request.body)
    return response.status(200).send({
        accepted: true,
        message: 'start your storage bucket service'
    })
})



app.listen(3000, () => console.log(`server started on port ${3000}`))