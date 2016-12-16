var Helper = require("hubot-test-helper")

describe("transitland", function() {

  before(function() {
    this.helper = new Helper("../../scripts/transitland.js");
  });

  beforeEach(function() {
    this.room = this.helper.createRoom();

    nock("https://transit.land")
      .get("/api/v1/operators")
      .query(true)
      .once()
      .reply(200, {
        "operators": [
        {
          "name": "Port Authority Transit Corporation",
          "short_name": "PATCO",
          "onestop_id": "o-dr4e-portauthoritytransitcorporation",
          "timezone": "America/New_York",
        },
        {
          "name": "Bay Area Rapid Transit",
          "short_name": "BART",
          "onestop_id": "o-9q9-bart",
          "timezone": "PST",
        }
        ]
      });

    nock("https://transit.land")
      .get("/api/v1/stops")
      .query(true)
      .once()
      .reply(200, {
        "stops": [
        {
          "onestop_id": "s-dr4e382mxm-15~16thandlocust",
          "name": "15-16th and Locust",
        },
        {
          "onestop_id": "s-dr4e38k3wh-12~13thandlocust",
          "name": "12-13th and Locust",
        }
        ]
      });

    nock("https://transit.land")
      .get("/api/v1/schedule_stop_pairs")
      .query(true)
      .once()
      .reply(200, {
        "schedule_stop_pairs": [
        {
          "trip_headsign": "Lindenwold",
          "origin_departure_time": "22:22:00",
        },
        {
          "trip_headsign": "Lindenwold",
          "origin_departure_time": "22:42:00",
        },
        {
          "trip_headsign": "Lindenwold",
          "origin_departure_time": "23:02:00",
        }
        ]
      });
  });

  afterEach(function() {
    nock.cleanAll();
    this.room.destroy();
  });

  describe( "ask for onestop id for the line if unknown", function() {

    beforeEach(function(done) {
      this.room.user.say("alice", "hubot next train on patco from 15-16th and Locust");
      setTimeout( done, 250 );
    });

    it( "should reply to the user", function() {
      assert.ok(this.room.messages[1][1].match(/By "patco", I assume you meant "Port Authority Transit Corporation"/))
    });
  });

  describe( "ask for onestop id for the stop if unknown", function() {

    beforeEach(function(done) {
      dotty.put( this, "room.robot.brain.data.transitland.lines.patco", {
        "name": "Port Authority Transit Corporation",
        "short_name": "PATCO",
        "onestop_id": "o-dr4e-portauthoritytransitcorporation",
        "timezone": "America/New_York",
      });
      this.room.user.say("alice", "hubot next train on patco from 15th 16th and Locust");
      setTimeout( done, 250 );
    });

    it( "should reply to the user", function() {
      assert.ok(this.room.messages[1][1].match(/By "15th 16th and locust", I assume you meant "15-16th and Locust"/))
    });
  });

  describe( "find next times for defined trains", function() {

    beforeEach(function(done) {
      dotty.put( this, "room.robot.brain.data.transitland.lines.patco", {
        "name": "Port Authority Transit Corporation",
        "short_name": "PATCO",
        "onestop_id": "o-dr4e-portauthoritytransitcorporation",
        "timezone": "America/New_York",
      });
      dotty.put( this, "room.robot.brain.data.transitland.stops.15th 16th and locust", {
        "onestop_id": "s-dr4e382mxm-15~16thandlocust",
        "name": "15-16th and Locust",
      });

      this.room.user.say("alice", "hubot next train on patco from 15th 16th and Locust");
      setTimeout( done, 250 );
    });

    it( "should respond with the upcoming times within an hour", function() {
      assert.ok(this.room.messages[1][1].match("The next trains from 15-16th and Locust are 10:22pm to Lindenwold, 10:42pm to Lindenwold, 11:02pm to Lindenwold"));
    });
  });

  describe( "forget transit stops and lines", function() {

    beforeEach(function(done) {
      dotty.put( this, "room.robot.brain.data.transitland.lines.patco", "o-dr4e-portauthoritytransitcorporation" );
      dotty.put( this, "room.robot.brain.data.transitland.stops.15th 16th and locust", "s-dr4e382mxm-15~16thandlocust" );

      this.room.user.say("alice", "hubot forget all transit craps");
      this.room.user.say("alice", "hubot forget all transit lines");
      this.room.user.say("alice", "hubot forget all transit stops");
      setTimeout( done, 250 );
    });

    it( "should respond with the upcoming times within an hour", function() {
      assert.ok(this.room.messages[3][1].match("Oh shit! I forgot all the transit lines!"));
      assert.ok(this.room.messages[4][1].match("Oh shit! I forgot all the transit stops!"));
    });
  });
});
