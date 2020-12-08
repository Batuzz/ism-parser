'use strict';

const { createISMParser } = require('../../lib/ism-parser');
const { expect } = require('chai');
const sinon = require('sinon');

describe('ISM parser', () => {
  const createPlaylistsStub = sinon.stub().returns([]);
  const digestFunctionStub = sinon.stub().returns('hash');
  const parseXMLStub = sinon.stub().returns({
    SmoothStreamingMedia: {
      StreamIndex: {}
    }
  });

  const playlistParser = {
    createPlaylists: createPlaylistsStub
  };


  describe('fabric function should', () => {
    describe('validate input parameters', () => {
      describe('validate playlistsParser parameter', () => {
        it('should throw when empty', () => {
          try {
            createISMParser(null);
            expect.fail('Should throw an error');
          } catch (e) {
            expect(e.message).to.eql('Invalid argument: playlistsParser.createPlaylist must be a function');
          }
        });

        it('should throw when createPlaylists is not a function', () => {
          try {
            createISMParser({ createPlaylists: null });
            expect.fail('Should throw an error');
          } catch (e) {
            expect(e.message).to.eql('Invalid argument: playlistsParser.createPlaylist must be a function');
          }
        });
      });

      describe('validate digestFunction parameter', () => {
        it('should throw when empty', () => {
          try {
            createISMParser(playlistParser, { digestFunction: null });
            expect.fail('Should throw an error');
          } catch (e) {
            expect(e.message).to.eql('Invalid argument: digestFunction must be a function');
          }
        });

        it('should throw when createPlaylists is not a function', () => {
          try {
            createISMParser(playlistParser, { digestFunction: 'string' });
            expect.fail('Should throw an error');
          } catch (e) {
            expect(e.message).to.eql('Invalid argument: digestFunction must be a function');
          }
        });
      });

      describe('validate parseXML parameter', () => {
        it('should throw when empty', () => {
          try {
            createISMParser(playlistParser, { parseXML: null });
            expect.fail('Should throw an error');
          } catch (e) {
            expect(e.message).to.eql('Invalid argument: parseXML must be a function');
          }
        });

        it('should throw when parseXML is not a function', () => {
          try {
            createISMParser(playlistParser, { parseXML: 'string' });
            expect.fail('Should throw an error');
          } catch (e) {
            expect(e.message).to.eql('Invalid argument: parseXML must be a function');
          }
        });
      });
    });

    describe('create parseManifest function should', () => {
      it('return an object with parseManifest function when no parameters were passed', () => {
        const result = createISMParser();

        expect(result).to.be.an('object');
        expect(result.parseManifest).to.be.a('function');
      });

      it('return an object with parseManifest function when valid parameters were passed', () => {
        const result = createISMParser(playlistParser, { digestFunction: () => {} });

        expect(result).to.be.an('object');
        expect(result.parseManifest).to.be.a('function');
      });
    });
  });

  describe('parseManifest should', () => {
    beforeEach(() => {
      sinon.resetHistory();
    });

    it('return parsed manifest data', () => {
      const { parseManifest } = createISMParser(playlistParser, {
        digestFunction: digestFunctionStub,
        parseXML: parseXMLStub,
      });

      const fakeURL = 'url';
      const fakeManifestXML = 'string';

      const result = parseManifest('url', 'string');

      expect(createPlaylistsStub.calledOnceWith({}, fakeURL)).to.be.true;
      expect(digestFunctionStub.calledOnceWith(fakeManifestXML)).to.be.true;
      expect(parseXMLStub.calledOnceWith(fakeManifestXML)).to.be.true;

      expect(result).to.eql({
        playlists: [],
        manifestHash: 'hash',
        url: fakeURL,
      })
    });
  });
});
