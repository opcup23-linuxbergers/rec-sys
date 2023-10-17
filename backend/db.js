const {query} = require("express");
const Pool = require('pg').Pool

const pool = new Pool({
    user: "sasha",
    password: "m4sha",
    host: "185.174.136.203",
    port: 5432,
    database: "rzd"
},{

})

module.exports = pool