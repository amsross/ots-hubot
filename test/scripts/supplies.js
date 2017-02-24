var Helper = require("hubot-test-helper");

describe("supplies", function() {

  before(function() {
    this.helper = new Helper("../../scripts/supplies.js");
  });

  beforeEach(function() {
    this.room = this.helper.createRoom();
    assert.equal(dotty.get(this.room, "robot.brain.data.supplies.@ralph"), undefined, "empty list");
  });

  afterEach(function() {
    this.room.destroy();
  });

  describe( "should add supplies to user's list and respond", function() {

    beforeEach(function(done) {
      this.room.user.say("ralph", "hubot supplies add @ralph soap, water, spit, moar beer");
      setTimeout( done, 250 );
    });

    it( "should reply to the user", function( done ) {
      assert.deepEqual(this.room.messages, [
        ["ralph", "hubot supplies add @ralph soap, water, spit, moar beer"],
        ["hubot", "Added soap, water, spit, moar beer to @ralph's list"],
      ]);

      assert.deepEqual(dotty.get(this.room, "robot.brain.data.supplies.ralph"), [
        "soap",
        "water",
        "spit",
        "moar beer",
      ], "updated list");

      done();
    });
  });

  describe( "should remove supplies from user's list and respond", function() {

    beforeEach(function(done) {
      dotty.put(this.room, "robot.brain.data.supplies.ralph", [
        "water",
        "spit",
        "moar beer",
      ]);
      this.room.user.say("ralph", "hubot supplies remove @ralph soap");
      setTimeout( done, 250 );
    });

    it( "should reply to the user", function( done ) {
      assert.deepEqual(this.room.messages, [
        ["ralph", "hubot supplies remove @ralph soap"],
        ["hubot", "Removed soap from @ralph's list"],
      ]);

      assert.deepEqual(dotty.get(this.room, "robot.brain.data.supplies.ralph"), [
        "water",
        "spit",
        "moar beer",
      ], "updated list");

      done();
    });
  });

  describe( "should show a user's list on request", function() {

    beforeEach(function() {
      dotty.put(this.room, "robot.brain.data.supplies.alice", [
        "soap",
        "paper towels",
      ]);
      dotty.put(this.room, "robot.brain.data.supplies.ralph", [
        "water",
        "spit",
        "moar beer",
      ]);
    });

    it( "should reply with the list for the asking user", function( done ) {

      this.room.user.say("ralph", "hubot supplies show");
      setTimeout(() => {
        assert.deepEqual(this.room.messages, [
          ["ralph", "hubot supplies show"],
          ["hubot", "@ralph's list is:\n * water\n * spit\n * moar beer"],
        ]);

        done();
      }, 250 );
    });

    it( "should reply with the list for the specified user", function( done ) {

      this.room.user.say("ralph", "hubot supplies show @alice");
      setTimeout(() => {
        assert.deepEqual(this.room.messages, [
          ["ralph", "hubot supplies show @alice"],
          ["hubot", "@alice's list is:\n * soap\n * paper towels"],
        ]);

        done();
      }, 250);
    });
  });
});

