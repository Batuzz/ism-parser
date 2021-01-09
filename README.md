# ISM Parser

Library used for parsing ISM manifest files.

Example usage:

```js
const createParser = require('ism-parser');
const { readFileSync, writeFileSync } = require('fs');

// Assets can be found in libary's test/assets directory
const manifestString = readFileSync(__dirname + '/assets/720p_H264_AAC_encrypted.ism').toString();
const manifestUrl = 'http://playready.directtaps.net/smoothstreaming/TTLSS720VC1/To_The_Limit_720.ism/Manifest';

const parser = createParser();
const result = parser.parseManifest(manifestUrl, manifestString)
writeFileSync('output.json', JSON.stringify(result, null, 2));
```
