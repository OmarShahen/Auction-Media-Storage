const express = require('express')
const morgan = require('morgan')
const fileUpload = require('express-fileupload')
const config = require('./config/config')






const app = express()


// middlewares

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(fileUpload({ createParentPath: true, limits: { fileSize: 50 * 1024 * 1024 } }))


// routes

app.use(`/api/${config.service}`, require('./routes/items'))
app.use(`/api/${config.service}`, require('./routes/categories'))

app.get('/', (request, response) => {
    console.log(`${request.protocol}://${request.host}`)
    console.log(request.body)
    return response.status(200).send({
        accepted: true,
        message: 'start your storage bucket service'
    })
})

app.get('/test', (request, response) => {
    return response.status(200).send({
        accepted: true,
        message: 'tested successfully ;)'
    })
})



app.listen(config.port, () => console.log(`server started on port ${config.port} [${config.service}]`))