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
//   hubot next train on <line> from <stop> - Find out the next train departure times
//   hubot forget all transit stops - Forget all the onestop ids for stops
//   hubot forget all transit lines - Forget all the oneline ids for lines
//
// Notes:
//  None
//
// Author:
//   amsross
const dotty = require("dotty");
const h = require("highland");
const m = require("moment-timezone");
const r = require("ramda");
const F = require("fuse.js");
const url = require("url");
const request = require("request");

const baseUrlLines = url.parse("https://transit.land/api/v1/operators?offset=0&per_page=100&sort_key=id&sort_order=asc", true);
const baseUrlStops = url.parse("https://transit.land/api/v1/stops?offset=0&per_page=100&sort_key=id&sort_order=asc&served_by=foo", true);
const baseUrlSchedule = url.parse("https://transit.land/api/v1/schedule_stop_pairs?offset=0&per_page=100&sort_key=origin_arrival_time&sort_order=asc&origin_onestop_id=foo&origin_departure_between=foo&date=foo", true);

const findOperator = r.curry((msg, line, endpoint, result) => {

  const operators = [].concat(r.prop("operators", result));

  const fuse = new F(operators, {
    threshold: 0.2,
    keys: [
    { name: "short_name", weight: 0.7 },
    { name: "name", weight: 0.3 },
    ],
  });

  const matches = fuse.search(line);
  const nextEndpoint = r.path(["meta", "next"], result);

  if (r.length(matches)) return h(matches);
  if (nextEndpoint) return getLineOsid(msg, line, nextEndpoint);
  throw new Error(`no line found for ${line}`);
});

const getLineOsid = (msg, line, endpoint) => {

  // check the brain first
  return h([r.view(r.lensPath(["brain", "data", "transitland", "lines", line]), msg.robot)])
    .compact()
    // if there's nothing matching in the brain, hit the api
    .otherwise(() => {
      return h.wrapCallback(request, (res, body) => body)(endpoint)
        .compact()
        .map(JSON.parse)
        // if there aren't any operators, we can't do anything
        .filter(r.path(["operators"]))
        .otherwise(() => {throw new Error(`invalid response from ${endpoint}`)})
        // if there's no "next" url, we can't recurse
        .flatMap(findOperator(msg, line, endpoint))
        .take(1)
        .pick(["name", "short_name", "onestop_id", "timezone"])
        .tap(result => {
          // store this in for later
          dotty.put(msg.robot, ["brain", "data", "transitland", "lines", line], result);
          msg.send(`By "${line}", I assume you meant "${result.name}"`);
        });
    });
};

const findStop = r.curry((msg, stop, endpoint, result) => {

  const stops = [].concat(r.prop("stops", result));

  const fuse = new F(stops, {
    threshold: 0.3,
    keys: ["name"],
  });

  const matches = fuse.search(stop);
  const nextEndpoint = r.path(["meta", "next"], result);

  // if there's a match, return that
  if (r.length(matches)) return h(matches);
  // if there is a next endpoint, hit it
  if (nextEndpoint) return getStopOsid(msg, stop, nextEndpoint);
  // uh-oh
  throw new Error(`no stop found for ${stop}`);
});

const getStopOsid = r.curry((msg, stop, endpoint) => {

  // check the brain first
  return h([r.view(r.lensPath(["brain", "data", "transitland", "stops", stop]), msg.robot)])
    .compact()
    // if there's nothing matching in the brain, hit the api
    .otherwise(() => {
      return h.wrapCallback(request, (res, body) => body)(endpoint)
        .compact()
        .map(JSON.parse)
        // if there aren't any operators, we can't do anything
        .filter(r.path(["stops"]))
        .otherwise(() => {throw new Error(`invalid response from ${endpoint}`)})
        // if there's no "next" url, we can't recurse
        .flatMap(findStop(msg, stop, endpoint))
        .take(1)
        .pick(["name", "short_name", "onestop_id", "timezone"])
        .tap(result => {
          // store this in for later
          dotty.put(msg.robot, ["brain", "data", "transitland", "stops", stop], result);
          msg.send(`By "${stop}", I assume you meant "${result.name}"`);
        });
    });
});


module.exports = function (robot) {

  robot.respond(/next train on (.*) from (.*)/i, function(msg) {
    var line = msg.match[1].trim().toLowerCase();
    var stop = msg.match[2].trim().toLowerCase();

    if ( !line || !stop ) {
      return msg.reply("You need to tell me the line and the stop");
    }

    return getLineOsid(msg, line, url.format(r.set(r.lensProp("search"), undefined, baseUrlLines)))
      .flatMap(line => {
        const now = m().tz(r.prop("timezone", line));

        const lineOsid = r.prop("onestop_id", line);

        const stopsUrl = r.compose(
            url.format,
            r.evolve({
              "search": r.always(undefined),
              "query": {
                "served_by": r.always(lineOsid),
              },
            }))(baseUrlStops);

        return getStopOsid(msg, stop, stopsUrl)
          .flatMap(stop => {
            const stopOsid = r.prop("onestop_id", stop);

            const between = now.format("HH:mm:00") + "," + m.min(now.clone().add(1, "h"), now.clone().endOf("d")).format("HH:mm:00");
            const schedulesUrl = r.compose(
                url.format,
                r.evolve({
                  "search": r.always(undefined),
                  "query": {
                    "origin_onestop_id": r.always(stopOsid),
                    "origin_departure_between": r.always(between),
                    "date": r.always(now.format("YYYY-MM-DD")),
                  },
                }))(baseUrlSchedule);

            return h.wrapCallback(request, (res, body) => body)(schedulesUrl)
              .compact()
              .map(JSON.parse)
              // if there aren't any operators, we can't do anything
              .filter(r.path(["schedule_stop_pairs"]))
              .otherwise(() => {throw new Error(`invalid response from ${endpoint}`)})
              // if there's no "next" url, we can't recurse
              .pluck(["schedule_stop_pairs"])
              .flatten()
              .take(5)
              .pick(["origin_departure_time", "trip_headsign"])
              .map(r.evolve({
                "origin_departure_time": time => {
                  return m(now.format("YYYY-MM-DD ") + time).format("hh:mma");
                }
              }))
              .map(r.values)
              .invoke("join", [" to "])
              .collect()
              .map(trains => {
                return "The next train" + ((r.length(trains) > 1) ? "s" : "")+ " from " + stop.name + " " + ((r.length(trains) > 1) ? "are" : "is") + " " + trains.join(", ");
              });
          });
      })
      .errors(err => {
        // just swallow this
        h.log(err);
      })
      .otherwise([
          "For whatever reason, I couldn't find anything like that.",
          "Maybe you should work on your communication skills.",
      ])
      .ratelimit(1, 1000)
      .each(msg.send.bind(msg));
  });

  robot.respond(/forget all transit (stop|line)s/i, function(msg) {
    var type = msg.match[1].trim().toLowerCase();

    dotty.put( robot, "brain.data.transitland." + type + "s", {} );
    return msg.send("Oh shit! I forgot all the transit " + type + "s!");
  });
};
