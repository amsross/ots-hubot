
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
};
