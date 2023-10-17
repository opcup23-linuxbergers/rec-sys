const db = require('../db')

class InterestsController {
    async getInterests(req, res) {
        let query = 'SELECT * FROM interests'
        const interestsData = await db.query(query)
        res.json({status: 'Ok', data: interestsData.rows})
    }
}

module.exports = new InterestsController()