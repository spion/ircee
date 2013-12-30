var ircee = require('../index');
var t = require('tape');

t.test('caching', function(t) {
    var counter = 0;
    var mod = function() {
        ++counter;
    }
    var irc = ircee();
    irc.use(mod);
    irc.use(mod);
    t.equals(counter, 1, 'module called only once')
    t.end();
});
