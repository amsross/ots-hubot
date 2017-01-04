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

var slackify = require("slackify-html");

module.exports = function(robot) {
  robot.router.post('/appdynamics/alert/:room?', function(req, res) {
    var data = req.body;

    // Some data exists
    if (data) {
      var deepLink = data.deepLink;
      var displayName = data.displayName;
      var summaryMessage = slackify(data.summaryMessage);
      var tierName = data.tierName;
      var nodeName = data.nodeName;
      var eventMessage = slackify(data.eventMessage);

      var payload = {
        "title": "AppDynamics Alert",
        "text": "<"+deepLink+"|"+displayName+">",
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
          }],
          "mrkdwn_in": ["fields"]
        }]
      };

      // Default can be changed to add channels based on summary message / display name or whatever
      robot.messageRoom(req.params.room || "#data-appd-alerts", payload);
    }

    // End response
    res.end('ok');
  });
};
