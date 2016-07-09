// Description:
//   patco.
//
// Dependencies:
//   None
//
// Configuration:
//   None
//
// Commands:
//   hubot next train on <line> from <stop> - Find out the next train departure time
//   hubot transit stop <stop> id is <id> - Set the onestop id for the stop
//   hubot transit line <line> id is <id> - Set the onestop id for the line
//   hubot forget all transit stops - Forget all the onestop ids for either stops
//   hubot forget all transit lines - Forget all the oneline ids for either lines
//
// Notes:
//  None
//
// Author:
//   amsross
var qs = require("querystring");
var _ = require("underscore");
var dotty = require("dotty");
var moment = require("moment");
var Fuse = require("fuse.js");

module.exports = function (robot) {

  robot.respond(/next train on (.*) from (.*)/i, function(msg) {
    var line = msg.match[1].trim().toLowerCase();
    var stop = msg.match[2].trim().toLowerCase();

    if ( !line || !stop ) {
      return msg.reply("You need to tell me the line and the stop");
    }

    if ( !dotty.get( robot, "brain.data.patco.lines." + line ) ) {
      var params = qs.stringify({
        per_page: 1000,
      });
      return msg.http("https://transit.land/api/v1/operators?" + params).get()((err, res, body) => {

        var operators = _.chain(JSON.parse(body))
          .pick("operators")
          .values()
          .flatten()
          .map(_.partial(_.pick, _, "onestop_id", "name", "short_name"))
          .value();

        var fuse = new Fuse(operators, {
          keys: [{
            name: "short_name",
            weight: 0.7,
          }, {
            name: "name",
            weight: 0.3,
          }],
        });
        var result = _.first(fuse.search(line));

        if ( !result ) {
          return msg.send("Can you tell me the onestop id for " + line + "?");
        }
        msg.send("By \"" + line + "\", I assume you meant \"" + result.name + "\"");
        dotty.put( robot, "brain.data.patco.lines." + line, result.onestop_id );
      });
    }

    if ( !dotty.get( robot, "brain.data.patco.stops." + stop ) ) {
      var params = qs.stringify({
        served_by: robot.brain.data.patco.lines[line],
      });
      return msg.http("https://transit.land/api/v1/stops?" + params ).get()((err, res, body) => {

        var stops = _.chain(JSON.parse(body))
          .pick("stops")
          .values()
          .flatten()
          .map(_.partial(_.pick, _, "onestop_id", "name"))
          .value();

        var fuse = new Fuse(stops, { keys: ["name"] });
        var result = _.first(fuse.search(stop));

        if ( !result ) {
          return msg.send("Can you tell me the onestop id for " + stop + "?");
        }
        msg.send("By \"" + stop + "\", I assume you meant \"" + result.name + "\"");
        dotty.put( robot, "brain.data.patco.stops." + stop, result.onestop_id );
      });
    }

    var now = moment();
    var params = qs.stringify({
      origin_onestop_id: robot.brain.data.patco.stops[stop],
      origin_departure_between: now.format("HH:mm:00") + "," + moment.min(now.add(1, "h"), now.endOf("d")).format("HH:mm:00"),
      date: now.format("YYYY-MM-DD"),
    });
    return msg.http("https://transit.land/api/v1/schedule_stop_pairs?" + params ).get()((err, res, body) => {

      var trains = _.chain(JSON.parse(body))
        .pick("schedule_stop_pairs")
        .values()
        .flatten()
        .map(_.partial(_.pick, _, "origin_departure_time", "trip_headsign"))
        .map((train) => {
          return _.extend(train, {
            origin_departure_time: moment(now.format("YYYY-MM-DD ") + train.origin_departure_time).format("hh:mma"),
          });
        })
        .map(_.values)
        .invoke("join", " to ")
        .value();

      if ( !_.size( trains ) ) {
        msg.send("I didn't find any trains from " + stop + " in the next hour.");
        return msg.send("I guess you're beat.");
      }

      msg.send("The next train" + ((_.size(trains) > 1) ? "s" : "")+ " from " + stop + " " + ((_.size(trains) > 1) ? "are" : "is") + " " + trains.join(", "));
    });
  });

  robot.respond(/(stop|line) (.*) id is (.*)/i, function(msg) {
    var type = msg.match[1].trim().toLowerCase();
    var name = msg.match[2].trim().toLowerCase();
    var osid = msg.match[3].trim();

    if ( !type || !name || !osid || (type !== "line" && type !== "stop") ) {
      return msg.reply("You need to tell me the line, the stop, and the onestop id");
    }

    dotty.put( robot, "brain.data.patco." + type + "s." + name, osid );
    return msg.send("onestop id for " + name + " set to " + osid);
  });

  robot.respond(/forget all transit (stop|line)s/i, function(msg) {
    var type = msg.match[1].trim().toLowerCase();

    dotty.put( robot, "brain.data.patco." + type + "s", {} );
    return msg.send("Oh shit! I forgot all the transit " + type + "s!");
  });
};
