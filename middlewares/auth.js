const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next){
    const token = req.header('autorization')?.split(' ')[1];

    if (!token){
        return res.status(401).json({error: 'Access Denied, no token provider'})
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({error: 'Invalid Toekn'});
    });

    req.user = user;
}

module.exports = authenticateToken;