
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


async function getDataForPage(url) {

    var data = {}
    try {
        const response = await axios.get(url);
        data = response.data;
        // dont need to do this axios already parsed it
        // let json_data = JSON5.parse(data);
    } catch (error) {
        console.log(error);
    }

    //console.log(data.documents[2].fields)
   
    var mapped = _.flatten(_.map(data.documents, function(doc) {
        return {
            "name": doc.fields.title.stringValue,
            "city": doc.fields.city.stringValue,
            "general_url": doc.fields.generalForm.stringValue,
            "country": doc.fields.country.stringValue,
            "address": doc.fields.address.stringValue,
            "state": doc.fields.state.stringValue
        }

    }));

    //console.log(data)
    return {
        nextPageToken: data.nextPageToken,
        mapped: mapped
    }
}

async function getDataForAllPages() {
    const baseUrl = "https://firestore.googleapis.com/v1/projects/townhallproject-86312/databases/(default)/documents/mutual_aid_networks/"
    const startToken = "ALumMsXdNuhweUHlgMs3s9fph3eZNHKu6qwr-Zz5kyVbkMNBoKbYBtjhc1nbbpovjwaDLS5hm0iAv-dTF4DJYZMiQtv3PgOegb65L4PvMu2y9JoGvUhTyQFozmX5A7IfK1vqMasr2fbTVH58gNc"

    var nextToken = startToken;
    var data = [];
    while (nextToken) 
    {
        let url = baseUrl + "?pageToken="+nextToken;
        var result = await getDataForPage(url);
        var mapped = result.mapped;
        data = [...data, ...mapped];
        nextToken = result.nextPageToken;
    }

    return data;
}

// MAIN

(async () => {


    var mapped = await getDataForAllPages();
    
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



    
   



