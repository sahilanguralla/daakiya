const path = require('path');

module.exports = {
  target: 'node',
  entry: {
    app: ['./index.js'],
  },
  output: {
    path: path.resolve(__dirname, '../build'),
    filename: 'bundle-back.js',
  },
};
