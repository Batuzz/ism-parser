'use strict';

const { createMD5hash } = require('./utils');
const { XMLParser } = require('./xml-parser');
const { createPlaylistsParser } = require('./playlists-parser');

function createISMParser(
  playlistsParser = createPlaylistsParser(), {
    digestFunction = createMD5hash,
    parseXML = XMLParser,
} = {}) {
  function _parse(manifestUrl, manifestXml) {
    const { createPlaylists } = playlistsParser;
    const { SmoothStreamingMedia: { StreamIndex } } = parseXML(manifestXml);
    const playlists = createPlaylists(StreamIndex, manifestUrl);

    return {
      playlists,
      manifestHash: digestFunction(manifestXml),
      url: manifestUrl,
    };
  }

  function parseManifest(manifestUrl, manifestString) {
    return _parse(manifestUrl, manifestString);
  }

  function validateParams() {
    if (!playlistsParser || typeof playlistsParser.createPlaylists !== 'function') {
      throw new Error('Invalid argument: playlistsParser.createPlaylist must be a function');
    }

    if (!digestFunction || typeof digestFunction !== 'function') {
      throw new Error('Invalid argument: digestFunction must be a function');
    }

    if (!parseXML || typeof parseXML !== 'function') {
      throw new Error('Invalid argument: parseXML must be a function');
    }
  }

  validateParams();

  return {
    parseManifest
  };
}

module.exports = {
  createISMParser,
};
