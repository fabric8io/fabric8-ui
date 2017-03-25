#!/usr/bin/env node

var fs = require('fs');

function printVersionNo() {
  fs.readFile(__dirname + '/package.json', function(err, data) {
    if (err) throw err;
    console.log(JSON.parse(data.toString())['version']);
  });
}

printVersionNo();
