const express = require("express");
const router = express.Router();
const XeroClient = require("xero-node").AccountingAPIClient;
const axios = require("axios")

const config = require("./../../config/config.json");

let xero = new XeroClient(config);

let lastRequestToken = null;
let response = {}

router.get("/access", async (req, res) => {
  let oauth_verifier = req.query.oauth_verifier;
  let accessToken = await xero.oauth1Client.swapRequestTokenforAccessToken(
    lastRequestToken,
    oauth_verifier
  );

  let org = await xero.organisations.get();
  let accts = await xero.accounts.get();
  let contacts = await xero.contacts.get();

  response = {
    org,
    accts,
    contacts
  };
  
  res.send(response);
});

router.get("/connect", async (req, res) => {
  lastRequestToken = await xero.oauth1Client.getRequestToken();
  let authoriseURL = xero.oauth1Client.buildAuthoriseUrl(lastRequestToken);
  console.log("lastRequestToken", lastRequestToken)
  console.log("authoriseURL", authoriseURL)
  res.redirect(authoriseURL);
});

router.get("/teste", (req, res) => {
  res.send(response)
})

module.exports = router;
