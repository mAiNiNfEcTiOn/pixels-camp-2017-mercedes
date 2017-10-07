const { baseUrl, ssl } = require('../config');
const request = require('request-promise-native');

module.exports = (bot, channel, sessionData, resp) => {
  const { ca, cert, key, passphrase } = ssl;
  const { vin } = sessionData;

  new Promise((resolve, reject) => {
    bot.sendMessage(`Requesting information about the vehicle "${vin}":`, channel.id, resolve);
  }).then(() => {
    return request({
      ca,
      cert,
      key,
      json: true,
      passphrase,
      securityOptions: 'SSL_OP_NO_SSLv3',
      url: `${baseUrl}/vega/vehicles/${vin}?fields=batteryLevel,connection.connected,connection.since,doors.allClosed,doors.leftOpen,doors.locked,doors.rightOpen,doors.trunkOpen,engineOn,fuelLevel,geo.latitude,geo.longitude,ignitionOn,immobilizerEngaged,mileage,powerState,vin`,
    });
  }).then((apiResp) => {
    const { doors } = apiResp;
    console.log(doors);
    let closedDoors = 'No';
    if (doors.locked) {
      if (doors.locked && doors.allClosed) {
        closedDoors = 'All closed';
      } else {
        closedDoors = 'Partially';
      }
    }

    return new Promise((resolve, reject) => {
      bot.sendMessage(`Here follows the information about the vehicle "${vin}":
  - Engine: ${apiResp.engineOn ? 'On' : 'Off'}
  - Imobilized: ${apiResp.immobilizerEngaged ? 'Yes' : 'No'}
  - Doors:
    - Left: ${apiResp.doors.leftOpen ? 'Open' : 'Closed'}
    - Right: ${apiResp.doors.rightOpen ? 'Open' : 'Closed'}
    - Trunk: ${apiResp.doors.trunkOpen ? 'Open' : 'Closed'}
    
    - Locked: ${closedDoors}
`, channel.id, resolve);
    });
      // bot.sendMessage(`- Engine: ${apiResp.engineOn ? 'On' : 'Off'}`);
      // bot.sendMessage(`- Imobilized: ${apiResp.immobilizerEngaged ? 'Yes' : 'No'}`);
      // bot.sendMessage('- Doors:');
      // bot.sendMessage(`  - Left: ${apiResp.doors.leftOpen ? 'Open' : 'Closed'}`);
      // bot.sendMessage(`  - Right: ${apiResp.doors.rightOpen ? 'Open' : 'Closed'}`);
      // bot.sendMessage(`  - Trunk: ${apiResp.doors.trunkOpen ? 'Open' : 'Closed'}`);
      // bot.sendMessage('');
      // bot.sendMessage(`  - Locked: ${closedDoors}`);
    })
    .catch(console.error);
}