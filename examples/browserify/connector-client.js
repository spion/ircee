var through = require('through'),
    split = require('split');

module.exports = connectorClient;

function connectorClient(host, port) {
    var connected;
    var s = through(function(data) {
        if (!connected) {
            this.push("CONNECT " + host + ' ' + port +'\n');
            connected = true;
        }
        this.push(data);
    });
    return s;
}
