'use strict';

const { readFileSync } = require('fs');
const { join } = require('path');

const { createPlaylistsParser } = require('../../lib/playlists-parser');
const { expect } = require('chai');
const { XMLParser: parseXML } = require('../../lib/xml-parser');

describe('Playlists parser', () => {
  describe('fabric function should', () => {
      it('return object with `createPlaylists` function', () => {
        const result = createPlaylistsParser();

        expect(result).to.be.an('object');
        expect(result.createPlaylists).to.be.a('function');
      });
  });

  describe('createPlaylists should', () => {
    const { createPlaylists } = createPlaylistsParser();
    const manifestXml = readFileSync(join(__dirname, '../assets/720p_H264_AAC_no_encryption.ism')).toString();
    const manifestUrl = 'http://playready.directtaps.net/smoothstreaming/TTLSS720VC1/To_The_Limit_720.ism/Manifest';

    const { SmoothStreamingMedia: { StreamIndex } } = parseXML(manifestXml);
    const [singlePlaylistData] = StreamIndex;
    const audioPlaylist = {
      ...singlePlaylistData,
      Type: 'audio',
    }

    it('return array with proper data set', () => {
      const playlists = createPlaylists(StreamIndex, manifestUrl);
      expect(playlists).to.be.an('array');

      const [playlist] = playlists;

      expect(playlist).to.have.property('type');
      expect(playlist).to.have.property('bitrate');
      expect(playlist).to.have.property('resolution');
      expect(playlist).to.have.property('segments');
    });

    it('fail when streamIndex is invalid', () => {
      try {
        createPlaylists(null, manifestUrl);
        expect.fail('Should throw an error');
      } catch(e) {
        expect(e.message).to.eql('Cannot read property \'forEach\' of null');
      }
    });

    describe('return valid playlist types', () => {
      it('for audio playlist', () => {
        const [playlist] = createPlaylists([audioPlaylist], manifestUrl);

        expect(playlist.type).to.eql('audio');
      });

      it('for video playlist', () => {
        const [playlist] = createPlaylists([singlePlaylistData], manifestUrl);

        expect(playlist.type).to.eql('video');
      });
    });

    describe('return valid playlist resolution', () => {
      it('for audio playlist', () => {
        const [playlist] = createPlaylists([audioPlaylist], manifestUrl);

        expect(playlist.resolution).to.eql('n/a');
      });

      it('for video playlist', () => {
        const [playlist] = createPlaylists([singlePlaylistData], manifestUrl);

        expect(playlist.resolution).to.eql({ width: 1280, height: 720 });
      });
    });

    it('return valid bit rates', () => {
      const expectedBitRates = singlePlaylistData.QualityLevel.map(({Bitrate}) => Bitrate);
      const playlists = createPlaylists([singlePlaylistData], manifestUrl);

      playlists.forEach((playlist, index) => {
        expect(playlist.bitrate).to.eql(expectedBitRates[index]);
      });
    });

    it('return valid segments', () => {
      const expectedSegments = [
        'http://playready.directtaps.net/smoothstreaming/TTLSS720VC1/To_The_Limit_720.ism/QualityLevels(2962000)/Fragments(video=0)',
        'http://playready.directtaps.net/smoothstreaming/TTLSS720VC1/To_The_Limit_720.ism/QualityLevels(2962000)/Fragments(video=20020000)',
        'http://playready.directtaps.net/smoothstreaming/TTLSS720VC1/To_The_Limit_720.ism/QualityLevels(2962000)/Fragments(video=40040000)',
        'http://playready.directtaps.net/smoothstreaming/TTLSS720VC1/To_The_Limit_720.ism/QualityLevels(2962000)/Fragments(video=60060000)',
        'http://playready.directtaps.net/smoothstreaming/TTLSS720VC1/To_The_Limit_720.ism/QualityLevels(2962000)/Fragments(video=80080000)',
        'http://playready.directtaps.net/smoothstreaming/TTLSS720VC1/To_The_Limit_720.ism/QualityLevels(2962000)/Fragments(video=100100000)',
        'http://playready.directtaps.net/smoothstreaming/TTLSS720VC1/To_The_Limit_720.ism/QualityLevels(2962000)/Fragments(video=120120000)',
        'http://playready.directtaps.net/smoothstreaming/TTLSS720VC1/To_The_Limit_720.ism/QualityLevels(2962000)/Fragments(video=140140000)',
        'http://playready.directtaps.net/smoothstreaming/TTLSS720VC1/To_The_Limit_720.ism/QualityLevels(2962000)/Fragments(video=160160000)',
        'http://playready.directtaps.net/smoothstreaming/TTLSS720VC1/To_The_Limit_720.ism/QualityLevels(2962000)/Fragments(video=180180000)',
        'http://playready.directtaps.net/smoothstreaming/TTLSS720VC1/To_The_Limit_720.ism/QualityLevels(2962000)/Fragments(video=200200000)',
        'http://playready.directtaps.net/smoothstreaming/TTLSS720VC1/To_The_Limit_720.ism/QualityLevels(2962000)/Fragments(video=220220000)',
        'http://playready.directtaps.net/smoothstreaming/TTLSS720VC1/To_The_Limit_720.ism/QualityLevels(2962000)/Fragments(video=240240000)',
        'http://playready.directtaps.net/smoothstreaming/TTLSS720VC1/To_The_Limit_720.ism/QualityLevels(2962000)/Fragments(video=260260000)',
        'http://playready.directtaps.net/smoothstreaming/TTLSS720VC1/To_The_Limit_720.ism/QualityLevels(2962000)/Fragments(video=280280000)',
        'http://playready.directtaps.net/smoothstreaming/TTLSS720VC1/To_The_Limit_720.ism/QualityLevels(2962000)/Fragments(video=300300000)',
        'http://playready.directtaps.net/smoothstreaming/TTLSS720VC1/To_The_Limit_720.ism/QualityLevels(2962000)/Fragments(video=320320000)',
        'http://playready.directtaps.net/smoothstreaming/TTLSS720VC1/To_The_Limit_720.ism/QualityLevels(2962000)/Fragments(video=340340000)',
        'http://playready.directtaps.net/smoothstreaming/TTLSS720VC1/To_The_Limit_720.ism/QualityLevels(2962000)/Fragments(video=360360000)',
        'http://playready.directtaps.net/smoothstreaming/TTLSS720VC1/To_The_Limit_720.ism/QualityLevels(2962000)/Fragments(video=380380000)',
        'http://playready.directtaps.net/smoothstreaming/TTLSS720VC1/To_The_Limit_720.ism/QualityLevels(2962000)/Fragments(video=400400000)',
        'http://playready.directtaps.net/smoothstreaming/TTLSS720VC1/To_The_Limit_720.ism/QualityLevels(2962000)/Fragments(video=420420000)',
        'http://playready.directtaps.net/smoothstreaming/TTLSS720VC1/To_The_Limit_720.ism/QualityLevels(2962000)/Fragments(video=440440000)',
        'http://playready.directtaps.net/smoothstreaming/TTLSS720VC1/To_The_Limit_720.ism/QualityLevels(2962000)/Fragments(video=460460000)',
        'http://playready.directtaps.net/smoothstreaming/TTLSS720VC1/To_The_Limit_720.ism/QualityLevels(2962000)/Fragments(video=480480000)',
        'http://playready.directtaps.net/smoothstreaming/TTLSS720VC1/To_The_Limit_720.ism/QualityLevels(2962000)/Fragments(video=500500000)',
        'http://playready.directtaps.net/smoothstreaming/TTLSS720VC1/To_The_Limit_720.ism/QualityLevels(2962000)/Fragments(video=520520000)',
        'http://playready.directtaps.net/smoothstreaming/TTLSS720VC1/To_The_Limit_720.ism/QualityLevels(2962000)/Fragments(video=540540000)',
        'http://playready.directtaps.net/smoothstreaming/TTLSS720VC1/To_The_Limit_720.ism/QualityLevels(2962000)/Fragments(video=560560000)',
        'http://playready.directtaps.net/smoothstreaming/TTLSS720VC1/To_The_Limit_720.ism/QualityLevels(2962000)/Fragments(video=580580000)',
        'http://playready.directtaps.net/smoothstreaming/TTLSS720VC1/To_The_Limit_720.ism/QualityLevels(2962000)/Fragments(video=600600000)',
        'http://playready.directtaps.net/smoothstreaming/TTLSS720VC1/To_The_Limit_720.ism/QualityLevels(2962000)/Fragments(video=620620000)',
        'http://playready.directtaps.net/smoothstreaming/TTLSS720VC1/To_The_Limit_720.ism/QualityLevels(2962000)/Fragments(video=640640000)',
        'http://playready.directtaps.net/smoothstreaming/TTLSS720VC1/To_The_Limit_720.ism/QualityLevels(2962000)/Fragments(video=660660000)',
        'http://playready.directtaps.net/smoothstreaming/TTLSS720VC1/To_The_Limit_720.ism/QualityLevels(2962000)/Fragments(video=680680000)',
        'http://playready.directtaps.net/smoothstreaming/TTLSS720VC1/To_The_Limit_720.ism/QualityLevels(2962000)/Fragments(video=700700000)',
        'http://playready.directtaps.net/smoothstreaming/TTLSS720VC1/To_The_Limit_720.ism/QualityLevels(2962000)/Fragments(video=720720000)',
        'http://playready.directtaps.net/smoothstreaming/TTLSS720VC1/To_The_Limit_720.ism/QualityLevels(2962000)/Fragments(video=740740000)',
        'http://playready.directtaps.net/smoothstreaming/TTLSS720VC1/To_The_Limit_720.ism/QualityLevels(2962000)/Fragments(video=760760000)',
        'http://playready.directtaps.net/smoothstreaming/TTLSS720VC1/To_The_Limit_720.ism/QualityLevels(2962000)/Fragments(video=780780000)',
        'http://playready.directtaps.net/smoothstreaming/TTLSS720VC1/To_The_Limit_720.ism/QualityLevels(2962000)/Fragments(video=800800000)',
        'http://playready.directtaps.net/smoothstreaming/TTLSS720VC1/To_The_Limit_720.ism/QualityLevels(2962000)/Fragments(video=820820000)',
        'http://playready.directtaps.net/smoothstreaming/TTLSS720VC1/To_The_Limit_720.ism/QualityLevels(2962000)/Fragments(video=840840000)',
        'http://playready.directtaps.net/smoothstreaming/TTLSS720VC1/To_The_Limit_720.ism/QualityLevels(2962000)/Fragments(video=860860000)',
        'http://playready.directtaps.net/smoothstreaming/TTLSS720VC1/To_The_Limit_720.ism/QualityLevels(2962000)/Fragments(video=880880000)',
        'http://playready.directtaps.net/smoothstreaming/TTLSS720VC1/To_The_Limit_720.ism/QualityLevels(2962000)/Fragments(video=900900000)',
        'http://playready.directtaps.net/smoothstreaming/TTLSS720VC1/To_The_Limit_720.ism/QualityLevels(2962000)/Fragments(video=920920000)',
        'http://playready.directtaps.net/smoothstreaming/TTLSS720VC1/To_The_Limit_720.ism/QualityLevels(2962000)/Fragments(video=940940000)',
        'http://playready.directtaps.net/smoothstreaming/TTLSS720VC1/To_The_Limit_720.ism/QualityLevels(2962000)/Fragments(video=960960000)',
        'http://playready.directtaps.net/smoothstreaming/TTLSS720VC1/To_The_Limit_720.ism/QualityLevels(2962000)/Fragments(video=980980000)',
        'http://playready.directtaps.net/smoothstreaming/TTLSS720VC1/To_The_Limit_720.ism/QualityLevels(2962000)/Fragments(video=1001000000)',
        'http://playready.directtaps.net/smoothstreaming/TTLSS720VC1/To_The_Limit_720.ism/QualityLevels(2962000)/Fragments(video=1021020000)',
        'http://playready.directtaps.net/smoothstreaming/TTLSS720VC1/To_The_Limit_720.ism/QualityLevels(2962000)/Fragments(video=1041040000)',
        'http://playready.directtaps.net/smoothstreaming/TTLSS720VC1/To_The_Limit_720.ism/QualityLevels(2962000)/Fragments(video=1061060000)',
        'http://playready.directtaps.net/smoothstreaming/TTLSS720VC1/To_The_Limit_720.ism/QualityLevels(2962000)/Fragments(video=1081080000)',
        'http://playready.directtaps.net/smoothstreaming/TTLSS720VC1/To_The_Limit_720.ism/QualityLevels(2962000)/Fragments(video=1101100000)',
        'http://playready.directtaps.net/smoothstreaming/TTLSS720VC1/To_The_Limit_720.ism/QualityLevels(2962000)/Fragments(video=1121120000)',
        'http://playready.directtaps.net/smoothstreaming/TTLSS720VC1/To_The_Limit_720.ism/QualityLevels(2962000)/Fragments(video=1141140000)',
        'http://playready.directtaps.net/smoothstreaming/TTLSS720VC1/To_The_Limit_720.ism/QualityLevels(2962000)/Fragments(video=1161160000)',
        'http://playready.directtaps.net/smoothstreaming/TTLSS720VC1/To_The_Limit_720.ism/QualityLevels(2962000)/Fragments(video=1181180000)',
        'http://playready.directtaps.net/smoothstreaming/TTLSS720VC1/To_The_Limit_720.ism/QualityLevels(2962000)/Fragments(video=1201200000)'
      ]
      const [playlist] = createPlaylists([singlePlaylistData], manifestUrl);

      expect(playlist.segments).to.eql(expectedSegments);
    });
  });
});
