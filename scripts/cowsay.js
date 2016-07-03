// Description:
//   Cowsay.
//
// Dependencies:
//   None
//
// Configuration:
//   None
//
// Commands:
//   hubot cowsay <statement> - Returns a cow that says what you want
//
// Notes:
//  None
//
// Author:
//   brettbuddin

module.exports = function (robot) {
  robot.respond(/cowsay( me)? (.*)/i, function(msg) {
    msg
      .http("http://cowsay.morecode.org/say")
      .query({
        format: "text",
        message: msg.match[2]
      })
      .get()(function(err, res, body) {
        return msg.send("```\n" + body + "\n```");
      });
  });
};
