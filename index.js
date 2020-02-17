// import { API_CONFIG } from './config.js';

const express = require('express');
const request = require('request');
const LimitingMiddleware = require('limiting-middleware');

const app = express();
const PORT = 3000;
const API_KEY = // insert api key here

app.use(new LimitingMiddleware({limit: 20, resetInterval: 120000}).limitByIp());

app.use((req, res, next) => {
    console.log('Request details. Method:', req.method, 'original url', req.originalUrl);

    next();
});

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');

    next();
});

getSummonerInfo = (summonerName) => {

    return new Promise((resolve, reject) => {    
        request({
            url: `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${API_KEY}`
            },
            (error, response, body) =>{
                console.log(body);
                if (error || response.statusCode !== 200) {
                    return reject( new Error('Error Requesting summ'));
                }    

                resolve(JSON.parse(body));
            });
        })
}


app.get('/ping', (req, res) => {
    res.send('pong');
});

app.get('/summoner-info', (req, res, next) => {

    getSummonerInfo(req.query.summoner)
    .then((summonerInfo) => {
        const summId = summonerInfo.id;
        // Will only hit NA so it doesnt matter lol
        request({
            url: `https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summId}?api_key=${API_KEY}`
        },
            (error, response, body) => {
                res.json(JSON.parse(body));
            });
        }
    )
});

app.get('/summoner-ingame', (req, res, next) => {

    getSummonerInfo(req.query.summoner)
    .then((summonerInfo) => {
        const summId = summonerInfo.id;
        // Will only hit NA so it doesnt matter lol
        request({
            url: `https://na1.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/${summId}?api_key=${API_KEY}`
        },
            (error, response, body) => {
                res.json(JSON.parse(body));
            });
        }
    )
});

app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});

app.use((err, req, res, next) => {
    console.log('err: ', err);

    res.status(500).json({
        type: 'error',
        message: err.message
    })

    
    res.status(404).json({
        type: 'error',
        message: 'Could not be found'
    })
});

module.exports = {
    app
};