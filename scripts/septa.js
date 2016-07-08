// Description:
//   Septa.
//
// Dependencies:
//   None
//
// Configuration:
//   None
//
// Commands:
//   hubot is septa fucked - Returns whether septa is fucked or not
//
// Notes:
//  None
//
// Author:
//   frank

module.exports = function (robot) {
  robot.respond(/is septa fucked/i, function(msg) {
    msg
      .http("http://www.isseptafucked.com/api/rr")
      // .query({
      //   format: "text",
      //   message: msg.match[2]
      // })
      .get()(function(err, res, body) {
        var data = JSON.parse(body);
        msg.send('Regional Rail is ' + data.status.status);
        return msg.send(data.status.message);
      });
  });
};
