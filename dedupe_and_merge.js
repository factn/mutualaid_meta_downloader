'use strict';
const _ = require('underscore')
const csv = require('csvtojson')
const { Parser } = require('json2csv');
const compareUrls = require('compare-urls');
const normalizeUrl = require('normalize-url');

function merge(row, other) {

    var result = {  
            "Name": row.Name 
                    ? row.Name 
                    : other.Name,
            "Classification": row.Classification 
                    ? row.Classification 
                    : other.Classification,
            "Homepage": row.Homepage 
                    ? row.Homepage 
                    : other.Homepage,
            "SocialMedia": row.SocialMedia 
                    ? row.SocialMedia 
                    : other.SocialMedia,
            "Locality": row.Locality 
                    ? row.Locality 
                    : other.Locality,
            "Lat": row.Lat 
                    ? row.Lat 
                    : other.Lat,
            "Lng": row.Lng 
                    ? row.Lng 
                    : other.Lng,
            "Address": row.Address 
                    ? row.Address 
                    : other.Address,
            "Country": row.Country 
                    ? row.Country 
                    : other.Country,
            "Description": row.Description 
                    ? row.Description 
                    : other.Description,
            "SupportRequest": row.SupportRequest 
                    ? row.SupportRequest 
                    : other.SupportRequest,
            "SupportOffer": row.SupportOffer 
                    ? row.SupportOffer 
                    : other.SupportOffer,
            "Hotline": row.Hotline 
                    ? row.Hotline 
                    : other.Hotline,
            "Tags": row.Tags 
                    ? row.Tags 
                    : other.Tags,
            "Notes": row.Notes 
                    ? row.Notes 
                    : other.Notes,
            "ListingSources": 
                    row.ListingSources 
                    + "," + other.ListingSource,
            "ListingSourceIds": 
                    row.ListingSourceIds 
                    + "," + other.ListingSourceId,
        }
        // console.log("Merging");
        // console.log(row);
        // console.log("With");
        // console.log(other);
        // console.log("Result");
        // console.log(result);
        return result;
    }


function forceSchema(row) {
    try {
        var homePageUrl = normalizeUrl(row.Homepage);
    } catch (e) {
        var homePageUrl = "";
    }   
    return {  
        "Name": row.Name,
        "Classification": row.Classification,
        "Homepage": homePageUrl,
        "SocialMedia": row.SocialMedia,
        "Locality": row.Locality,
        "Lat": row.Lat,
        "Lng": row.Lng,
        "Address": row.Address,
        "Country": row.Country,
        "Description": row.Description,
        "SupportRequest": row.SupportRequest,
        "SupportOffer": row.SupportOffer,
        "Hotline": row.Hotline,
        "Tags": row.Tags,
        "Notes": row.Notes,
        "ListingSources": row.ListingSource,
        "ListingSourceIds": row.ListingSourceId
    }
}

// finds index os row in base that is a duplicate of the row
// passed in, in the sense of being meaningfully the same entity 
function matchingRowIdx(base, row) {

    var idx = _.findIndex(base, (baseRow) => {
        //return baseRow.Name === row.Name;
        return baseRow.Name.toLowerCase() === row.Name.toLowerCase()
    });

    if (idx !== -1) {
        try {
            var rowUrl = normalizeUrl(row.Homepage);
            if (compareUrls(base[idx].Homepage, rowUrl))
                return idx;
        } catch (e) {
            if (base[idx].Homepage === "")
                return idx;
        }
    }
    return -1;
}


function mergeIn(base, other) {
    _.each(other, (row)=> {
        var idx = matchingRowIdx(base, row);
        if (idx !== -1) {
            base[idx] = merge(base[idx], row);
        }
        else {
            base.push(forceSchema(row));
        }

    });
    return base;
}

(async () => {

    const reach4help = await csv()
        .fromFile("reach4help.csv");
    const mutualaid_hub = await csv()
        .fromFile("mutualaid_hub.csv");
    const mutualaid_wiki = await csv()
        .fromFile("mutualaid_wiki.csv");
    const na_mutual_aid_networks = await csv()
        .fromFile("na_mutual_aid_networks.csv");


    // merge in each in turn, 
    // keeping data from both rows if one is blank, but 
    // but preferring the one on the left
    // removing dupes as it goes (sometimes there are 
    // dupes even within one datasource)
    var base = mergeIn([], reach4help);
    base = mergeIn(base, mutualaid_hub);
    base = mergeIn(base, mutualaid_wiki);
    base = mergeIn(base, na_mutual_aid_networks);

    //pipe stdout to a csv file
    try {
      const parser = new Parser();
      const csv = parser.parse(base);
      console.log(csv);
    } catch (err) {
      console.error(err);
    }

})();