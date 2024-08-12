const router = require('express').Router()
const { ReadingList } = require('../models')

const { User } = require('../models')
const tokenExtractor = require('../middlewares/tokenExtractor')


router.post('/', async (req, res, next) => {
    try {
        const reading_list = await ReadingList.create(req.body)
        res.json(reading_list)
    } catch (error) {
        next(error)
    }
})

router.put('/:id', tokenExtractor, async (req, res, next) => {
    try {
        console.log('PUT: ', req.body);
        const user = await User.findByPk(req.decodedToken.id)
        const reading_list = await ReadingList.findOne({
            where: {
                userId: user.id,
                blogId: req.params.id
            }
        })
        if (reading_list) {
            reading_list.isRead = req.body.read
            await reading_list.save()
            res.json(reading_list)
        } else {
            res.status(404).end()
        }
    } catch (error) {
        next(error)
    }
})


module.exports = router