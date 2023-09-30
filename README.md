# Overview

This repository contains an example of a node.js script that will star a specific reconciliation in all non-locked periods/ledgers of all companies inside Silverfin

Silverfin API documentation: https://developer.silverfin.com/reference/get-started-1

# Running the script

## Prerequisites

1. Node.js (https://nodejs.org/en/download/)

   - The script is written in JavaScript and node.js is needed to run the script locally.

2. Valid Silverfin environment (in other words, you already have a firm in Silverfin and your user is added)

   This script assumes that the following things are already set-up in your Silverfin environment:

   - The list of companies for which you want to run the script are already added in Silverfin and the companies + periods in Silverfin have the reconciliation you want to star already added.

3. Silverfin API credentials

   The Silverfin API uses OAuth2, in order to use the API you need to have contacted Silverfin Support to create an API client in Silverfin and obtain the credentials (client ID / secret) to generate the access token.

## Setup

1. Add a local `.env` file with the following content:

```
# This is a valid access token generated through for the Silverfin API (can be generated through another app like Postman and pasted here)
SILVERFIN_TOKEN=<your token>

# This is the firm ID of the firm you want to push the data to
SILVERFIN_FIRM_ID=<your firm id>

# The handle of the reconciliation you want to star
RECONCILIATION_HANDLE=<handle of the reconciliation you want to star>
```

2. Install the dependencies

The `axios` package is used to make the API calls to Silverfin.

The `dotenv` package is used to read the `.env` file.

Install the dependencies with the following command:

```
npm install
```

## Run the script

The script can be run with the following command:

```
npm start
```
