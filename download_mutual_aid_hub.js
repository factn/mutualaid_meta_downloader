
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


async function getDataForPage(url, manualClassifications) {

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
        var generalForm = doc.fields.generalForm.stringValue;
        var supportRequestForm = doc.fields.supportRequestForm.stringValue;
        var supportOfferForm = doc.fields.supportOfferForm.stringValue;
        var facebookPage = doc.fields.facebookPage.stringValue;  
        
        var name = doc.fields.title.stringValue;

        var neighborhood = doc.fields.neighborhood.stringValue;
        var city = doc.fields.city.stringValue;
        var state = doc.fields.state.stringValue;
        var country = doc.fields.country.stringValue;
        var address = doc.fields.address.stringValue;
        var lat = doc.fields.lat.doubleValue;
        var lng = doc.fields.lng.doubleValue;
        var mutualaidHubId = doc.fields.id.integerValue;

        var community = doc.fields.community.stringValue;
        var category = doc.fields.category.stringValue;

        var homepage = generalForm ? generalForm : facebookPage ? facebookPage : supportRequestForm ? supportRequestForm : supportOfferForm;

        var parts = []
        if (neighborhood) parts.push(neighborhood);
        if (city) parts.push(city);
        if (state) parts.push(state);
        var locality = parts.join(", ");

        var tags = []
        if (category) parts.push(category);
        if (community) parts.push(community); 

        var classification = 
            guessClassification(name, homepage, manualClassifications);
        
        var listingSource = "mutualaidhub.org"

        //console.log(doc)

        return {  
            "Name": name,
            "Classification": classification,
            "Homepage": homepage,
            "SocialMedia": facebookPage,
            "Locality": locality,
            "Lat": lat,
            "Lng":lng,
            "Address": address,
            "Country": country,
            "Description": "",  
            "SupportRequest": supportRequestForm,
            "SupportOffer": supportOfferForm,
            "Hotline": "",
            "Tags": "",
            "Notes": "",
            "ListingSource": listingSource,
            "ListingSourceId": mutualaidHubId,
            "ListingSourceUpdated": null,

        }

    }));

    return {
        nextPageToken: data.nextPageToken,
        mapped: mapped
    }
}

async function getDataForAllPages(manualClassifications) {
    const baseUrl = "https://firestore.googleapis.com/v1/projects/townhallproject-86312/databases/(default)/documents/mutual_aid_networks/"
    const startToken = "ALumMsXdNuhweUHlgMs3s9fph3eZNHKu6qwr-Zz5kyVbkMNBoKbYBtjhc1nbbpovjwaDLS5hm0iAv-dTF4DJYZMiQtv3PgOegb65L4PvMu2y9JoGvUhTyQFozmX5A7IfK1vqMasr2fbTVH58gNc"

    var nextToken = startToken;
    var data = [];
    while (nextToken) 
    {
        let url = baseUrl + "?pageToken="+nextToken;
        var result = await 
                getDataForPage(url, manualClassifications);
        var mapped = result.mapped;
        data = [...data, ...mapped];
        nextToken = result.nextPageToken;
    }

    return data;
}

// MAIN

(async () => {


    const manualClassifications  =  await csv()
        .fromFile("manual_classifications.csv");


    var mapped = await getDataForAllPages(manualClassifications);
    
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



    
   



