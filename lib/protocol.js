var split = require('split'),
Stream = require('stream'),
duplex = require('duplexer');

exports.parse = function protocol_parse(line) {
    var m = line.match(/^(:(\S+))?\s*([^:]\S+)\s+([^:]+)?(\s*:(.+))?/);
    var raw = m[0], source = m[2], cmd = m[3], 
    params = m[4], text = m[6];
    if (params) params = params.trim().split(' ');
    var target = params ? params[0] : null;
    var user = source ? source.match('(.+)!(.+)@(.+)') : null;
    return {
        raw: raw,
        source: source,
        cmd: cmd,
        user: user ? { 
            address: user[0], 
            nick: user[1], 
            user: user[2], 
            host: user[3] 
        } : null,
        params: params,
        target: target,
        text: text
    }
}

exports.construct = function protocol_construct(args) {
    args = [].slice.call(args);
    var last = args.length - 1;
    if (args[last] !== null)
        args[last] = ':' + args[last];
    else
        delete args[last];
    return args.join(' ') + '\n';
}

