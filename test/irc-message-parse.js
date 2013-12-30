var t = require('tape');
var parse = require('../lib/protocol').parse;


t.test('trailing space', function(t) {
    var res = parse(':test FOO   ');
    t.equal(res.cmd, 'FOO');
    t.equal(res.target, null);
    t.end();
});

t.test('message with no prefix', function(t) {
    var res = parse('PRIVMSG #foo :This is a test');
    t.equal(res.cmd, 'PRIVMSG');
    t.equal(res.target, '#foo');
    t.equal(res.text, 'This is a test');
    t.end();
});

t.test('multi-space content', function(t) {
    var res = parse(":test PRIVMSG foo :A string   with spaces   ");
    t.equal(res.cmd, 'PRIVMSG');
    t.equal(res.text, 'A string   with spaces   ');
    t.end()
});

t.test('extraneous spaces', function(t) {
    var res = parse(":test     PRIVMSG    foo     :bar");
    t.equal(res.source, 'test');
    t.equal(res.cmd, 'PRIVMSG');
    t.equal(res.target, 'foo');
    t.equal(res.text, 'bar');
    t.end();
});
 
t.test('multiple params', function(t) {
    var res = parse(":test PRIVMSG foo   bar baz :multiple words  ");
    t.equal(res.source, 'test');
    t.equal(res.cmd, 'PRIVMSG');
    t.equal(res.target, 'foo');
    t.deepEqual(res.params, ['foo', 'bar', 'baz']);
    t.equal(res.text, 'multiple words  ');
    t.end();
});
 
t.test('colon channel', function(t) {
    var res = parse(":test PRIVMSG #chan:foo   bar baz :multiple words  ");
    t.equal(res.source, 'test');
    t.equal(res.cmd, 'PRIVMSG');
    t.equal(res.target, '#chan:foo');
    t.deepEqual(res.params, ['#chan:foo', 'bar', 'baz']);
    t.equal(res.text, 'multiple words  ');
    t.end();
});

t.test('tags', {skip: true}, function(t) {
    var res = parse("@test=super;single :test!me@test.ing FOO bar baz quux :This is a test");
    t.notOk('TODO', 'TODO');
    t.end();
});

