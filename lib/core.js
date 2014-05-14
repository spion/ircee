
module.exports = function(irc) {
    irc.on('ping', function(e) {
        irc.send('pong', e.text);
    });
    var self = {};
    self.login = function login(params) {
        if (params.pass) irc.send('pass', params.pass);
        irc.send('nick', params.nick);
        irc.send('user', params.user, 0, '*', params.name);
    }
    return self;
}
