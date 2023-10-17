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
        let userData;

        await fetch('http://opcup23-rzd.carried.ru/profile').then((response) => {
            return response.json();
        }).then((data) => {
            userData = data

        }).catch((err) => {
            console.error("Невозможно отправить запрос", err);
        });

        // Создание нового пользователя
        let query = `INSERT INTO public.users(first_name, gender, age, phone) VALUES ($1,$2,$3,$4) RETURNING *;`;
        let values = [userData.first_name, userData.gender, userData.age, userData.phone]
        const newUser = await db.query(query, values)

        res.json({token: generateAuthToken(newUser.rows[0].id)})
    }
}

module.exports = new authController()