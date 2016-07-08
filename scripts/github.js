// Description:
//   Github.
//
// Dependencies:
//   githubot
//
// Configuration:
//   None
//
// Commands:
//   hubot github merge <branch> <head> into <base> - Returns the top gist for the specified user
//
// Notes:
//  None
//
// Author:
//   amsross
var _ = require("underscore");
var crypto = require("crypto");
var github = require("githubot");
var githubSecret = "93439f305146471bbd811cc2a916a9547a45f4c6";

module.exports = function (robot) {

  robot.router.post( "/payload/github", (req, res) => {
    var data   = req.body;
    var secret = req.headers["x-hub-signature"];
    var githubCrypto = crypto.createHmac("sha1", githubSecret).update(JSON.stringify(req.body)).digest("hex");

    if ( secret !== "sha1=" + githubCrypto ) return res.send(500, "Invalid secret");

    if ( req.headers["x-github-event"] === "issue_comment" ) {
      mergePullIfApproved( robot, data.issue, res.send.bind(res, "OK") );
    }
  });

  robot.respond(/merge (.*) (.*) into (.*)/i, function(msg) {
    var commitMessage = "merged by @" + robot.name + " for @" + msg.message.user.name;
    github.branches( msg.match[1] )
      .merge( msg.match[2], {base: msg.match[3], message: commitMessage}, (mergeCommit) => {
        return msg.send( mergeCommit.message || commitMessage );
      });
  });
};

function mergePullIfApproved( robot, issue, cb ) {
  // get the issue
  github.get( issue.url, (issue) => {
    // check if it's open
    var is_open = issue.state === "open";
    // check if it's a pull request
    var is_pull = issue.pull_request && !_.isEmpty( issue.pull_request );

    if ( !is_open || !is_pull ) return cb();

    // get all the existing comments
    github.get( issue.comments_url, (comments) => {
      // count unique :+1:'s in pull request
      var approvals = _.chain(comments)
        .filter((comment) => {
          return /:\+1:|:thumbsup:/.test(comment.body);
        })
        .pluck("user")
        .pluck("login")
        .uniq()
        .intersection( _.pluck( issue.assignees, "login" ) )
        .value();

      // count assignees
      // if >= 75% of assignees agree
      if ( ( approvals.length / issue.assignees.length ) >= 0.66 ) {
        //  merge
        github.put( issue.pull_request.url + "/merge", {
          commit_message: "Merged by @" + robot.name + "[BOT] on approval from " + approvals.map((user) => {
            return `@${user}`;
          }).join(", ")
        }, (pull) => {
          //  comment in room
          robot.messageRoom( "botworld", "merged " + issue.html_url );
          return cb();
        });
      } else {
        robot.messageRoom( "botworld", "not ready to merge " + issue.html_url );
        return cb();
      }
    });
  });
}
