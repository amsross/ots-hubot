
module.exports = function( robot ) {

  // This command needs to be added as the final Task un a build job:
  // curl -X POST -H "Content-Type: application/json" -d '{"room": "general", "planKey":"${bamboo.planKey}","buildNumber":"${bamboo.buildNumber}"}' ${bamboo.hubotUrl}/hubot/bamboo/result
  // substitue "general" with a user or channel name (without @ or #)
  robot.router.post('/hubot/bamboo/result', function(req, res) {

    var data = req.body.payload != null ? JSON.parse(req.body.payload) : req.body;
    var room = data.room;
    var planKey = data.planKey;
    var buildNumber = data.buildNumber;
    var host = process.env.BAMBOO_HOST;
    var port = process.env.BAMBOO_PORT;
    var user = process.env.BAMBOO_USER;
    var pass = process.env.BAMBOO_PASS;

    if ( !room || !planKey || !buildNumber || !host || !port || !user || !pass ) {
      return null;
    }

    var auth = user + ':' + pass;
    var url  = "http://" + host + ":"  + port + "/rest/api/latest/result/" + planKey + "/" + buildNumber + ".json";

    return robot.http( url )
      .query({ "os_authType": "basic" })
      .headers({ Authorization: "Basic " + new Buffer(user + ':' + pass).toString('base64') })
      .get()(function( err, res, body ) {
        if ( err ) return err;

        var json = JSON.parse( body );
        var fields = [];
        fields.push({
          title: "Successful Tests",
          value: json.successfulTestCount,
          short: true,
        });
        fields.push({
          title: "Failed Tests",
          value: json.failedTestCount,
          short: true,
        });

        return robot.emit( "slack-attachment", {
          channel: room,
          message: "message",
          content: {
            text: json.state,
            fallback: "Build Results: " + json.plan.name,
            pretext: json.plan.name + "\nhttp://" + host + ":" + port + "/browse/" + json.key,
            color: json.state == "Successful" ? "good" : "danger",
            fields: fields
          }
        });
      });
  });
};
