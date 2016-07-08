"use strict";

var Helper = require("hubot-test-helper")

class MockResponse extends Helper.Response {
  random(items) {
    return "random item";
  }
}

describe("jasonisms", function() {

  before(function() {
    this.helper = new Helper("../../scripts/jasonisms.js");
  });

  beforeEach(function() {
    this.room = this.helper.createRoom({'response': MockResponse});
  });

  afterEach(function() {
    this.room.destroy();
  });

  describe( "should explain datagrams", function() {

    beforeEach(function(done) {
      this.timeout(0);
      this.room.user.say("alice", "I love datagrams!");
      setTimeout( done, 2000 );
    });

    it( "should reply to the user", function( done ) {
      assert.deepEqual(
          this.room.messages,
          [
          ["alice", "I love datagrams!"],
          ["hubot", "Did somebody say... DATAGRAM?"],
          ["hubot", "Let me show you how they work..."],
          ["hubot", "random item"],
          ]
          );
      done();
    });
  });

  describe( "should lay out the performace review schedule", function() {

    beforeEach(function(done) {
      this.timeout(0);
      this.room.user.say("alice", "When is my performance review?");
      setTimeout( done, 2000 );
    });

    it( "should reply to ths user", function( done ) {
      assert.deepEqual(
          this.room.messages,
          [
          ["alice", "When is my performance review?"],
          ["hubot", "Performance reviews?"],
          ["hubot", "random item"],
          ]
          );
      done();
    });
  });

  describe( "should encourage mindshare", function() {

    beforeEach(function(done) {
      this.timeout(0);
      this.room.user.say("alice", "Maybe we should have a meeting?");
      setTimeout( done, 2000 );
    });

    it( "should reply to the user", function( done ) {
      assert.deepEqual(
          this.room.messages,
          [
          ["alice", "Maybe we should have a meeting?"],
          ["hubot", "Jam sesh?"],
          ["hubot", "random item"],
          ]
          );
      done();
    });
  });
});
