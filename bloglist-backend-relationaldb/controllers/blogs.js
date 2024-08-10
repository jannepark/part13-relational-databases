const router = require('express').Router()
const { Blog } = require('../models')
const RequestFieldError = require('../middlewares/requestFieldError')
const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')
const { User } = require('../models')
const { Op } = require('sequelize')

const blogFinder = async (req, res, next) => {
    try {
        const blog = await Blog.findByPk(req.params.id)
        if (blog) {
            req.blog = blog
            next()
        } else {
            res.status(404).end()
        }
    } catch (error) {
        next(error)
    }
}
const tokenExtractor = (req, res, next) => {
    const authorization = req.get('authorization')
    console.log('authorization', authorization)
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        try {
            console.log('heps')
            req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
            console.log('req.token', req.decodedToken)
        } catch {
            return res.status(401).json({ error: 'token invalid' })
        }
    } else {
        return res.status(401).json({ error: 'token missing' })
    }
    next()
}


router.get('/', async (req, res, next) => {
    try {

        const where = {}
        if (req.query.search) {
            where[Op.or] = [
                { title: { [Op.iLike]: `%${req.query.search}%` } },
                { author: { [Op.iLike]: `%${req.query.search}%` } }
            ]
        }

        const blogs = await Blog.findAll({
            attributes: { exclude: ['userId'] },
            include: {
                model: User,
                attributes: ['name']
            },
            where,
            order: [['likes', 'DESC']]
        })
        console.log(JSON.stringify(blogs, null, 2))
        res.json(blogs)
    } catch (error) {
        next(error)
    }
})

router.post('/', tokenExtractor, async (req, res, next) => {
    try {
        console.log('POST: ', req.body);
        // const blog = await Blog.create(req.body)

        const user = await User.findByPk(req.decodedToken.id)
        const blog = await Blog.create({ ...req.body, userId: user.id })
        res.json(blog)
    } catch (error) {
        next(error)
    }
})

router.delete('/:id', tokenExtractor, blogFinder, async (req, res, next) => {
    try {
        if (req.blog) {
            if (req.blog.userId === req.decodedToken.id) {
                await req.blog.destroy()
            } else {
                return res.status(401).json({ error: 'Unauthorized' })
            }
            res.status(204).end()
        } else {
            res.status(404).end()
        }
    } catch (error) {
        next(error)
    }
})

router.put('/:id', blogFinder, async (req, res, next) => {
    try {
        console.log(req.body);
        if (!req.body.hasOwnProperty('likes')) {
            throw new RequestFieldError('likes field is required');
        }

        if (req.blog) {
            req.blog.likes = req.body.likes;
            await req.blog.save();
            res.json(req.blog);
        } else {
            res.status(404).end();
        }
    } catch (error) {
        next(error);
    }
});

module.exports = router
