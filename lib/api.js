import mysql from 'mysql';
import { db_password } from './secrets.js';


get_table = (table, result) => {
    let con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: db_password,
        database: "heartbeats",
    });
    con.connect((err) => {
        if (err) {
            console.log(err);
            result(err, null);
        }
        console.log("connected");
        let query = `SELECT * from ?`;
        const values = [ table ];
        con.query(query, values, (err, results) => {
            if (err) throw err;
            result(null, result);
            con.end();
        });
    });
};

export { get_table };
