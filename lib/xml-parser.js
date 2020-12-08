'use strict';

const { parse } = require('fast-xml-parser');

const parserOptions = {
  attributeNamePrefix: '',
  ignoreAttributes: false,
  parseAttributeValue: true,
};

function XMLParser(manifestXML) {
  const result = parse(manifestXML, parserOptions);
  if (!result) throw new Error('Non XML value was provided');

  return result;
}

module.exports = {
  XMLParser
};

