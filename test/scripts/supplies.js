var Helper = require("hubot-test-helper");

describe("supplies", function() {

  before(function() {
    this.helper = new Helper("../../scripts/supplies.js");
  });

  beforeEach(function() {
    this.room = this.helper.createRoom();
  });

  afterEach(function() {
    this.room.destroy();
  });

  describe( "should reply with the message in a cow speech bubble", function() {

    beforeEach(function(done) {
      assert.equal(dotty.get(this.room, "robot.brain.data.supplies.@ralph"), undefined, "empty list");
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
});

