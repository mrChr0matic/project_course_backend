const moment = require('moment');

const logger = (req, res, next) => {
    console.log(`[${req.method}] ${req.originalUrl}: (${moment()})`);
    next(); 
};


module.exports = logger;    