
const errorHandler = (err, req, res, next) => {
    console.error(err.message);

    if (err.name === 'RequestFieldError') {
        return res.status(400).json({ error: err.message });
    }

    if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ error: err.errors.map(e => e.message) });
    }

    res.status(500).json({ error: 'Internal Server Error' });
};

module.exports = errorHandler;
