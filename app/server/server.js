'use strict';

var loopback = require('loopback');
var path = require('path');
var boot = require('loopback-boot');
var electron = require('electron');
var fs = require('fs');

var app = (module.exports = loopback());

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// The DB file will be the user data directory.
let dbPath;
if (process.env.NODE_ENV === 'development') {
  dbPath = path.join(__dirname, 'sqlite3.db');
} else {
  dbPath = path.join(electron.app.getPath('userData'), 'sqlite3.db');
}

var copyDatabaseIfNecessary = function() {
  if (fs.existsSync(dbPath)) {
    return Promise.resolve();
  }

  // Copy database
  return new Promise((resolve, reject) => {
    const source = path.join(__dirname, './sqlite3.db');
    let rd = fs.createReadStream(source);
    rd.on('error', reject);
    let wr = fs.createWriteStream(dbPath);
    wr.on('error', reject);
    wr.on('finish', resolve);
    rd.pipe(wr);
  });
};

copyDatabaseIfNecessary().then(() => {
  app.datasources.sqlite = loopback.createDataSource({
    connector: 'loopback-connector-sqljs',
    file_name: dbPath,
  });

  boot(app, __dirname, function(err) {
    if (err) throw err;

    // start the server
    app.start();
  });
});
