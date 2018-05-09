// Description:
//   Jasonisms
//
// Dependencies:
//   None
//
// Configuration:
//   None
//
// Commands:
//   hubot datagram - a nice clear, concise explanation
//   hubot permormance review - get the performance review schedule
//   hubot meeting - just don't
//
// Author:
//   amsross

module.exports = function( robot ) {

  var datagrams = [
    "http://www.basement.org/c/images/blog/night-cycle.gif",
    "http://blogs.msdn.com/blogfiles/mikewalker/WindowsLiveWriter/MappingCurrentStateArchitecturesacrossth_AFD0/image_10.png",
    "It's like sexual chocolate"
  ];

  robot.hear( /datagram/i, function( res ) {
    res.send( "Did somebody say... DATAGRAM?" );
    return setTimeout(function() {
      res.send( "Let me show you how they work..." );
      return res.send( res.random( datagrams ) );
    }, 1500);
  });

  robot.hear( /performance review/i, function( res ) {
    res.send( "Performance reviews?" );
    return setTimeout(function() {
      return res.send( res.random([
        "We'll do them in " + Math.floor(Math.random() * (18 - 2) + 2) + " days. I'll send you an invite.",
        "You'll get a performance review when I friggin' feel like it."
      ]));
    }, 1500);
  });

  robot.hear( /meeting/i, function( res ) {
    res.send( "Jam sesh?" );
    return setTimeout(function() {
      return res.send( res.random([
        "You wanna jam it out?",
        "We don't NEED an agenda!",
        "Let's just go around the room!",
        "Who wants to start?",
        "You guys know how we love to start; with a big clap. Clap it up, lets go! :clap: :clap: :clap:"
      ]));
    }, 1000);
  });
};
