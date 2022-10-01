const express = require("express");
const axios = require("axios");

const PORT = 3000;
const TIMEOUT = process.env.SEGUNDOS_TIMEOUT * 1000;

const app = express();

app.get("/ping", (req, res) => {
    res.status(200).send("pong\n");
});

app.get("/bbox/:id", (req, res) => {
    const bboxId = req.params.id;

    axios.get(`http://nginx:80/bbox${bboxId}`)
        .then(({ status, data }) => res.status(status).send(data))
        .catch(() => res.status(500).send("algo feo pasó"));
});

app.get("/intensivo", (req, res) => {
    for (const t = new Date(); new Date() - t < TIMEOUT;) { }

    res.status(200).send(`intensivo: done`);
});

app.listen(PORT, () => {
    console.log(`Escuchando en ${PORT}`);
});
