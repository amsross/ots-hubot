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

  // this is making calls to the live API during the test
  describe.skip( "should respond if septa is fucked", function() {

    beforeEach(function(done) {
      this.room.user.say("alice", "hubot is septa fucked");
      setTimeout( done, 1000 );
    });

    it( "should reply to the user", function( done ) {
      assert.ok(this.room.messages[1][1].match(/Regional Rail/))
      done();
    });
  });

  // this is making calls to the live API during the test
  describe.skip( "should say what trains are fucked", function() {

    it( "should reply to the user when using 'which'", function( done ) {
      this.room.user.say("alice", "hubot which trains");
      setTimeout( function() {
        assert.ok(this.room.messages.length > 1);
        done();
      }.bind(this), 1000);
    });

    it( "should reply to the user when using 'what'", function( done ) {
      this.room.user.say("alice", "hubot what trains");
      setTimeout( function() {
        assert.ok(this.room.messages.length > 1);
        done();
      }.bind(this), 1000);
    });
  });
});
