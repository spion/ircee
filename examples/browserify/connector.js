var through = require('through'),
    split = require('split'),
    duplexer = require('duplexer'),
    net = require('net');


module.exports = connector;

function connector() {
    var connected = false;
    
    var inp = through(), spl = split(), out = through();
    var proto = through(function connector_proto(data) {
        if (connected) return this.push(data + '\n');
        else {
            var cmd_host_port = data.split(' '),
                cmd = cmd_host_port[0],
                host = cmd_host_port[1],
                port = cmd_host_port[2];

            if (cmd == 'CONNECT') {
                var sock = net.connect({host: host, port: port});
                proto.pipe(sock).pipe(out);
                connected = true;
            } else {
                this.push(data + '\n');
            }
        }
    });
    inp.pipe(spl).pipe(proto);
    return duplexer(inp, out);
}

