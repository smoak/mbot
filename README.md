# MBot

A simple irc bot that you can query to show the currently playing song on mpd.

Usage
----
node mbot.js --channels="Comma,Separated,Channel,List,Without,The#symbol" --host=="some.irc.server" --port=6667 --mpd_port=6600 --mpd_host="localhost" --nick="BotNickName"

NOTES
----
This was a simple experiment to get to know node.js and have a bit of fun. It uses a modified version of node-mpd from https://github.com/robinduckett/node-mpd
