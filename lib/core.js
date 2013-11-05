
module.exports = function(irc) {
    irc.on('ping', function(e) {
        irc.send('pong', e.text);
    });
    var self = {};
    self.login = function login(params) {
        irc.send('nick', params.nick);
        irc.send('user', params.user, 0, '*', params.name);
        if (params.pass) irc.send('pass', params.pass);
    }
    return self;
}
