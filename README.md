# Meta Data Downloader

Quick and dirty scripts to merge the common-fields of Mutual Aid like listings from a number of sources into one big list. 

This is a ResilienceApp internal tool, for analysis and review purposes only. It is *not* intended to be a public replacement for the awesome work done at the following great sites, which are the true sources of this data and which continue to hold all relevant copyrights - not to mention much more detailed and up to date data. Go to the true sources for this information:

* http://reach4help.org 
* http://mutualaidhub.org 
* http://mutualaid.wiki
* https://github.com/townhallproject/mutual-aid-networks (related to mutualaidhub)

## Installation

```
npm i
```

## Usage

1. Update any manual edits 

Update `manual_classifications.csv` from AirTable

2.  Download data

```
node download_mutual_aid_hub.js > mutualaid_hub.csv
node download_mutualaidwiki.js >  mutualaid_wiki.csv
node parse_na_mutual_aid_networks_datasource.js > na_mutual_aid_networks.csv
node parse_reach4help_markers.js > reach4help.csv
```

3. Run merge 
```
node dedupe_and_merge.js > all_data.csv 
```

                                      

## Data

node download_recovers_org.js > 
