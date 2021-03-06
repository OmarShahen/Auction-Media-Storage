const categoryModel = require('../models/collection')

const getCategories = async (request, response) => {

    try {

        const categories = await categoryModel.find().select({ '__v': 0 })

        return response.status(200).send({
            accepted: true,
            categories: categories
        })
         
    } catch(error) {
        console.error(error)
        return response.status(500).send({
            accepted: false,
            message: 'internal server error'
        })
    }
}

const addCategory = async (request, response) => {

    try {

        if(!request.body.name) {
            return response.status(406).send({
                accepted: false,
                message: 'category name is required',
                field: 'name'
            })
        }

        if(!request.body.imageURL) {
            return response.status(406).send({
                accepted: false,
                message: 'category image is required',
                field: 'imageURL'
            })
        }

        const categories = await categoryModel.find({ name: request.body.name })
        if(categories.length != 0) {
            return response.status(406).send({
                accepted: false,
                message: 'category name is already used'
            })
        }

        const Category = new categoryModel({
            name: request.body.name,
            imageURL: request.body.imageURL
        })

        const saveCategory = await Category.save()

        return response.status(200).send({
            accepted: true,
            message: 'category added successfully!'
        })

    } catch(error) {
        console.error(error)
        return response.status(500).send({
            accepted: false,
            message: 'internal server error'
        })
    }
}


module.exports = { getCategories, addCategory }