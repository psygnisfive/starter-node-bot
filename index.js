var Botkit = require('botkit')

// Expect a SLACK_TOKEN environment variable
var slackToken = process.env.SLACK_TOKEN
if (!slackToken) {
  console.error('SLACK_TOKEN is required!')
  process.exit(1)
}

var controller = Botkit.slackbot()
var bot = controller.spawn({
  token: slackToken
})

bot.startRTM(function (err, bot, payload) {
  if (err) {
    throw new Error('Could not connect to Slack')
  }
})

var shadyData = [];

var apiai = require('apiai');

var app = apiai("2c072254b11a4ff3a498e1b2c2d74a2a", "16cd2348-45b2-4059-83c1-7849b075d456");

controller.hears('.*', ['direct_mention','direct_message'], function (bot, message) {
  bot.reply(message, 'You said ' + message.text + '.');
  
  if (0 != shadyData.length) {
    bot.reply(message, 'Previously, you\'ve said:\n     ' + shadyData.join('\n     '));
  } else {
    bot.reply(message, 'You haven\'t said anything before.');
  }
  
  shadyData.push(message.text);
  
  var request = app.textRequest('do something');
  
  request.on('response', function(response) {
      bot.reply(message, 'Woot!\n\n' + response);
  });
  
  request.on('error', function(error) {
      bot.reply(message, 'Aww.\n\n' + error);
  });
  
  request.end()
  
})