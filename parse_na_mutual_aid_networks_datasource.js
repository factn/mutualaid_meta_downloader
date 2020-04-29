
const fs = require('fs');
const _ = require('underscore')
const csv = require('csvtojson')
const { Parser } = require('json2csv');
const axios = require("axios");

// for more relaxed 'json' parsing eg keys without quotes
const JSON5 = require('json5')

function splitLines(t) {
    return t.split(/\r\n|\r|\n/); 
}

//manualClassifications load from 'manual_classification.csv'
function guessClassification(
    name, homepage, manualClassifications) {

    var manual = _.findWhere(manualClassifications,  { "name": "" + name} );
    if (manual)
        return manual["classification"];
    
    if (homepage.includes("facebook"))
        return "FacebookMutualAid";

    if (homepage.includes("nextdoor"))
        return "NextdoorMutualAid";

    return "";
}


async function convertData(NA_Mutual_Aid_Networks, manualClassifications) {

    //console.log(NA_Mutual_Aid_Networks)
   
    var mapped = _.flatten(_.map(NA_Mutual_Aid_Networks, function(row) {

        //console.log(row);

        var name = row['Resource'];
        var neighborhood = row['Neighborhood/region'];
        var city = row['City'];
        var state = row['State/Territory'];
        var zip = row['Zip Code'];
        var country = row['Country'];
        var language = row['Language(s)'];
        var generalForm = row['General'];
        var requestForm = row['Support Request'];
        var offerForm = row['Support Offer'];
        var socialMedia = row['Social Media'];
        var hotline = row['Hotline #'];

        var homepage = generalForm ? generalForm : socialMedia ? socialMedia : requestForm ? requestForm : offerForm;

        var parts = []
        if (neighborhood) parts.push(neighborhood);
        if (city) parts.push(city);
        if (state) parts.push(state);
        var locality = parts.join(", ");

        var classification = 
            guessClassification(name, homepage, manualClassifications);
        
        var listingSource = "NA_Mutual_Aid_Networks.csv"

        return {  
            "Name": name,
            "Classification": classification,
            "Homepage": homepage,
            "SocialMedia": socialMedia,
            "Locality": locality,
            "Lat": null,
            "Lng": null,
            "Address": null,
            "Country": country,
            "Description": "",  
            "SupportRequest": requestForm,
            "SupportOffer": offerForm,
            "Hotline": hotline,
            "Tags": "",
            "Notes": "",
            "ListingSource": listingSource,
            "ListingSourceId": null,
            "ListingSourceUpdated": "2020-04-01",
        }

    }));

    return mapped;
}


// MAIN

(async () => {


    const NA_Mutual_Aid_Networks  =  await csv()
        .fromFile("NA_Mutual_Aid_Networks_2020-04-01.csv");

    const manualClassifications  =  await csv()
        .fromFile("manual_classifications.csv");


    var mapped = await convertData(NA_Mutual_Aid_Networks, manualClassifications);
    
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



    
   



