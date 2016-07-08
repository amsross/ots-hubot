var Helper = require("hubot-test-helper")

describe("github", function() {

  before(function() {
    this.helper = new Helper("../../scripts/github.js");
  });

  beforeEach(function() {
    process.env.EXPRESS_PORT = 8888;
    this.room = this.helper.createRoom();
  });

  afterEach(function() {
    this.room.destroy();
  });

  describe( "POST /payload/github", function() {

    beforeEach(function() {

      nock("https://api.github.com")
        .get("/repos/amsross/grunt-unison/issues/2")
        .reply(200, {
          "url": "https://api.github.com/repos/amsross/grunt-unison/issues/2",
          "html_url": "https://github.com/amsross/grunt-unison/pull/2",
          "comments_url": "https://api.github.com/repos/amsross/grunt-unison/issues/2/comments",
          "state": "open",
          "assignees": [ { "login": "amsross" } ],
          "pull_request": { "url": "https://api.github.com/repos/amsross/grunt-unison/pulls/2" }
        });

      nock("https://api.github.com")
        .get("/repos/amsross/grunt-unison/issues/2/comments")
        .reply(200, [
            { "user": { "login": "amsross", }, "body": "Notes" },
            { "user": { "login": "amsross", }, "body": ":+1:" },
            { "user": { "login": "amsross", }, "body": "testing" }
        ]);

      nock("https://api.github.com")
        .put("/repos/amsross/grunt-unison/pulls/2/merge", /.*/ )
        .reply(201, {
          message: "bar"
        });

      this.postData = {
        "issue": {
          "url": "https://api.github.com/repos/amsross/grunt-unison/issues/2",
        }
      };

      this.options = {
        hostname: "localhost",
        port: 8888,
        path: "/payload/github",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(JSON.stringify(this.postData)),
          "X-Github-Event": "issue_comment",
          "X-Hub-Signature": "sha1=d8a7080d30ed004e94ac4bb455a3f7d6c7acd7d1",
        }
      };
    });

    afterEach(function() {
      nock.cleanAll();
    });

    it( "should deny an invalid secret", function( done ) {

      this.options.headers["X-HUB-Signature"] = "invalid HMAC";

      var req = http.request(this.options, (res) => {
        assert.equal( res.statusCode, 500, "res.statusCode" );
        res.on("data", (body) => {
          assert.equal( body, "Invalid secret", "body" );
        });
        res.on("end", done);
      });
      req.write(JSON.stringify(this.postData));
      req.end();
    });

    it( "should merge the pull request if the criteria are met", function( done ) {

      var req = http.request(this.options, (res) => {
        res.setEncoding("utf8");
        assert.equal( res.statusCode, 200, "res.statusCode" );
        res.on("data", (body) => {
          assert.equal( body, "OK", "body" );
        });
        res.on("end", () => {
          assert.deepEqual(
              this.room.messages,
              [
              ["hubot", "merged https://github.com/amsross/grunt-unison/pull/2"],
              ]
              );
          done();
        });
      });
      req.write(JSON.stringify(this.postData));
      req.end();
    });
  });

  describe( "@bot merge (.*) (.*) into (.*)/i", function() {

    beforeEach(function(done) {
      nock("https://api.github.com")
        .post("/repos/onetwosee/ots-hubot/merges", {
          base: "master",
          head: "staging",
          commit_message: "merged by @hubot for @alice"
        })
        .reply(201, {
          commit: {
            message: "merged by @hubot for @alice"
          }
        });

      this.room.user.say("alice", "hubot merge onetwosee/ots-hubot staging into master");
      setTimeout( done, 1000 );
    });

    afterEach(function() {
      nock.cleanAll();
    });

    it( "should reply to the user", function() {
      assert.deepEqual(
          this.room.messages,
          [
          ["alice", "hubot merge onetwosee/ots-hubot staging into master"],
          ["hubot", "merged by @hubot for @alice"],
          ]
          );
    });
  });
});
