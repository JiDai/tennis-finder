const fs = require('fs');
const geojsonhint = require('@mapbox/geojsonhint');

const file = process.argv[2];

if (!file) {
    console.log('Please specify a file');
    process.exit(1);
}

console.log('Hinting file ', file);

const fileContent = fs.readFileSync(file, { encoding: 'utf8' });
const results = geojsonhint.hint(fileContent);

if (results.length === 0) {
    console.log('File seems OK');
} else {
    console.log('results: ', results);
}
