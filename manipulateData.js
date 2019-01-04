const $ = require('cheerio'),
    reqProm = require('request-promise');


var testimonials = [];
var countries = [];
var countryNumberOfTestimonials = [];

function pushPersonToArray(name, profileImg, country) {
    testimonials.push({
        country: country,
        name: name,
        profileImg: profileImg,
    })
}

async function getDataFromAllPages(url) {
    await getHtmlData(url)
    for (var i = 1; i < 4; i++) {
        let exentedUrl = '?page=' + i;
        await getHtmlData(url + exentedUrl);
    }
}

async function getHtmlData(url) {
    await reqProm(url)
        .then((html) => {
            let numberOfElements = $('div .testimonial-author > .testimonial-author ', html).length;
            let author = $('div .testimonial-author > .testimonial-author ', html);
            let country = $('.field-content > .testimonial-author >  .testimonial-country > .country', html);
            let porfileImg = $('.field-content > .testimonial-author > p > a > img', html);

            for (let i = 0; i < numberOfElements; i++) {
                pushPersonToArray(author[i].children[0].data, porfileImg[i].attribs.src, country[i].children[0].data)
            }
        })
        .catch((err) => {
            console.log(err);
        })
}


function removeRedundantDataFromCountries() {
    let unique = {};
    testimonials.forEach((i) => {
        if (!unique[i.country]) {
            unique[i.country] = true;
            countries.push(i.country);
        }
    });
}

function sortObjectArray() {
    testimonials.sort(function (a, b) {
        let x = a.country.toUpperCase();
        let y = b.country.toUpperCase();
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

function numberOfTestmonialsByCountry() {
    for (let i = 0; i < countries.length; i++) {
        let countryTotalNumber = testimonials.filter(country => country.country === countries[i]);
        countryNumberOfTestimonials.push({
            country: countries[i],
            numberOfTestimonials: countryTotalNumber.length - 1
        });
    }
}

module.exports = {
    testimonials,
    countries,
    getDataFromAllPages,
    removeRedundantDataFromCountries,
    sortObjectArray,
    numberOfTestmonialsByCountry
}