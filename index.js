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

var apiai = require('apiai');

var app = apiai("2c072254b11a4ff3a498e1b2c2d74a2a", "16cd2348-45b2-4059-83c1-7849b075d456");


// [{ username : string, name : string, service : string }]
var lookup_data = [];


controller.hears('.*', ['direct_mention','direct_message'], function (bot, message) {
  
  var request = app.textRequest(message.text);
  
  var action;
  
  request.on('response', function(response) {
      action = response.result.action;
      
      if ('put_name_service' === action) {
        bot.reply(message, 'I will add your information!');
      }
      
  });
  
  request.on('error', function(error) {
      bot.reply(message, 'An error occurred, I\'m afraid.');
  });
  
  request.end()
  
})


// username -> service -> [name]
function get_name_service(username,service) {
  
  return lookup_data.
           filter(function (info) { return username === info.username; }).
           map(function (info) {
             return info.name;
           });
  
}


// service -> [{ name : string, names : [string] }]
function get_with_service(service) {
  
}


// name -> [{ service : string, names : [string] }]
function get_with_name(username) {
  
}


// string -> string -> ()
function put_name_service(username,name,service) {
  
  lookup_data.push({ username: current_user, name: name, service: service });
  
}