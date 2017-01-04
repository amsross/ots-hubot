var Helper = require("hubot-test-helper")

describe("appdynamics", function() {

  before(function() {
    this.helper = new Helper("../../scripts/appdynamics.js");
  });

  beforeEach(function() {
    this.room = this.helper.createRoom();
  });

  afterEach(function() {
    nock.cleanAll();
    this.room.destroy();
  });

  describe( "send payload", function() {

    beforeEach(function(done) {
      request
        .post("http://127.0.0.1:8080/appdynamics/alert")
        .form({
          deepLink: "https://paid73.saas.appdynamics.com/controller/#location=APP_EVENT_VIEWER_MODAL&eventSummary=1505209417",
          displayName: "New Critical Health Rule Violation",
          summaryMessage: "AppDynamics has detected a problem with Tier <b>data-api</b>.<br><b>App unavailability</b> started violating and is now <b>critical</b>.",
          tierName: "data-api",
          nodeName: "wcdc-c-01-football-cfb-0",
          eventMessage: "AppDynamics has detected a problem with Tier <b>data-api</b>.<br><b>App unavailability</b> started violating and is now <b>critical</b>.<br>All of the following conditions were found to be violating<br>For Node <b>wcdc-c-01-football-cfb-0</b>:<br>1) condition 1<br><b>Availability's</b> value <b>0.0</b> was <b>less than</b> the threshold <b>1.0</b> for the last <b>5</b> minutes<br>For Node <b>wcdc-c-01-football-cfb-1</b>:<br>1) condition 1<br><b>Availability's</b> value <b>0.0</b> was <b>less than</b> the threshold <b>1.0</b> for the last <b>5</b> minutes<br>"
        });

      setTimeout( done, 250 );
    });

    it( "should send message to specified room", function() {
      var message = this.room.messages[0][1];

      assert(message.title, "title exists");
      assert(message.text, "text exists");
      assert(message.username, "username exists");
      assert(message.icon_emoji, "icon_emoji exists");
      assert(message.mrkdwn, "mrkdwn exists");
      assert(message.attachments, "attachments exists");

      message.attachments.forEach(function(attachment) {
        assert(attachment.color, "color exists");
        assert(attachment.fields, "fields exists");

        attachment.fields.forEach(function(field) {
          assert(field.title, "title exists");
          assert(field.value, "value exists");
          assert.equal(typeof field.short, "boolean", "short exists");
        });
      });

      assert(message.attachments[0].fields[0].value, "AppDynamics has detected a problem with Tier *data-api*.*App unavailability* started violating and is now *critical*.", "message should be slackified");
      assert(message.attachments[0].fields[3].value, "AppDynamics has detected a problem with Tier *data-api*.*App unavailability* started violating and is now *critical*.All of the following conditions were found to be violatingFor Node *wcdc-c-01-football-cfb-0*:1) condition 1*Availability's* value *0.0* was *less than* the threshold *1.0* for the last *5* minutesFor Node *wcdc-c-01-football-cfb-1*:1) condition 1*Availability's* value *0.0* was *less than* the threshold *1.0* for the last *5* minutes", "message should be slackified");
    });
  });
});
