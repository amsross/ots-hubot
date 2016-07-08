var Helper = require("hubot-test-helper");

describe("cowsay", function() {

  before(function() {
    this.helper = new Helper("../../scripts/cowsay.js");
  });

  beforeEach(function() {
    this.room = this.helper.createRoom();
  });

  afterEach(function() {
    this.room.destroy();
  });

  describe( "should reply with the message in a cow speech bubble", function() {

    beforeEach(function(done) {
      this.room.user.say("alice", "hubot cowsay moo");
      setTimeout( done, 1000 );
    });

    it( "should reply to the user", function( done ) {
      assert.deepEqual(
          this.room.messages,
          [
          ["alice", "hubot cowsay moo"],
          ["hubot", "```\n  ___\n< moo >\n  ---\n         \\   ^__^ \n          \\  (oo)\\_______\n             (__)\\       )\\/\\\n                 ||----w |\n                 ||     ||\n    \n```"],
          ]
          );
      done();
    });
  });
});
