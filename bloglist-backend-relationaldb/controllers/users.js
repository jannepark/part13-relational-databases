const router = require('express').Router()

const { User } = require('../models')
const { Blog } = require('../models')

router.get('/', async (req, res) => {
    const users = await User.findAll({
        include: [{
            model: Blog,
            attributes: { exclude: ['userId'] }
        },
        ]
    })
    res.json(users)
})

router.post('/', async (req, res) => {
    try {
        const user = await User.create(req.body)
        res.json(user)
    } catch (error) {
        return res.status(400).json({ error })
    }
})

router.get('/:id', async (req, res) => {
    const { read } = req.query;
    let readCondition = {};

    if (read === 'true') {
        readCondition = { isRead: true };
    } else if (read === 'false') {
        readCondition = { isRead: false };
    }

    const user = await User.findByPk(req.params.id, {
        attributes: { exclude: [''] },
        include: [
            {
                model: Blog,
                attributes: { exclude: ['userId'] }
            },
            {
                model: Blog,
                as: 'readingBlogs',
                through: {
                    attributes: ['isRead', 'blogId'],
                    where: readCondition
                }
            }

        ]
    });

    if (user) {
        res.json(user);
    } else {
        res.status(404).end();
    }
});

router.put('/:username', async (req, res) => {
    const user = await User.findOne({ where: { username: req.params.username } })
    if (user) {
        console.log('user: ', user)
        user.name = req.body.username
        await user.save()
        res.json(user)
    } else {
        res.status(404).end()
    }

})

module.exports = router