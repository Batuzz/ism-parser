'use strict';

const { createMD5hash, getSegmentsRootUrl } = require('../../lib/utils');
const { expect } = require('chai');

describe('utils', () => {
  describe('createMD5hash', () => {
    it('returns hex hash when called with proper data', () => {
      const expectedHash = '2875d517bcfc18668b4366d60741374e';
      const result = createMD5hash('ism-parser');
      expect(result).to.eql(expectedHash);
    });

    it('throws when no data was provided', () => {
      try {
        createMD5hash(undefined);
        expect.fail('Should throw error')
      } catch (e) {
        expect(e).to.not.be.null;
      }
    });
  });

  describe('getSegmentsRootUrl', () => {
    describe('should return valid root url', () => {
      const urlSets = [{
        manifestUrl: 'http://test.com/some/stuff',
        expectedSegmentUrl: 'http://test.com/some'
      }, {
        manifestUrl: 'http://test.com/some/stuff/2',
        expectedSegmentUrl: 'http://test.com/some/stuff'
      }, {
        manifestUrl: 'https://test.com/some/stuff/with/a/lot/of/slashes',
        expectedSegmentUrl: 'https://test.com/some/stuff/with/a/lot/of'
      }];

      urlSets.forEach(({ manifestUrl, expectedSegmentUrl }) => {
        it(`for ${manifestUrl}`, () => {
          const result = getSegmentsRootUrl(manifestUrl)
          expect(result).to.eql(expectedSegmentUrl);
        });
      });
    });

    it('should return empty string when no slashes are found in url', () => {
      const result = getSegmentsRootUrl('test');
      expect(result).to.eql('');
    });

    describe('should throw when non-string value was passed', () => {
      const set = [
        {},
        null,
        undefined,
        new Error('test'),
        15,
        12.555,
        function() {},
        () => {}
      ];

      set.forEach(nonStringValue => {
        it(`for ${nonStringValue}`, () => {
          try {
            getSegmentsRootUrl(nonStringValue);
            expect.fail('Should throw error');
          } catch (e) {
            expect(e).to.not.be.null;
          }
        })
      })
    });
  })
});
