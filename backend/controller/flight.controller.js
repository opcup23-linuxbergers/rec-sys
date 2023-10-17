const db = require('../db')
const {json} = require("express");

class UserController {
    async getFlights(req, res) {

        let query = `SELECT * FROM race`
        const userData = await db.query(query)

        res.json({status: 'Ok', data: userData.rows})
    }

    async setFlight(req, res) {
        const {from, to, train_id, time} = req.body;
        let query = `INSERT INTO race(train_id, from, to, time) VALUES ($1, $2, $3, $4);`;
        let values = [train_id, from, to, time]

        const newFlightData = await db.query(query, values)
        res.json({status: 'Ok'})
    }

    async newSit(req, res) {

        const {rzd_id, race_id, vagon_number, seat_number, vagon_type} = req.body;

        let query = `SELECT id FROM users WHERE rzd_id = $1`
        let values = [rzd_id]
        const getID = await db.query(query, values)
        const user_id = getID.rows[0].id

        query = `SELECT * FROM reserved_seats WHERE vagon_number=$1 AND seat_number=$2 AND race_id=$3 AND vagon_type=$4`
        values = [vagon_number, seat_number, race_id, vagon_type]
        const reserveCheck = await db.query(query, values)

        if (reserveCheck.rows.length > 0) {
            res.json({error: 'Уже зарезервировано'})
            return
        }
        values = [user_id, vagon_number, seat_number, race_id, vagon_type]
        query = `INSERT INTO reserved_seats(user_id, vagon_number, seat_number, race_id, vagon_type) VALUES ($1,$2,$3,$4,$5);`
        const reserve = await db.query(query, values)
        res.json({status: 'Ok'})
    }

    async getFlight(req, res) {
        const train_id = req.params.id;
        let query = `SELECT trains.id AS train_id, trains.name AS train_name, vagon.id AS vagon_id, vagon.type AS vagon_type, vagon.seats AS vagon_seats,trains_vagon.count AS vagon_count
                            FROM race
                            JOIN trains ON race.train_id = trains.id
                            JOIN trains_vagon ON trains.id = trains_vagon.train_id
                            JOIN vagon ON trains_vagon.vagon_id = vagon.id
                            WHERE race.id = $1;`
        let values = [train_id];
        const data = await db.query(query, values);

        query = `SELECT * FROM reserved_seats WHERE race_id=$1`
        const reserved_seats = await db.query(query, values);

        const plac = []
        const SV = []
        const cupe = []
        for (let item of data.rows) {
            let quads = []
            let duos = []

            // Если плацкарт
            if (item.vagon_id === 1) {
                const vagon_count = item.vagon_count
                for (let vagon_number = 0; vagon_number < vagon_count; vagon_number++) {

                    quads = []
                    duos = []

                    const room_number = 9;
                    let vagon = [];
                    for (let i = 0; i < room_number; i++) {
                        const places = [1, 3, 2, 4]
                        quads.push([
                            {
                                vagon_number: vagon_number,
                                id: places[2] + i * 4,
                                name: 'Верхнее',
                                reserved: reserved_seats.rows.some(obj => obj.vagon_number === vagon_number && (obj.seat_number === places[2] + i * 4) && obj.vagon_type === item.vagon_id)
                            },
                            {
                                vagon_number: vagon_number,
                                id: places[3] + i * 4,
                                name: 'Верхнее',
                                reserved: reserved_seats.rows.some(obj => obj.vagon_number === vagon_number && (obj.seat_number === places[3] + i * 4) && obj.vagon_type === item.vagon_id)
                            },
                            {
                                vagon_number: vagon_number,
                                id: places[0] + i * 4,
                                name: 'Нижнее',
                                reserved: reserved_seats.rows.some(obj => obj.vagon_number === vagon_number && (obj.seat_number === places[0] + i * 4) && obj.vagon_type === item.vagon_id)
                            },
                            {
                                vagon_number: vagon_number,
                                id: places[1] + i * 4,
                                name: 'Нижнее',
                                reserved: reserved_seats.rows.some(obj => obj.vagon_number === vagon_number && (obj.seat_number === places[1] + i * 4) && obj.vagon_type === item.vagon_id)
                            }
                        ])
                    }
                    for (let i = 0; i < room_number; i++) {
                        const places = [54, 53]
                        duos.push([
                            {
                                vagon_number: vagon_number,
                                id: places[0] - i * 2,
                                name: 'Верхнее',
                                reserved: reserved_seats.rows.some(obj => obj.vagon_number === vagon_number && (obj.seat_number === places[2] - i * 2) && obj.vagon_type === item.vagon_id)
                            },
                            {
                                vagon_number: vagon_number,
                                id: places[1] - i * 2,
                                name: 'Нижнее',
                                reserved: reserved_seats.rows.some(obj => obj.vagon_number === vagon_number && (obj.seat_number === places[2] - i * 2) && obj.vagon_type === item.vagon_id)
                            },
                        ])
                    }


                    vagon.push(quads)
                    vagon.push(duos)
                    plac.push(vagon)
                }
            }
            // Купе
            if (item.vagon_id === 3) {
                const vagon_count = item.vagon_count
                for (let vagon_number = 0; vagon_number < vagon_count; vagon_number++) {
                    quads = []
                    // Количество купе
                    const room_number = 9;
                    // let rooms = [];
                    for (let i = 0; i < room_number; i++) {
                        const places = [1, 3, 2, 4]
                        quads.push([
                            {
                                vagon_number: vagon_number,
                                id: places[2] + i * 4,
                                name: 'Верхнее',
                                reserved: reserved_seats.rows.some(obj => obj.vagon_number === vagon_number && (obj.seat_number === places[2] + i * 4) && obj.vagon_type === item.vagon_id)
                            },
                            {
                                vagon_number: vagon_number,
                                id: places[3] + i * 4,
                                name: 'Верхнее',
                                reserved: reserved_seats.rows.some(obj => obj.vagon_number === vagon_number && (obj.seat_number === places[3] + i * 4) && obj.vagon_type === item.vagon_id)
                            },
                            {
                                vagon_number: vagon_number,
                                id: places[0] + i * 4,
                                name: 'Нижнее',
                                reserved: reserved_seats.rows.some(obj => obj.vagon_number === vagon_number && (obj.seat_number === places[0] + i * 4) && obj.vagon_type === item.vagon_id)
                            },
                            {
                                vagon_number: vagon_number,
                                id: places[1] + i * 4,
                                name: 'Нижнее',
                                reserved: reserved_seats.rows.some(obj => obj.vagon_number === vagon_number && (obj.seat_number === places[1] + i * 4) && obj.vagon_type === item.vagon_id)
                            },
                        ])
                    }
                    cupe.push(quads)
                }
            }
            // SV
            if (item.vagon_id === 2) {
                const vagon_count = item.vagon_count
                for (let vagon_number = 0; vagon_number < vagon_count; vagon_number++) {
                    duos = []
                    // Количество купе
                    const room_number = 9;
                    // let rooms = [];
                    for (let i = 0; i < room_number; i++) {
                        const places = [1, 2]
                        quads.push([
                            {vagon_number: vagon_number, id: places[0] + i * 2, name: 'Нижнее', reserved: false},
                            {vagon_number: vagon_number, id: places[1] + i * 2, name: 'Нижнее', reserved: false}
                        ])
                    }
                    SV.push(quads)
                }
            }
        }
        res.json([
            {vagon_type: 1, name: 'Плацкарт', seats: plac},
            {vagon_type: 2, name: 'СВ', seats: SV},
            {vagon_type: 3, name: 'Купе', seats: cupe}
        ])
    }

    async reserveSeat(req, res) {
        const id = req.user.id;
        const race_id = req.params.id;
        const {vagon_number, seat_number, vagon_type} = req.body;

        let query = `SELECT * FROM reserved_seats WHERE vagon_number=$1 AND seat_number=$2 AND race_id=$3 AND vagon_type=$4`
        let values = [vagon_number, seat_number, race_id, vagon_type]
        const reserveCheck = await db.query(query, values)

        if (reserveCheck.rows.length > 0) {
            res.json({error: 'Уже зарезервировано'})
            return
        }
        values = [id, vagon_number, seat_number, race_id, vagon_type]
        query = `INSERT INTO public.reserved_seats(user_id, vagon_number, seat_number, race_id, vagon_type) VALUES ($1,$2,$3,$4,$5);`
        const reserve = await db.query(query, values)
        res.json({status: 'Ok', data: reserve.rows[0]})
    }
}

module.exports = new UserController()