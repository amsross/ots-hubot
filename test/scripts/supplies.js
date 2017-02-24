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
      this.room.user.say("alice", "hubot supplies add @ralph soap, water, spit, moar beer");
      setTimeout( done, 250 );
    });

    it( "should reply to the user", function( done ) {
      assert.deepEqual(this.room.messages, [
        ["alice", "hubot supplies add @ralph soap, water, spit, moar beer"],
        ["hubot", "Added soap, water, spit, moar beer to @ralph's list"],
      ]);

      assert.deepEqual(dotty.get(this.room, "robot.brain.data.supplies.@ralph"), [
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
      dotty.put(this.room, "robot.brain.data.supplies.@ralph", [
        "water",
        "spit",
        "moar beer",
      ]);
      this.room.user.say("alice", "hubot supplies remove @ralph soap");
      setTimeout( done, 250 );
    });

    it( "should reply to the user", function( done ) {
      assert.deepEqual(this.room.messages, [
        ["alice", "hubot supplies remove @ralph soap"],
        ["hubot", "Removed soap from @ralph's list"],
      ]);

      assert.deepEqual(dotty.get(this.room, "robot.brain.data.supplies.@ralph"), [
        "water",
        "spit",
        "moar beer",
      ], "updated list");

      done();
    });
  });
});

