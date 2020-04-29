
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


async function getDataFromMutualAidWiki(manualClassifications) {

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
        var name = doc.name;
        var listingSource = "mutualaid.wiki";

        var classification = guessClassification(name, homepage, manualClassifications)

        return {  
            "Name": name,
            "Classification": classification,
            "Homepage": homepage,
            "SocialMedia": facebook,
            "Locality":  doc.location_name,
            "Lat": doc.location_coord.lat,
            "Lng": doc.location_coord.lng,
            "Address": doc.location_name,
            "Country": "",
            "Description": doc.description,  
            "SupportRequest": "",
            "SupportOffer": "",
            "Hotline": doc.contact ? doc.contact.phone : "",
            "Tags": "",
            "Notes": "",
            "ListingSource": listingSource,
            "ListingSourceId": doc.id,
            "ListingSourceUpdated": doc.updated_at,
            
        }

    }));

    return mapped;
}


// MAIN

(async () => {


    const manualClassifications  =  await csv()
        .fromFile("manual_classifications.csv");

    var mapped = await getDataFromMutualAidWiki(manualClassifications);
    
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



    
   



