const { baseUrl, ssl } = require('../config');
const request = require('request-promise-native');

module.exports = (bot, channel, sessionData, resp) => {
  const { ca, cert, key, passphrase } = ssl;
  const { vin } = sessionData;

  const [ domain, namespace, action ] = resp.result.action.split('.');
  const isLock = action === 'close';

  new Promise((resolve, reject) => {
    bot.sendMessage(`Attempting to perform the action "${action} doors" on the vehicle "${vin}":`, channel.id, resolve);
  }).then(() => {
    return request({
      ca,
      cert,
      key,
      method: 'PUT',
      passphrase,
      securityOptions: 'SSL_OP_NO_SSLv3',
      url: `${baseUrl}/vega/vehicles/${vin}/doors/${isLock ? 'lock' : 'unlock'}`,
    });
  }).then((apiResp) => {
    return new Promise((resolve, reject) => {
      bot.sendMessage(`The action "${action} doors" on the vehicle "${vin}" was performed successfully`, channel.id, resolve);
    });      
  }).catch(console.error);
}