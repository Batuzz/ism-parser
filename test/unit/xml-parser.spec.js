'use strict';

const { XMLParser } = require('../../lib/xml-parser');
const { expect } = require('chai');
const { readFileSync } = require('fs');
const { join } = require('path');

describe('XML parser', () => {

  const xmlValue = readFileSync(join(__dirname, '../fixtures/test.xml')).toString();
  const expectedJSON = {
    exampleXML: {
      field1: 'value1',
      field2: 'value2',
    },
  };

  it('should parse example xml', () => {
    const result = XMLParser(xmlValue);
    expect(result).to.eql(expectedJSON);
  });

  it('should throw when non-xml was provided', () => {
    try {
      XMLParser('non-xml');
      expect.fail('Should throw an error');
    } catch (e) {
      expect(e.message).to.eql('Non XML value was provided')
    }
  });
});
