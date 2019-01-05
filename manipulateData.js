/*
    '6. If an author belongs to multiple countries, display him under each country'

     On website the maximum number of countries that an author can belong is 2,
    so I used string manipulation instead of an array,for simplicity.
    See line 101 and 102.

*/


const $ = require('cheerio'),
    reqProm = require('request-promise');


var testimonials = [];
var countries = [];
var countryNumberOfTestimonials = [];

function getCounteris() {
    return countries.slice();
}

function pushPersonToArray(name, profileImg, country) {
    testimonials.push({
        country: country,
        name: name,
        profileImg: profileImg,
    })
}

async function getDataFromAllPages(url) {
    await getHtmlData(url);
    for (var i = 1; i < 4; i++) {
        let exentedUrl = '?page=' + i;
        await getHtmlData(url + exentedUrl);
    }
}

async function getHtmlData(url) {
    await reqProm(url)
        .then((html) => {
            let numberOfElementsPerRequest = $('div .testimonial-author > .testimonial-author ', html).length;
            let author = $('div .testimonial-author > .testimonial-author ', html);
            let country = $('div .field-content > .testimonial-author >  .testimonial-country ', html);
            let profileImg = $('.field-content > .testimonial-author > p > a > img', html);

            pushDataToTestimonialsArray(author, profileImg, country, numberOfElementsPerRequest);
        })
        .catch((err) => {
            console.log(err);
        })
}

function pushDataToTestimonialsArray(author, profileImg, country, numberOfElementsPerRequest) {
    for (let i = 0; i < numberOfElementsPerRequest; i++) {
        countries.push(country[i].children[1].children[0].data);
        let countryElements = country[i].children[1].children[0].data + secondCountryValidator(country[i].children[4])
        pushPersonToArray(author[i].children[0].data, profileImg[i].attribs.src, countryElements)
    }
}

function secondCountryValidator(secondCountry) {
    if (secondCountry !== undefined) {
        return ' ' + secondCountry.children[0].data;
    } else {
        return '';
    }
}

function removeRedundantDataFromCountries() {
    let unique = {};
    let pivotArray = [];

    countries.forEach((i) => {
        if (!unique[i]) {
            unique[i] = true;
        }
    });
    pivotArray.push(Object.getOwnPropertyNames(unique));
    countries.length = 0;
    countries = pivotArray[0]

}

function sortObjectArray() {
    countries.sort(function (a, b) {
        return ((a < b) ? -1 : ((a > b) ? 1 : 0));
    });
}

function numberOfTestimonialsByCountry() {
    let countryTotalNumber;

    for (let i = 0; i < countries.length; i++) {

        countryTotalNumber = testimonials.filter(
            testimonial =>
            countries[i] === testimonial.country[0] + testimonial.country[1] ||
            countries[i] === testimonial.country[3] + testimonial.country[4]
        );

        countryNumberOfTestimonials.push({
            country: countries[i],
            numberOfTestimonials: countryTotalNumber.length
        });

    }
}

function appFlow() {
    removeRedundantDataFromCountries();
    sortObjectArray();
    numberOfTestimonialsByCountry();
}

module.exports = {
    testimonials,
    countries,
    countryNumberOfTestimonials,

    getCounteris,
    getDataFromAllPages,
    appFlow
}