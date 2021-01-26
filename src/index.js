const { start } = require('./server');
var path = require("path");
global.appRoot = path.resolve(__dirname);


start();

