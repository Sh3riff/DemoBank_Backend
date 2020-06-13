const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // refresh token would be implemented here later.

    jwt.verify(token, process.env.JWT_ACCESS_TOKEN, async (err, user) => {
        if(err) return req.user = "noAuth";
        req.user = user.AccountNumber;
    })
    next();
}