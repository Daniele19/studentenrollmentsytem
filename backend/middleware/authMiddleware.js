const jwt    = require('jsonwebtoken')
const config = require("../config/config");

module.exports = {
    verifyToken: function (req, res, next) {
        // Get auth header value
        const bearerHeader = req.body.token || req.query.token || req.headers["x-access-token"] || req.headers['authorization'];
        // Check if bearer is undefined
        if(typeof bearerHeader !== 'undefined') {
            // Split at the space
            const bearer = bearerHeader.split(' ');
            // Get token from array & get the token
            if(bearer.length>0) req.token = bearer[1];
            else req.token = bearerHeader;
            // Next middleware
            try {
                const decoded = jwt.verify(req.token, config.JWT_KEY);
                req.user      = decoded;
                req.userId    = decoded; //we added userId property to the req
            } catch (err) {
                return res.status(401).send("Invalid Token");
            }
            next();
        } else {
            // Forbidden
            res.sendStatus(403);
        }
    }
};