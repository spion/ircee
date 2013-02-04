var protocol = require('../lib/protocol.js');

exports.parse_privmsg = function(t) {
    
    var res = protocol.parse(':nick!user@host PRIVMSG #channel :text goes here')
    t.deepEqual({ 
        raw: ':nick!user@host PRIVMSG #channel :text goes here',
        source: 'nick!user@host',
        cmd: 'PRIVMSG',
        user: { address: 'nick!user@host',
            nick: 'nick',
            user: 'user',
            host: 'host' 
        },
        params: [ '#channel' ],
        target: '#channel',
        text: 'text goes here' 
    }, res, 'protocol parse success');                                             
    t.done();
}
