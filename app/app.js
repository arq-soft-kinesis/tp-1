const express = require("express");
const uuid = require("uuid");
const axios = require("axios");

const PORT = process.env.PORT;
const TIMEOUT = process.env.SEGUNDOS_TIMEOUT * 1000;

const appId = uuid.v4();

const app = express();

app.get("/ping", (req, res) => {
    res.status(200).send(`[${appId}] pong\n`);
});

app.get("/bbox/:id([0-1])", (req, res) => {
    const bboxId = req.params.id;

    axios.get(`http://nginx:80/bbox${bboxId}`)
        .then(({ status, data }) => res.status(status).send(`[${appId}] ${data}`))
        .catch((err) => {
            console.error(err);
            res.status(500).send(`[${appId}] algo feo pasó`);
        });
});

app.get("/async", (req, res) => {
    setTimeout(() => {
        res.status(200).send(`[${appId}] async done`);
    }, TIMEOUT);
});

app.get("/intensivo", (req, res) => {
    for (const t = new Date(); new Date() - t < TIMEOUT;) { }

    res.status(200).send(`[${appId}] intensivo: done`);
});

app.listen(PORT, () => {
    console.log(`[${appId}] Escuchando en ${PORT}`);
});
