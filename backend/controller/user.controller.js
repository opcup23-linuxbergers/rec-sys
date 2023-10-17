const db = require('../db')
const e = require("express");
const {json} = require("express");

class UserController {
    async getDistance(req, res) {
        const {user, neighbours} = req.body;
        await fetch(`http://opcup23-rec.carried.ru/dist`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user: user,
                neighbours: neighbours
            })
        }).then(response => {
            return response.json()
        }).then((data) => {
            if (data) {
                res.json(data.distance)
                return
            }
        }).catch(error => {
            // handle error
        });
    }

    async match(req, res) {
        const race_id = req.params.id;

        let query = `SELECT reserved_seats.*, users.cluster
                            FROM reserved_seats
                            JOIN users ON reserved_seats.user_id = users.id
                            WHERE reserved_seats.race_id = $1 AND users.cluster IS NOT NULL;`
        let values = [race_id]
        let usersData = await db.query(query, values)
        res.json(usersData.rows)
    }

    async getUser(req, res) {
        const id = req.user.id;

        // let query = `SELECT * FROM users WHERE id = $1`
        let query = `SELECT * FROM users WHERE id = $1`
        let values = [id]
        let userData = await db.query(query, values)

        query = `SELECT i.*
                            FROM users u
                            JOIN user_interests ui ON u.id = ui.user_id
                            JOIN interests i ON ui.interest_id = i.id
                            WHERE u.id = $1;`

        const userInterests = await db.query(query, values)

        userData.rows[0]['interests'] = userInterests.rows

        res.json({status: 'Ok', data: userData.rows[0]})

    }

    async editUser(req, res) {
        const id = req.user.id;

        const {sociality, bad_habits, job, interests} = req.body;

        if (!sociality && !bad_habits && !job && !interests) {
            res.status(400).json({error: 'Пустые значения'})
            return
        }

        let values = [sociality, job, id]
        let query = `UPDATE users SET sociality=$1, job=$2 WHERE id=$3 RETURNING *`
        const userData = await db.query(query, values)
        // todo:ВОТ ТУТ КАКОЕ-ТО ГОВНО
        let newInterests = []
        if (interests && interests.length > 0) {
            query = `DELETE FROM user_interests WHERE user_id=$1`
            values = [id]
            const deleteInterests = await db.query(query, values)

            for (const item in interests) {
                let values = [id, interests[item]]
                let query = 'INSERT INTO user_interests (user_id, interest_id) SELECT $1, $2 WHERE NOT EXISTS (SELECT * FROM user_interests WHERE user_id = $1 AND interest_id = $2) RETURNING *;'
                const newInterest = await db.query(query, values)
                newInterests.push(newInterest.rows[0].interest_id)
            }
        }

        let newBadHabits = []
        if (bad_habits && bad_habits.length > 0) {
            query = `DELETE FROM user_bad_habits WHERE user_id=$1`
            values = [id]
            const deleteBadHabits = await db.query(query, values)

            for (const item in bad_habits) {
                let values = [id, bad_habits[item]]
                let query = 'INSERT INTO user_bad_habits (user_id, bad_habits_id) SELECT $1, $2 WHERE NOT EXISTS (SELECT * FROM user_bad_habits WHERE user_id = $1 AND bad_habits_id = $2) RETURNING *;'
                const newBadHabit = await db.query(query, values)
                newBadHabits.push(newBadHabit.rows[0].bad_habits_id)
            }
        }

        async function interestsMap() {
            if (interests.length > 0) {
                query = `SELECT name FROM interests WHERE id IN (${interests.map(i => `'${i}'`).join(', ')});`
                const getInterests = await db.query(query)
                return getInterests.rows.map(item => item.name)
            } else return []
        }

        async function habitsMap() {
            if (bad_habits.length > 0) {
                query = `SELECT name FROM bad_habits WHERE id IN (${interests.map(i => `'${i}'`).join(', ')});`
                const getHabits = await db.query(query)
                return getHabits.rows.map(item => item.name)
            } else return []
        }

        let getCluster = {
            "age": await userData.rows[0].age,
            "sex": await userData.rows[0].gender,
            "interests": await interestsMap(),
            "bad_habits": await habitsMap(),
            "job": job,
            "sociality": sociality
        }
        let cluster;
        await fetch('http://opcup23-rec.carried.ru/cluster', {
            method: 'POST',
            body: JSON.stringify(getCluster)
        }).then((response) => {
            return response.json();
        }).then((data) => {
            if (data) {
                cluster = data.cluster
            }
        }).catch((err) => {
            console.error("Невозможно отправить запрос", err);
        });
        values = [cluster, id]
        query = `UPDATE users SET cluster=$1 WHERE id=$2 RETURNING *`
        const newCluster = await db.query(query, values)

        res.json({
            userData: newCluster.rows[0],
            interests: newInterests,
            bad_habits: newBadHabits
        })
    }

    async addNewUser(req, res) {
        const {first_name, gender, age, rzd_id, sociality, bad_habits, job, interests, phone} = req.body;

        let getCluster = {
            "age": age,
            "sex": gender,
            "interests": interests,
            "bad_habits": bad_habits,
            "job": job,
            "sociality": sociality
        }
        let cluster;
        await fetch('http://opcup23-rec.carried.ru/cluster', {
            method: 'POST',
            body: JSON.stringify(getCluster)
        }).then((response) => {
            return response.json();
        }).then((data) => {
            if (data) {
                cluster = data.cluster
            }
        }).catch((err) => {
            console.error("Невозможно отправить запрос", err);
        });

        let values = [first_name, gender, age, rzd_id, sociality, job, phone, cluster]
        let query = `INSERT INTO public.users(first_name, gender, age, rzd_id, sociality, job,phone,cluster) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *;`;
        const userData = await db.query(query, values)
        let mapa = interests.map(i => `'${i}'`).join(', ')
        query = `SELECT id FROM interests WHERE name IN (${mapa});`
        const getInterestsId = await db.query(query)
        let interestsArray = getInterestsId.rows.map(obj => obj.id)
        let newInterests = [];
        for (const item in interestsArray) {
            let values = [userData.rows[0].id, interestsArray[item]]
            let query = 'INSERT INTO user_interests (user_id, interest_id) SELECT $1, $2 WHERE NOT EXISTS (SELECT * FROM user_interests WHERE user_id = $1 AND interest_id = $2) RETURNING *;'
            const newInterest = await db.query(query, values)
            newInterests.push(newInterest.rows[0].interest_id)
        }

        query = `SELECT id FROM bad_habits WHERE name IN (${bad_habits.map(i => `'${i}'`).join(', ')});`

        const getHabitsId = await db.query(query)
        let habitsArray = getHabitsId.rows.map(obj => obj.id)
        let newHabits = [];
        for (const item in habitsArray) {
            let values = [userData.rows[0].id, habitsArray[item]]
            let query = 'INSERT INTO user_bad_habits (user_id, bad_habits_id) SELECT $1, $2 WHERE NOT EXISTS (SELECT * FROM user_bad_habits WHERE user_id = $1 AND bad_habits_id = $2) RETURNING *;'
            const newHabit = await db.query(query, values)
            newHabits.push(newHabit.rows[0].bad_habits_id)
        }

        res.json({
            userData: userData.rows[0],
            interests: newInterests,
            bad_habits: newHabits
        })
    }

    async addUserInterests(req, res) {
        const id = req.user.id;
        const {interests} = req.body;

        let query = `DELETE FROM user_interests WHERE user_id=$1`
        const values = [id]
        const deleteInterests = await db.query(query, values)

        for (const item in interests) {
            let values = [id, interests[item]]
            let query = 'INSERT INTO user_interests (user_id, interest_id) SELECT $1, $2 WHERE NOT EXISTS (SELECT * FROM user_interests WHERE user_id = $1 AND interest_id = $2);'
            const newInterests = await db.query(query, values)
        }

        res.json({status: 'Ok'})
    }

    async addUserBadHabits(req, res) {
        const id = req.user.id;
        const {habits} = req.body;

        let query = `DELETE FROM user_bad_habits WHERE user_id=$1`
        const values = [id]
        const deleteHabits = await db.query(query, values)

        for (const item in habits) {
            let values = [id, habits[item]]
            let query = 'INSERT INTO user_bad_habits (user_id, bad_habits_id) SELECT $1, $2 WHERE NOT EXISTS (SELECT * FROM user_bad_habits WHERE user_id = $1 AND bad_habits_id = $2);'
            const newHabits = await db.query(query, values)
        }

        res.json({status: 'Ok'})
    }
}

module.exports = new UserController()