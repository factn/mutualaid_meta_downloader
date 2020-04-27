
const fs = require('fs');
const _ = require('underscore')
//const csv = require('csvtojson')
const { Parser } = require('json2csv');
const axios = require("axios");

// for more relaxed 'json' parsing eg keys without quotes
const JSON5 = require('json5')

function splitLines(t) {
    return t.split(/\r\n|\r|\n/); 
}


async function getDataFromMutualAidWiki() {

    const url = "https://mutualaid.wiki/api/group/get"
   
    var data = {}
    try {
        const response = await axios.get(url);
        data = response.data;
        // dont need to do this axios already parsed it
        // let json_data = JSON5.parse(data);
    } catch (error) {
        console.log(error);
    }

    //console.log(data)
   
    var mapped = _.flatten(_.map(data, function(doc) {
        
        var homepage = "" + doc.link_facebook;
        var facebook = (homepage.includes("facebook.com")) ?
            homepage : "";

        return {    
            "Name": doc.name,
            "Listing Source": "mutualaid.wiki",
            "Homepage": homepage,
            "OfferOrRequestForm": "", 
            "Facebook": facebook,
            "Locality": doc.location_name,
            "Address": "",
            "Lat": doc.location_coord.lat,
            "Lng": doc.location_coord.lng 
        }

    }));

    return mapped;
}


// MAIN

(async () => {


    var mapped = await getDataFromMutualAidWiki();
    
    //debug out 
    //console.log(JSON.stringify(mapped))

    // pipe stdout to a csv file
    try {
      const parser = new Parser();
      const csv = parser.parse(mapped);
      console.log(csv);
    } catch (err) {
      console.error(err);
    }

})();



    
   



