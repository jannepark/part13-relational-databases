// const jwt = require('jsonwebtoken')
// const { SECRET } = require('../util/config')

// // need to implement to check if token is valid in session table
// const tokenExtractor = (req, res, next) => {
//     const authorization = req.get('authorization')
//     console.log('authorization', authorization)
//     if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
//         try {
//             req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
//             console.log('req.token', req.decodedToken)
//         } catch {
//             return res.status(401).json({ error: 'token invalid' })
//         }
//     } else {
//         return res.status(401).json({ error: 'token missing' })
//     }
//     next()
// }

// module.exports = tokenExtractor
const jwt = require('jsonwebtoken');
const { SECRET } = require('../util/config');
const { Session } = require('../models'); // Adjust the path as necessary

const tokenExtractor = async (req, res, next) => {
    const authorization = req.get('authorization');
    console.log('authorization', authorization);

    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        try {
            const token = authorization.substring(7);
            req.decodedToken = jwt.verify(token, SECRET);
            console.log('req.token', req.decodedToken);

            // Check if the token is valid in the session table
            // check if user is disabled
            const session = await Session.findOne({ where: { token } });
            if (!session) {
                return res.status(401).json({ error: 'token invalid' });
            }
            const user = await session.getUser();
            if (!user || user.disabled) {
                return res.status(401).json({ error: 'no user found or account disabled' });
            }
        } catch (error) {
            return res.status(401).json({ error: 'token invalid' });
        }
    } else {
        return res.status(401).json({ error: 'token missing' });
    }
    next();
};

module.exports = tokenExtractor;