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

  robot.respond(/(which|what) trains/i, function(msg) {
    msg
      .http("http://www.isseptafucked.com/api/rr")
      // .query({
      //   format: "text",
      //   message: msg.match[2]
      // })
      .get()(function(err, res, body) {
        var data = JSON.parse(body);

        if (data.status.late && data.status.late.length) {
          data.status.late.forEach(function(trainDetails) {
            msg.send(trainDetails);
          });
        }
        else {
          msg.send('No trains are late.');
          msg.send('http://i.imgur.com/J1VZuRp.gif');
        }
        return;
      });
  });

  robot.respond(/why is\s(.)*train\s(.)*late/i, function(msg) {
    var reasons = [
      'equipment problems',
      'a problem with the equipment',
      'signaling problems',
      'a problem with signals',
      'slippery rail season',
      'inclement weather conditions',
      'hot rail season',
      'overheating rail conditions',
      'overhead wire problems',
      'caternary displacement syndrome',
      'communication problems',
      'railroad congestion',
      'unusually high volume',
      'low electrolytes',
      'irritable bowel syndrome',
      'a small kitten on the tracks',
      'a penny on the tracks',
      'a horse on the tracks',
      'a family of small horses running alongside the tracks',
      'it being Friday somewhere',
      'the conductor being drunk',
      'the engineer being high',
      'improper implementation of train.js',
      'a bear on the tracks',
      'an unrelated boating accident',
      'the string cheese incident',
      'a rogue train',
      'this economy',
      'bees',
      'errant triangulation residuals',
      'reticulating splines',
      'wine day',
      'insufficient memory',
      'low turn signal fluid',
      'johansen rod decoupling effect'
    ];
    var reason = reasons[Math.floor(Math.random()*reasons.length)];
    return msg.send('The train is late due to '+reason+'.');
  });
};
