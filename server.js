import express from 'express';
import { host_ip } from './lib/secrets.js';


const app = express();
const hostname = host_ip;
const port = 3000;

// const server = createServer(
//     (req, res) => {
//         const url = req.url;
//         const method = req.method;
//         if (method == 'GET' && url == '/'){
//             res.statusCode = 200;
//             res.setHeader('Content-Type', 'text/plain');
//             res.end("Hello, World!");
//         }
//     }
// )

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.listen(port, hostname, () => {
    console.log(`server running at http://${hostname}:${port}/`);
});