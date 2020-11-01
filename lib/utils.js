'use strict';

const crypto = require('crypto');

function createMD5hash(data) {
  return crypto.createHash('md5').update(data).digest('hex');
}

function getSegmentsRootUrl(manifestUrl) {
   const rootLastIndex = manifestUrl.lastIndexOf('/')
  return manifestUrl.substring(0, rootLastIndex);
}

module.exports = {
  createMD5hash,
  getSegmentsRootUrl,
}
