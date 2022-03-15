const router = require('express').Router()
const categoriesController = require('../controllers/categories')

router.get('/categories', (request, response) => categoriesController.getCategories(request, response))

router.post('/categories', (request, response) => categoriesController.addCategory(request, response))

module.exports = router
