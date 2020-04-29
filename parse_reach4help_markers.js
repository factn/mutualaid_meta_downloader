'use strict';
const _ = require('underscore')
const csv = require('csvtojson')
const { Parser } = require('json2csv');

exports.__esModule = true;
var markers = require("./reach4help_data/markers");
// update reach4help_data/markers.ts  from
// "https://raw.githubusercontent.com/reach4help/reach4help/master/map/src/data/markers.ts");

function firstWebLink(obj) {
    var links = []
    _.mapObject(obj, function(val, key) {
       if (key==="web") {
            _.mapObject(obj[key], function(val2, key2) {
                links.push(val2);
            });
        }
    });
    //console.log(links);
    return links[0];
}

function firstPhoneLink(obj) {
    var phone = []
    _.mapObject(obj, function(val, key) {
       if (key=="phone") {
            phone = val;
        }
    });
    //console.log(phone);
    return phone[0];
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

function getOfferForm(volunteer) {
    return firstWebLink(volunteer);
}

function getRequestForm(getHelp) {
    return firstWebLink(getHelp);
}

function getHomePage(general, volunteer, getHelp) {
    var generalLink = firstWebLink(general)
    var volunteerLink = firstWebLink(volunteer)
    var helpLink = firstWebLink(getHelp);
    var homepage = generalLink || volunteerLink || helpLink || "";
    return homepage;

}

function getHotline(general, getHelp) {
    var generalPhone = firstPhoneLink(general);
    var helpPhone = firstPhoneLink(getHelp);
    var hotline = helpPhone || generalPhone ;
    //console.log(hotline)
    return hotline;
}

//manualClassifications load from 'manual_classification.csv'
function guessClassification(
    name, homepage, manualClassifications) {

    var manual = _.findWhere(manualClassifications,  { "name": "" + name} );
    if (manual)
        return manual["classification"];
    
    if (homepage) {
        if (homepage.includes("facebook"))
            return "FacebookMutualAid";

        if (homepage.includes("nextdoor"))
            return "NextdoorMutualAid";
    }

    return "";
}

(() => {

    const manualClassifications  = csv()
        .fromFile("manual_classifications.csv");

    var mapped =
    _.flatten(
        _.map(markers.MARKERS, function(doc) {
        
        
        var generalObj = doc.contact.general || {};
        var volunteerObj = doc.contact.volunteers || {};
        var helpObj = doc.contact.getHelp || {};

        var general = getHomePage(generalObj, volunteerObj, helpObj);
      
        var requestForm = getRequestForm(helpObj);
        var offerForm = getOfferForm(volunteerObj);
        var hotline = getHotline(generalObj, helpObj);
        
        //console.log("hotline");
        //console.log(hotline);
     
        var facebook = get_facebook(doc);
        var name =  doc.contentTitle;
        var description =  doc.contentBody;

        var homepage =  general ? general : facebook;

        var locality  = doc.loc.description;
        var lat  = doc.loc.lat;
        var lng  = doc.loc.lng;
            
        var listingSource = "Reach4Help";
       


        var classification = guessClassification(name, homepage, manualClassifications);

      

        return {  
            "Name": name,
            "Classification": classification,
            "Homepage": homepage,
            "SocialMedia": facebook,
            "Locality": locality,
            "Lat": lat,
            "Lng": lng,
            "Address": null,
            "Country": null,
            "Description": description,  
            "SupportRequest": requestForm,
            "SupportOffer": offerForm,
            "Hotline": hotline,
            "Tags": "",
            "Notes": "",
            "ListingSource": listingSource,
            "ListingSourceId": null,
            "ListingSourceUpdated": null,
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