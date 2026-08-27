'use strict';

const policy = require("./douyinVideoSearchScrapePolicy");
const collectionEngine = require("./douyinVideoSearchCollectionEngine");
const applyFilters = require("./douyinApplySearchFilters");
const filterSession = require("./douyinSearchFilterSession");
module.exports = {
  ...policy,
  ...collectionEngine,
  ...applyFilters,
  ...filterSession
};