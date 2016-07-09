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
        },
        {
          "name": "Bay Area Rapid Transit",
          "short_name": "BART",
          "onestop_id": "o-9q9-bart",
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
      this.room.user.say("alice", "hubot next train on patco from work");
      setTimeout( done, 1000 );
    });

    it( "should reply to the user", function() {
      assert.ok(this.room.messages[1][1].match(/By "patco", I assume you meant "Port Authority Transit Corporation"/))
    });
  });

  describe( "ask for onestop id for the stop if unknown", function() {

    beforeEach(function(done) {
      dotty.put( this, "room.robot.brain.data.patco.lines.patco", "o-dr4e-portauthoritytransitcorporation" );
      this.room.user.say("alice", "hubot next train on patco from 15th 16th and Locust");
      setTimeout( done, 1000 );
    });

    it( "should reply to the user", function() {
      assert.ok(this.room.messages[1][1].match(/By "15th 16th and locust", I assume you meant "15-16th and Locust"/))
    });
  });

  describe( "set line and stop ids", function() {

    beforeEach(function(done) {
      this.room.user.say("alice", "hubot line PATCO onestop id is o-dr4e-portauthoritytransitcorporation");
      this.room.user.say("alice", "hubot stop 15th 16th and Locust onestop id is s-dr4e382mxm-15~16thandlocust");
      setTimeout( done, 1000 );
    });

    it( "should set the line's id and reply to the user", function() {
      assert.equal( this.room.robot.brain.data.patco.lines["patco"], "o-dr4e-portauthoritytransitcorporation" );
      assert.ok(this.room.messages[2][1].match(/onestop id for patco set to o-dr4e-portauthoritytransitcorporation/))
    });

    it( "should set the stop's id and reply to the user", function() {
      assert.equal( this.room.robot.brain.data.patco.stops["15th 16th and locust"], "s-dr4e382mxm-15~16thandlocust" );
      assert.ok(this.room.messages[3][1].match(/onestop id for 15th 16th and locust set to s-dr4e382mxm-15~16thandlocust/))
    });
  });

  describe( "find next times for defined trains", function() {

    beforeEach(function(done) {
      dotty.put( this, "room.robot.brain.data.patco.lines.patco", "o-dr4e-portauthoritytransitcorporation" );
      dotty.put( this, "room.robot.brain.data.patco.stops.15th 16th and locust", "s-dr4e382mxm-15~16thandlocust" );

      this.room.user.say("alice", "hubot next train on patco from 15th 16th and Locust");
      setTimeout( done, 1000 );
    });

    it( "should respond with the upcoming times within an hour", function() {
      assert.ok(this.room.messages[1][1].match("The next trains from 15th 16th and locust are 10:22pm to Lindenwold, 10:42pm to Lindenwold, 11:02pm to Lindenwold"));
    });
  });

  describe( "forget transit stops and lines", function() {

    beforeEach(function(done) {
      dotty.put( this, "room.robot.brain.data.patco.lines.patco", "o-dr4e-portauthoritytransitcorporation" );
      dotty.put( this, "room.robot.brain.data.patco.stops.15th 16th and locust", "s-dr4e382mxm-15~16thandlocust" );

      this.room.user.say("alice", "hubot forget all transit craps");
      this.room.user.say("alice", "hubot forget all transit lines");
      this.room.user.say("alice", "hubot forget all transit stops");
      setTimeout( done, 1000 );
    });

    it( "should respond with the upcoming times within an hour", function() {
      assert.ok(this.room.messages[3][1].match("Oh shit! I forgot all the transit lines!"));
      assert.ok(this.room.messages[4][1].match("Oh shit! I forgot all the transit stops!"));
    });
  });
});
