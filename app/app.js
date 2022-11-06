const express = require("express");
const uuid = require("uuid");
const axios = require("axios");
const StatsD = require('hot-shots');

const PORT = process.env.PORT;
const TIMEOUT = process.env.SEGUNDOS_TIMEOUT * 1000;

const appId = uuid.v4();

const app = express();

const client = new StatsD({
    host: "graphite",
    port: 8125
});

app.get("/ping", (req, res) => {
    let start = new Date();
    res.status(200).send(`[${appId}] pong\n`);
    client.timing('ping-latency', new Date() - start);
});

app.get("/bbox/:id([0-1])", (req, res) => {
    const bboxId = req.params.id;
    let start = new Date();
    axios.get(`http://nginx:80/bbox${bboxId}`)
        .then(({status, data}) => res.status(status).send(`[${appId}] ${data}`))
        .catch((err) => {
            console.error(err);
            res.status(500).send(`[${appId}] algo feo pasó`);
        }).finally(() => {
        client.timing(`bbox-[${bboxId}]-latency`, new Date() - start);
    });
});

app.get("/async", (req, res) => {
    let start = new Date();

    setTimeout(() => {
        client.timing(`async-latency`, new Date() - start);
        res.status(200).send(`[${appId}] async done`);
    }, TIMEOUT);
});

app.get("/intensivo", (req, res) => {
    let start = new Date();

    for (const t = new Date(); new Date() - t < TIMEOUT;) {
    }

    client.timing(`intensivo-latency`, new Date() - start);
    res.status(200).send(`[${appId}] intensivo: done`);
});

app.listen(PORT, () => {
    console.log(`[${appId}] Escuchando en ${PORT}`);
});


/// Endpoints para Inscripciones

app.get("/login", (req, res) => {
    setTimeout(() => {
        res.status(200).send(`[${appId}] async done`);
    }, 3000);
});

app.get("/select-career", (req, res) => {
    setTimeout(() => {
        res.status(200).send(`[${appId}] async done`);
    }, 2000);
});

app.get("/enrolled-subjects", (req, res) => {
    setTimeout(() => {
        res.status(200).send(`[${appId}] async done`);
    }, 3500);
});

app.get("/available-subjects", (req, res) => {
    setTimeout(() => {
        res.status(200).send(`[${appId}] async done`);
    }, 4000);
});

app.get("/enroll-subject", (req, res) => {
    setTimeout(() => {
        res.status(200).send(`[${appId}] async done`);
    }, 2500);
});

app.get("/logout", (req, res) => {
    res.status(200).send(`[${appId}] pong\n`);
});