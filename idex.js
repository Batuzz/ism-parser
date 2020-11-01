'use strict';

const urljoin = require('url-join');
const { parse: parseXml } = require('fast-xml-parser');

const { getSegmentsRootUrl, createMD5hash } = require('./parser-utils');

function ismParser(manifestUrl, manifestXml) {
    const parserOpts = {
        attributeNamePrefix: '',
        ignoreAttributes: false,
        parseAttributeValue: true,
    };

    const { SmoothStreamingMedia: { StreamIndex } } = parseXml(manifestXml, parserOpts);
    const playlists = createPlaylists(StreamIndex, manifestUrl);

    return {
        playlists,
        manifestMD5: createMD5hash(manifestXml),
        url: manifestUrl,
    };
}

function createPlaylists(streamIndex, manifestUrl) {
    const playlists = [];

    streamIndex.forEach(streamData => {
        const {
            c: chunksMetadata,
            QualityLevel: qualityLevel,
            Url: chunkUrlSchema,
            Type: playlistType,
        } = streamData;

        const qualityLevels = Array.isArray(qualityLevel) ? qualityLevel : [qualityLevel];
        const urlBuilder = createUrlBuilder(chunkUrlSchema, manifestUrl);
        const timeline = buildTimeline(chunksMetadata);

        const qualityLevelsData = qualityLevels.map(level => {
            const segments = buildChunksUrls(level.Bitrate, timeline, urlBuilder);
            const resolution = playlistType === 'audio' ? 'n/a' : { width: level.MaxWidth, height: level.MaxHeight };

            return {
                type: playlistType,
                bitrate: parseInt(level.Bitrate, 10),
                resolution,
                segments
            };
        });

        playlists.push(...qualityLevelsData);
    });

    return playlists;
}

function buildTimeline(chunksMetadata) {
    const chunks = Array.isArray(chunksMetadata) ? chunksMetadata : [chunksMetadata];

    let time = -1;
    const timings = chunks.flatMap(({ d: duration, t: chunkTime = 0, r: repeat = 0 }) => {
        if (chunkTime > time) time = chunkTime;
        if (repeat > 0) {
            const repeatedChunks = Array.from({ length: repeat }, (_, k) => time + k * duration);
            time += repeat * duration;
            return repeatedChunks;
        }
        const chunk = time;
        time += duration;
        return chunk;
    });

    return timings;
}

function createUrlBuilder(schema, manifestUrl) {
    const rootUrl = getSegmentsRootUrl(manifestUrl);
    const url = urljoin(rootUrl, schema);
    return (bitrate, time) => url.replace(/{bitrate}/, bitrate).replace(/{start time}/, time);
}

function buildChunksUrls(bitrate, timeline, urlBuilder) {
    return timeline.map((t) => urlBuilder(bitrate, t));
}

function createISMParser() {
    function parseManifest(manifestUrl, manifestString) {
        const chunks = ismParser(manifestUrl, manifestString);

        return chunks;
    }

    return {
        parseManifest
    };
}

module.exports = {
    createISMParser,
};
