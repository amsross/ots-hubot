// Description:
//   List of suplies.
//
// Dependencies:
//   ramda/ramda
//   deoxxa/dotty
//
// Configuration:
//   None
//
// Commands:
//   hubot supplies add <user> <supply>, <supply>, <supply>, ...
//   hubot supplies remove <user> <supply>
//   hubot supplies show <user>
//   hubot supplies show [current user]
//
// Notes:
//  None
//
// Author:
//   amsross
const r = require("ramda");
const dotty = require("dotty");

module.exports = function (robot) {

  robot.respond(/supplies add (.*)/i, function(msg) {

    const match = msg.match[1].trim();

    const { user, supplies } = r.compose(
      r.converge(r.merge, [
        r.compose(r.objOf("user"), r.replace("@", ""), r.head),
        r.compose(r.objOf("supplies"), r.map(r.trim), r.split(","), r.join(" "), r.tail),
      ]),
      r.split(" "))(match);

    r.compose(
      r.partial(dotty.put, [robot, `brain.data.supplies.${user}`]),
      r.concat(supplies),
      r.reject(r.isNil),
      r.unnest, r.of,
      r.partialRight(dotty.get, [`brain.data.supplies.${user}`]))(robot);

    return msg.send(`Added ${supplies.join(", ")} to @${user}'s list`);
  });

  robot.respond(/supplies remove (.*)/i, function(msg) {

    const match = msg.match[1].trim();

    const { user, supplies } = r.compose(
      r.converge(r.merge, [
        r.compose(r.objOf("user"), r.replace("@", ""), r.head),
        r.compose(r.objOf("supplies"), r.map(r.trim), r.split(","), r.join(" "), r.tail),
      ]),
      r.split(" "))(match);

    r.compose(
      r.partial(dotty.put, [robot, `brain.data.supplies.${user}`]),
      r.without(supplies),
      r.reject(r.isNil),
      r.unnest, r.of,
      r.partialRight(dotty.get, [`brain.data.supplies.${user}`]))(robot);

    return msg.send(`Removed ${supplies.join(", ")} from @${user}'s list`);
  });

  robot.respond(/supplies show(.*)/i, function(msg) {

    const { user } = r.compose(
      r.objOf("user"),
      r.replace("@", ""),
      r.when(r.isEmpty, r.always(msg.message.user.name)),
      r.trim(),
      r.nth(1),
      r.prop("match"))(msg) ;
    const supplies = dotty.get(robot, `brain.data.supplies.${user}`) || [];

    return msg.send(`@${user}'s list is:\n * ${supplies.join("\n * ")}`);
  });
};

