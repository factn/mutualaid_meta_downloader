'use strict';
const _ = require('underscore')
//const csv = require('csvtojson')
const { Parser } = require('json2csv');

exports.__esModule = true;
var markers = require("./reach4help_data/markers");
// update reach4help_data/markers.ts  from
// "https://raw.githubusercontent.com/reach4help/reach4help/master/map/src/data/markers.ts");

function firstWebLink(obj) {
    var links = []
    _.mapObject(obj, function(val, key) {
        _.mapObject(obj[key], function(val2, key2) {
            links.push(val2);
            // _.mapObject(val[key2], function(val3, key3) {
            //     console.log(val3);
            //     return val3;
            // });
        });
    });
    return links[0];
}


function get_homepage(doc) {
    var general = doc.contact.general;
    var volunteers = doc.contact.volunteers;
    var getHelp = doc.contact.getHelp;

    var homepage = firstWebLink(general)
    if (homepage)
        return homepage;
    homepage = firstWebLink(volunteers)
    if (homepage)
        return homepage;
    homepage = firstWebLink(getHelp)
    if (homepage)
        return homepage;
}

function get_facebook(doc) {

    var general = doc.contact.general;
    if (general && general.facebookGroup)
        return general.facebookGroup;
   
    var facebooks = []
    _.mapObject(doc.contact, function(val, key) {
         _.mapObject(doc.contact[key], function(val2, key2) {
                if (val2 instanceof String
                    && val2.includes("facebook"))
                {
                     facebooks.push(val2);
                }
                _.mapObject(val2, 
                    function(val3, key3) {
                        if (val3 instanceof String
                            && val3.includes("facebook"))
                        {
                             facebooks.push(val3);
                        }
                    });
                });
            });
        
    
    return facebooks[0];
}

function get_offerOrRequest(doc) {
    var volunteers = doc.contact.volunteers;
    var getHelp = doc.contact.getHelp;

    if (volunteers && firstVal(volunteers))
        return firstVal(volunteers);

    if (getHelp && firstVal(getHelp))
        return firstVal(getHelp);

    return "";
}


function firstVal(obj) {
    _.mapObject(obj, function(val, key) {
        return val;
    });
    return undefined;
}

function techKeys(doc) {
    var keys = [];
    if (doc.contact)
    {
        _.mapObject(doc.contact, function(val, key) {
            _.mapObject(doc.contact[key], function(val2, key2) {
                _.mapObject(val2, 
                    function(val3, key3) {
                        keys.push(key3);
                        if (val3.includes("docs.google.com/spreadsheets")) {
                            keys.push("Google Sheets");
                        }

                        if (val3.includes("docs.google.com/forms")) {
                            keys.push("Google Form");
                        }

                        if (val3.includes("airtable")) {
                            keys.push("Airtable");
                        }

                    }
                );
            
            });
        });
    }


    return _.filter(keys, function(key) {
        return key !== "Website"
    });
}

(() => {

    //console.log(data.documents[2].fields)
    var mapped =
    _.flatten(
        _.map(markers.MARKERS, function(doc) {
        //console.log(doc.contact);
        var keys = techKeys(doc);
       
        var facebook = get_facebook(doc);
        var homepage = get_homepage(doc);
        return {    
            "Name": doc.contentTitle,
            "Listing Source": "Reach4Help",
            "Homepage": homepage ? homepage : facebook,
            "OfferOrRequestForm": get_offerOrRequest(doc),
            "SocialMedia": facebook,
            "City": doc.loc.description,
            "Tech": keys.join(", "),
            // "Country": "country",
            // "Address": "address"
        }
    }));

    //debug out 
    //console.log(JSON.stringify(mapped[0]))

    // pipe stdout to a csv file
    try {
      const parser = new Parser();
      const csv = parser.parse(mapped);
      console.log(csv);
    } catch (err) {
      console.error(err);
    }

})();