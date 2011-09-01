var irc = require('irc'),
    options = require("nomnom").opts({
      host: {
        string: "-H HOST, --host=HOST",
        default: "irc.freenode.net",
        help: "What IRC network to connect to. (Default: irc.freenode.net)"
      },
      nick: {
        string: "-n NICK, --nick=NICK",
        default: "MBot",
        help: "IRC nick to use. (Default: MBot)"
      },
      channels: {
        string: "-c CHANNELS, --channels=CHANNELS",
        default: "",
        help: "IRC channels to join (comma-separated, no '#')."
      },
      mpd_port: {
        string: "-mp PORT --mpd_port==PORT",
        default: 6600,
        help: "MPD Port to connect to. (Default: 6600)"
      },
      mpd_host: {
        string: "-mh HOST --mpd_host==HOST",
        default: "localhost",
        help: "MPD Host to connect to. (Default: localhost)"
     }
    }).parseArgs();

var MPD = require('./node-mpd/lib/index.js');
var mpd = new MPD(options.mpd_host, options.mpd_port);
mpd.debug = true;

var CHANNELS = options.channels.split(',');
CHANNELS.forEach(function(channel, i) {
  CHANNELS[i] = '#' + channel.trim();
});

var client = new irc.Client(options.host, options.nick, {
  channels: CHANNELS
});

client.addListener('message', function (from, to, message) {
  var target, isChannel = false;
  if (to.indexOf("#") == 0) {
    target = to;
    isChannel = true;
  } else {
    target = from;
  }

  if (isChannel) {
    if (message.indexOf(options.nick) == 0) {
      if (message.match(/whats playing/)) {
        mpd.send('currentsong', function(cs) {
          client.say(target, cs.Artist + " - " + cs.Title);
        });
      }
      if (message.match(/who are you/)) {
        client.say("I am an MPD music bot that displays the currently playing song. Try asking me whats playing.");
      }
      if (message.match(/next/)) {
        mpd.send('next', function() {
          mpd.send('currentsong', function(cs) {
            client.say(target, cs.Artist + " - " + cs.Title);
          });
        });
      }
    }
  }
});
