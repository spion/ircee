
module.exports = function(irc) {
    irc.on('connect', function() {
        irc.send('nick', 'test_ircling');
        irc.send('user', 'test_ircling', 0, '*', 'My name is testirc');
    });
    irc.on('ping', function(e) {
        irc.send('pong', e.text);
    });
    return null;
}
