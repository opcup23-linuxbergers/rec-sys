const db = require('../db');
const jwt = require("jsonwebtoken");
const {query} = require("express");
const saltRounds = 10;
//const { nanoid } =  require('nanoid/async');

const generateAuthToken = function (id) {
    return jwt.sign({id: id}, 'shhhhh'
        //     , {
        //     expiresIn: '300000'
        // }
    );
};

class authController {
    async auth(req, res) {

        // Создание нового пользователя
        let query = `INSERT INTO users DEFAULT VALUES RETURNING *;`

        const newUser = await db.query(query)
        res.json({token: generateAuthToken(newUser.rows[0].id)})
    }
}

module.exports = new authController()