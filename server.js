import cors from 'cors';
import express from 'express';
import { get_last_n_from_table, get_table_time_range } from './lib/api.js';
import { host_ip } from './lib/secrets.js';

const app = express();
const hostname = host_ip;
const port = 3000;

app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.get('/heartbeat/by_time/:table', (req, res) => {
    const start_time = req.query.start_time || "-1h";
    const stop_time = req.query.stop_time || "now()";
    get_table_time_range(req.params.table, start_time, stop_time, (err, data) => {
        if (err) {
            console.log(err);
            res.status(404).send("not found");
        } else {
            res.contentType('application/json');
            res.status(200).send(JSON.stringify(data));
        }
    })
})

app.get('/heartbeat/by_last/:table', (req, res) => {
    const n = req.query.n || 20;
    const offset = req.query.offset || 0;
    get_last_n_from_table(req.params.table, n, offset, (err, data) => {
        if (err) {
            console.log(err);
            res.status(404).send("not found");
        } else {
            res.contentType('json');
            res.status(200).send(JSON.stringify(data));
        }
    })
})

app.listen(port, hostname, () => {
    console.log(`server running at http://${hostname}:${port}/`);
});