

# Meta Data Downloader

Quick and dirty scripts to merge the common-fields of Mutual Aid like listings from a number of sources into one big list. 

This is a ResilienceApp internal tool, for analysis and review purposes only. It is *not* intended to be a public replacement for the awesome work done at the following great sites, which are the true sources of this data and which continue to hold all relevant copyrights - not to mention much more detailed and up to date data. 

# Goals:

Gathering as many mutual aid groups as possible, and merging/deduplicating them into an existing list. We have a few scripts already. This can be valuable even for research into what makes some mutual aid groups succeed while others fail. We do not want to link people to groups. Others are already doing that work. Our list doesn't need to be very detailed, just the essentials (meta-list).

# Slack Channels:
#collab-reach4help-mutualaidworld
#resilience-outreach

# Problems:
We need a natural language type parser to automate what kind of type of information each site has: How do we separate the bigger groups from the rest? How do we separate mutual aid groups from food banks/information sites, etc?
Each site has a different data scheme.

# Sources to scrape:
https://redaktor.ushahidi.io/views/data 
https://www.ushahidi.com/covid 
(has API)
https://coronavirustechhandbook.com/mutual-aid-groups 
Groups creating mutual aid group lists (meta!)

# Scraped so far:
http://reach4help.org
http://mutualaidhub.org
http://mutualaid.wiki
https://github.com/townhallproject/mutual-aid-networks (related to mutualaidhub)
http://recovers.org/
http://caremongering.nz/ (edited) 


## Installation

Install node 10.xx or above.

```
git clone git@github.com:factn/mutualaid_meta_downloader.git
cd mutualaid_meta_downloader
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

Last time the script was run it produced..

[all_data.csv](https://github.com/factn/mutualaid_meta_downloader/raw/master/all_data.csv)
