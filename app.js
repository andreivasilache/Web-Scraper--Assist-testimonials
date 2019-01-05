const express = require('express');
const app = express();

const data = require('./manipulateData');

const port = 8080;
const url = 'https://assist-software.net/testimonials';


app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/Public'));


app.get("/", (req, res) => {
    if (data.testimonials.length == 0) {
        data.getDataFromAllPages(url).then(
            () => {
                data.appFlow();
                indexRender(res);
            })
    } else {
        indexRender(res);
    }
});

function indexRender(res) {
    res.render('index', {
        countries: data.getCountries(),
        testimonials: data.testimonials,
        numberOfTestiminialsPerCountry: data.countryNumberOfTestimonials
    });
}


app.listen(port, () => {
    console.log('Server started at port ' + port);
});