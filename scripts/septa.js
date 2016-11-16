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

const pep = require("apep");

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
    "use strict";

    const thingEither = pep.choice("equipment", "train", "economy", "weather", "memory", "decoupling effect", "turn signal fluid", "communication");

    const thingFirst = pep.choice(thingEither, "overhead wire", "signaling", "railroad");
    const descLast = pep.choice("problems", "congestion");

    const descFirst = pep.choice("rogue", "overheating", "problematic", "congested", "a problem with the", "incorrect", "insufficient", "errant", "reticulating", "improper", "johansen rod", "inclement", "unusually high");
    const thingLast = pep.choice(thingEither, "overhead wires", "signals", "triangulation residuals", "splines", "weather");

    const syndromes = pep.seq(pep.choice("irritable bowel", "caternary displacement"), " syndrome");
    const seasons = pep.seq(pep.choice("slippery", "wet", "hot", "stubborn", "drunken"), " ", pep.choice("rail", "conductor", "engineer"), " ", pep.choice("season", "day", "week", "month"));
    const obstructions = pep.seq(pep.choice(
          pep.seq("a ", pep.choice("half-full 40oz", "penny", "horse", "small kitten", "bear")),
          pep.seq("an ", pep.choice("elephant", "erotic novella"))
          ), " on the tracks");

    const problems = pep.choice(
        pep.seq(pep.choice("signaling", "communication", "equipment", "overhead wire"), " problems"),
        pep.seq("a problem with ", pep.choice("the equipment", "controlled substances", "signals"))
        );

    const lowX = pep.seq("low ", pep.choice("turn signal fluid", "electrolytes"));

    const blame = pep.seq(pep.choice(
          pep.seq("the ", pep.choice("conductor", "enginner", "train", "commissioner", "mole people")),
          pep.choice("Dick Cheney", "Ron Burgundy", "@aaron.com", "Tronald Dump", "Barack Obama", "@jasonbot")
          ), " being ", pep.choice("drunk", "high"));

    const sayIt = pep.seq(
        "The train is late due to ",
        pep.choice(
          pep.seq(thingFirst, " ", descLast),
          pep.seq(descFirst, " ", thingLast),
          obstructions,
          syndromes,
          seasons,
          problems,
          lowX,
          blame,
          pep.choice(
            "a family of small horses running alongside the tracks",
            "a rogue train",
            "an improper implementation of train.js",
            "an unrelated boating accident",
            "bees",
            "it being Friday somewhere",
            "javascript fatigue",
            "a feeling of constant regret",
            "the string cheese incident",
            "this economy",
            "unusually high volume",
            "wine day"
            )));

    return msg.send(pep.run(sayIt));
  });
};
