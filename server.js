const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const path = require('path');
const callOpenAi = require('./callOpenAi');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.post('/execute-command', async (req, res) => {
    const command = req.body.command;

    try {
        const result = await callOpenAi(command);
        res.send(result);
    }

    catch (error) {
        res.status(500).send(error.message);
    }
    
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
