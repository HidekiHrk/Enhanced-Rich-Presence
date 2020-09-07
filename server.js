const express = require('express');
const serverSettings = {
    serverPort: 45313
}

const server = express();

server.use(express.json());

server.post('/sla', (req, res) => {
    const body = req.body;
    console.log(body);
    res.status(200).json(body);
});


server.listen(serverSettings.serverPort);
