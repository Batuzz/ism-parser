'use strict';

const { parse } = require('fast-xml-parser');

const parserOptions = {
  attributeNamePrefix: '',
  ignoreAttributes: false,
  parseAttributeValue: true,
};

function parseXML(manifestXML){
  return parse(manifestXML, parserOptions);
}

module.exports = {
  parseXML
};

