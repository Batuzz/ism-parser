'use strict';

const { createMD5hash } = require('./utils');
const { parseXML } = require('./xml-parser');
const { playlistsParser } = require('./playlists-parser');

function createISMParser() {
  function ismParser(manifestUrl, manifestXml) {
    const { createPlaylists } = playlistsParser();
    const { SmoothStreamingMedia: { StreamIndex } } = parseXML(manifestXml);
    const playlists = createPlaylists(StreamIndex, manifestUrl);

    return {
      playlists,
      manifestMD5: createMD5hash(manifestXml),
      url: manifestUrl,
    };
  }

  function parseManifest(manifestUrl, manifestString) {
    return ismParser(manifestUrl, manifestString);
  }

  return {
    parseManifest
  };
}

module.exports = {
  createISMParser,
};
