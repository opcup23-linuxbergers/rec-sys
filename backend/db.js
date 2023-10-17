const {query} = require("express");
const Pool = require('pg').Pool

const pool = new Pool({
    user: "this",
    password: "is",
    host: "so.fucking.stupid",
    port: 5432,
    database: "rzd"
},{

})

module.exports = pool
