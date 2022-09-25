const express = require('express');

const PORT = 3000;

const app = express();

app.get('/live', (req, res) => {
    res.status(200).send('ok\n');
});

app.listen(PORT, () => {
    console.log(`Escuchando en ${PORT}`);
});
