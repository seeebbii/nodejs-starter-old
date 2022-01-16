const db = require('../service/database');
const { genSaltSync, hashSync } = require('bcrypt');
const jsonWebToken = require('jsonwebtoken');
const e = require('express');



exports.createUser = (req, res, next) => {
    const salt = genSaltSync(10);
    req.body.password = hashSync(req.body.password, salt);

    db.execute('SELECT * FROM users WHERE email = ?', [req.body.email]).then(([rows, fieldData]) => {
        if (rows.length > 0) {
            if (rows[0].email == req.body.email) {
                res.status(409).json({
                    message: 'Email Already exists',
                    success: false
                });
            }
        } else {
            db.execute('INSERT INTO users(name, email, password, gender, number) VALUES (?, ?, ?, ?, ?)', [req.body.name, req.body.email, req.body.password, req.body.gender, req.body.number]).then(([rows, fieldData]) => {
                res.status(200).json({
                    message: 'Account ctreated successfully',
                    success: true
                });
            }).catch(err => {
                res.status(500).json({
                    message: err.message,
                    success: false
                });
            });
        }
    }).catch(err => {
        res.status(500).json({
            message: err.message,
            success: false
        });
    })


}

exports.getUsers = (req, res, next) => {
    db.execute("SELECT id, name, email, gender, number FROM users").then(([rows, fieldData]) => {
        res.status(200).json({
            data: rows,
            success: 1
        });
    }).catch(err => {
        res.status(500).json({
            message: err.message,
            success: false
        });
    })
}

exports.getUserById = (req, res, next) => {
    id = req.params.id;
    db.execute("SELECT * FROM users WHERE id = ?", [id]).then(([rows, fieldData]) => {
        if (rows.length > 0) {
            res.status(200).json({
                data: rows[0],
                success: 1
            });
        } else {
            res.status(404).json({
                data: 'No data found',
                success: 0
            });
        }
    }).catch(err => {
        res.status(500).json({
            message: err.message,
            success: false
        });
    });
}

exports.updateUser = (req, res, next) => {
    id = req.params.id;
    db.execute("UPDATE users SET name = ? , email = ?, gender = ? , number = ? WHERE id = ?", [req.body.name, req.body.email, req.body.gender, req.body.number, id]).then(([rows, fieldData]) => {
        res.status(200).json({
            message: "Updated successfully",
            success: true
        });
    }).catch(err => {
        res.status(500).json({
            message: err.message,
            success: false
        });
    });
}

exports.deleteUser = (req, res, next) => {
    const id = req.params.id;
    db.execute("DELETE FROM users WHERE id = ?", [id]).then(([rows, fieldData]) => {
        res.status(200).json({
            message: "Data deleted",
            data: rows[1],
            fieldData: fieldData,
            success: 1,
            deleted: true,
        });
    }).catch(err => {
        res.status(500).json({
            message: err.message,
            success: false
        });
    });
}