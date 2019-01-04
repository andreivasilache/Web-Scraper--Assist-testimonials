const express = require('express'),
    reqProm = require('request-promise'),
    fs = require('fs');

const app = express();
const data = require('./manipulateData');
const frontEnd = require('./manipulateFrontEnd');

const port = 8080;
const url = 'https://assist-software.net/testimonials';


app.set('view engine', 'html');
app.use(express.static(__dirname + '/Public'));


app.get("/", (req, res) => {
    data.getDataFromAllPages(url).then(
        () => {
            res.sendFile(__dirname + '/views/index.html');
            data.removeRedundantDataFromCountries();
            data.sortObjectArray();
            data.numberOfTestmonialsByCountry();
            console.log(data.testimonials.length);
        }
    );
});


app.listen(port, () => {
    console.log('Server started at port ' + port);
});