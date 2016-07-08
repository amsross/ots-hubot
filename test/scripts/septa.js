var assert = require("assert");
var Helper = require("hubot-test-helper")

describe("septa", function() {

  before(function() {
    this.helper = new Helper("../../scripts/septa.js");
  });

  beforeEach(function() {
    this.room = this.helper.createRoom();
  });

  afterEach(function() {
    this.room.destroy();
  });

  describe( "should respond in some way", function() {

    beforeEach(function(done) {
      this.room.user.say("alice", "hubot is septa fucked");
      setTimeout( done, 1000 );
    });

    it( "should reply to the user", function( done ) {
      assert.ok(this.room.messages[1][1].match(/Regional Rail/))
      done();
    });
  });
});
