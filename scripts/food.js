module.exports = function( robot ) {

  var phrases = [
      '/giphy food'
    ];

    robot.hear( /\b(where's the food)\b/i, function( res ) {
      return res.send( res.random( phrases ) );
    });

  };
