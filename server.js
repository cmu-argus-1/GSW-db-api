import express from 'express';
import { get_table } from './lib/api.js';
import { host_ip } from './lib/secrets.js';


const app = express();
const hostname = host_ip;
const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello, world!');
});
app.get('/table/:id', (req, res) => {
    get_table(req.params.id, (err, data) => {
        if (err) {
            console.log(err)
            res.send("not found", 404)
        } else {
            res.send(JSON.stringify(data), 200)
        }

    })
})

app.listen(port, hostname, () => {
    console.log(`server running at http://${hostname}:${port}/`);
});