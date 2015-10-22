
module.exports = function( robot ) {

  var datagrams = [
    "http://www.basement.org/c/images/blog/night-cycle.gif",
    "http://blogs.msdn.com/blogfiles/mikewalker/WindowsLiveWriter/MappingCurrentStateArchitecturesacrossth_AFD0/image_10.png"
  ];

  return robot.hear( /datagram/i, function( res ) {
    res.send( "Did somebody say... DATAGRAM?" );
    return setTimeout(function() {
      res.send( "Let me show you how they work..." );
      return res.send( res.random( datagrams ) );
    }, 2000);
  });

  return robot.hear( /meeting/i, function( res ) {
    res.send( "Jam sesh?" );
    return setTimeout(function() {
      return res.send( res.random([
          "You wanna jam it out?",
          "We don't NEED an agenda!",
          "Let's just go around the room!",
          "Who wants to start?",
          "CLAP IT OUT!"
      ]));
    }, 1000);
  });
};
