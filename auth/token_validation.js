const { verify } = require('jsonwebtoken');


exports.checkToken = (req, res, next) => {
    let token = req.get('authorizations');
    if (token) {
        token = token.replace("Bearer", "");
        verify(token, "somesupersecretalgo", (err, decoded) => {
            if (err) {
                res.status(400).json({
                    success: false,
                    message: err.message,
                });
            } else {
                next();
            }
        });
    } else {
        res.status(401).json({
            success: false,
            message: 'Access Denied: Unauthorized user',
        })
    }
}