
module.exports = function( robot ) {

  var datagrams = [
    "http://www.basement.org/c/images/blog/night-cycle.gif",
    "http://blogs.msdn.com/blogfiles/mikewalker/WindowsLiveWriter/MappingCurrentStateArchitecturesacrossth_AFD0/image_10.png"
  ];

  robot.hear( /datagram/i, function( res ) {
    res.send( "Did somebody say... DATAGRAM?" );
    return setTimeout(function() {
      res.send( "Let me show you how they work..." );
      return res.send( res.random( datagrams ) );
    }, 2000);
  });

  robot.hear( /performance review/i, function( res ) {
    res.send( "Performance reviews?" );
    return setTimeout(function() {
      return res.send( "We'll do them in " + Math.floor(Math.random() * (18 - 2) + 2) + " days. I'll send you an invite" );
    }, 2000);
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
