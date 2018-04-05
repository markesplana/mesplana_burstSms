require('dotenv').config();
require('es6-promise').polyfill();
require('isomorphic-fetch');


const bodyParser = require('body-parser')

const Promise = require('bluebird');

const express = require('express');

const request = require('request');

const app = express();

const jsonParser = bodyParser.json()

app.get('/api/customers', (req, res) => {
    const customers = [
        {id: '1', firstName: 'Nem', lastName: 'Ramos'},
        {id: '2', firstName: 'Ron', lastName: 'Tayag'},
        {id: '3', firstName: 'Mac', lastName: 'Esplana'}
    ];

    res.json(customers);
});

app.get('/api/shortenurl', (req, res) => {
    const { url } = req.query;
    const urlArr = url.split(",")
    Promise.map(urlArr, link => (
           fetch(`https://api-ssl.bitly.com/v3/shorten?access_token=${process.env.BITLY_ACCESS_TOKEN}&longUrl=${link}`)
        .then(res => res.json())
        .then(res => res.data.url)
    ))
    .then(result => {
        console.log(result)
        res.send(result)
    })
});

app.post('/api/sendsms', jsonParser, (req, res) => {
    const { message, to } = req.body
        const options = { method: 'POST',
        url: process.env.BURSTSMS_SEND_SMS_URL,
        auth: {
            user: process.env.BURSTSMS_API_KEY,
            pass: process.env.BURSTSMS_API_SECRET,
            sendImmediately: true
          },
        form: { message, to } };

        request(options, function (error, response, body) {
        if (error) throw new Error(error)
            console.log(body)
            res.send(body)
        });
});

const port = 5000;

app.listen( port, () => console.log(`Server started at port ${port}`));