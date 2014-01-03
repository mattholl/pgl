var plask = require('plask');
var vertex = require('./vertex');

function line(params) {
    params = params || {};
    this.vertices = params.vertices;
    this.material = params.material;
}

module.exports = line;