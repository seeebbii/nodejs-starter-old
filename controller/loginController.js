const db = require('../service/database');
const { genSaltSync, hashSync, compareSync } = require('bcrypt');
const jsonWebToken = require('jsonwebtoken');



exports.login = (req, res, next) => {
    db.execute('SELECT * FROM USERS WHERE email = ?', [req.body.email]).then(([rows, fieldData]) => {
        if (rows.length > 0) {
            const validPassword = compareSync(req.body.password, rows[0].password);
            if (validPassword) {
                const jsonToken = jsonWebToken.sign({ result: rows[0] }, 'somesupersecretalgo', { expiresIn: "24h" });
                res.status(200).json({
                    message: 'Login Successful',
                    success: true,
                    userId: rows[0].id,
                    token: jsonToken
                });
            } else {
                res.status(404).json({
                    message: "Invalid email or password",
                    success: false
                });
            }

        } else {
            res.status(404).json({
                message: "Invalid email or password",
                success: false
            });
        }

    }).catch(err => {
        res.status(500).json({
            message: err.message,
            success: false
        });
    })
}