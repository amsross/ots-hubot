// Description:
//   appdynamics.
//
// Dependencies:
//   None
//
// Configuration:
//   None
//
// Commands:
//   None
//
// Notes:
//   None
//
// Author:
//   pclark

var toMarkdown = require("to-markdown");

module.exports = function(robot) {
  robot.router.post('/appdynamics/alert', function(req, res) {
    var room = {
      default: "@pat"
    };

    var data = req.body;

    // Some data exists
    if (data) {
      var deepLink = data.deepLink;
      var displayName = data.displayName;
      var summaryMessage = toMarkdown(data.summaryMessage);
      var tierName = data.tierName;
      var nodeName = data.nodeName;
      var eventMessage = toMarkdown(data.eventMessage);

      var payload = {
        "title": "AppDynamics Alert",
        "text": "<"+deepLink+"|"+displayName+">",
        "username": "Doomguy",
        "icon_emoji": ":finnadie:",
        "mrkdwn": true,
        "attachments": [{
          "color": "danger",
          "fields": [{
            "title": "Summary",
            "value": summaryMessage,
            "short": false
          }, {
            "title": "Tier",
            "value": tierName,
            "short": true
          }, {
            "title": "Node Name",
            "value": nodeName,
            "short": true
          }, {
            "title": "Detail",
            "value": eventMessage,
            "short": false
          }]
        }]
      };

      // Default can be changed to add channels based on summary message / display name or whatever
      robot.messageRoom(room["default"], payload);
    }

    // End response
    res.end('ok');
  });
};
