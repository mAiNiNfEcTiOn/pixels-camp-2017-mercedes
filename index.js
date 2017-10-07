process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const apiai = require('apiai');
const util = require('util');

const app = apiai(process.env.API_AI_TOKEN);
const endpoints = require('./endpoints');


var RtmClient = require('@slack/client').RtmClient;
var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;

const usersSessionIds = {};

const defaultOptions = {
  endpoint: '/api/',
  hostname: 'openapi-dev',
  secure: false,
};

var bot_token = process.env.SLACK_BOT_TOKEN;


let channel;

var rtm = new RtmClient(bot_token);

// The client will emit an RTM.AUTHENTICATED event on successful connection, with the `rtm.start` payload
rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, (rtmStartData) => {
  channel = rtmStartData.channels.find(item => item.name === process.env.SLACK_BOT_CHANNEL);
  console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
});

// you need to wait for the client to fully connect before you can send messages
rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, function () {
  console.log('online');
  rtm.sendMessage("Hello!", channel.id);
});

rtm.on('message', ({ user, text}) => {
  if (!user) {
    return;
  }
  console.log(user + ">> " + text);

    if (!usersSessionIds.hasOwnProperty(user)) {
      usersSessionIds[user] = {
        options: Object.assign({}, defaultOptions, { sessionId: user.substr(0, 36) }),
        sessionData: {},
      };
    }

    const session = usersSessionIds[user];

    if (/^[A-Z0-9]+$/.test(text)) {
      session.sessionData.vin = text;
      rtm.sendMessage(`Your VIN was set as "${text}"`, channel.id);
      return;
    }

    if (!session.sessionData.hasOwnProperty('vin')) {
      rtm.sendMessage('In order to help you, please provide (only) your Vehicle Identification Number (VIN)', channel.id);
      return;
    }

    const request = app.textRequest(text, session.options);
    request.on('response', (resp) => {
      if (resp.result && resp.result.action && resp.result.action.includes('car.')) {
        const action = resp.result.action.split('.')[1];

        if (endpoints.hasOwnProperty(action)) {
          endpoints[action](rtm, channel, session.sessionData, resp);
          return;
        }
      }

      rtm.sendMessage(`I'm sorry, but I can't help you with that.`, channel.id);
    });
    request.on('error', (err) => console.log(util.inspect(err, true, null, true)));
    request.end();
})

rtm.start();
