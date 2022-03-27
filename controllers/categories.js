const categoryModel = require('../models/categories')

const getCategories = async (request, response) => {

    try {

        const categories = await categoryModel.find().select({ '_id': 0, '__v': 0 })

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
                message: 'category name is required'
            })
        }

        if(!request.body.description) {
            return response.status(406).send({
                accepted: false,
                message: 'category description is required'
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
            description: request.body.description
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

const addSubCategory = async (request, response) => {

    try {

        const subCategory = {}
        const category = await categoryModel.find({ name: request.params.categoryName })

        if(category.length == 0) {
            return response.status(406).send({
                accepted: false,
                message: 'invalid category name'
            })
        }

        if(!request.body.name) {
            return response.status(406).send({
                accepted: false,
                message: 'sub-category name is required'
            })
        }

        const getSubCat = await categoryModel.find({ subCategories: { $elemMatch: { 'name': request.body.name }}})

        if(getSubCat.length != 0) {
            return response.status(406).send({
                accepted: false,
                message: 'this sub-category name is taken'
            })
        }

        subCategory['name'] = request.body.name

        if(request.body.description) {
            subCategory['description'] = request.body.description
        }

        console.log(subCategory)

        const addSubCat = await categoryModel.findOneAndUpdate({
            name: request.params.categoryName
        }, {
            $push: {
                subCategories: subCategory
            }
        })

        return response.status(200).send({
            accepted: true,
            message: 'sub-category added successfully'
        })

    } catch(error) {
        console.error(error)
        return response.status(500).send({
            accepted: false,
            message: 'internal server error'
        })
    }
}

module.exports = { getCategories, addCategory, addSubCategory }