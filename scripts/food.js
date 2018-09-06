module.exports = function( robot ) {

  var phrases = [
    "https://media3.giphy.com/media/eSQKNSmg07dHq/giphy.gif",
    "https://media0.giphy.com/media/3oEduTny9qJEtpGElG/giphy.gif",
    "https://media3.giphy.com/media/CjJ7wMHjSUiE8/giphy.gif",
    "https://media0.giphy.com/media/494alKLkjJz1K/giphy.gif",
    "https://media3.giphy.com/media/3osxY7eI6enqNBo2mQ/giphy.gif",
    "https://media3.giphy.com/media/Tk6rydnaWKZoc/giphy.gif",
    "https://media0.giphy.com/media/10VRhZMAqZbOgw/giphy.gif",
    "https://media2.giphy.com/media/10ADU4ag31l63C/giphy.gif",
    "https://media1.giphy.com/media/11sFH7QYAzLE0E/giphy.gif",
    "https://media3.giphy.com/media/btxze9OUeiPbW/giphy.gif",
    "https://media2.giphy.com/media/7JzHsh3UTip20/giphy.gif",
    "https://media0.giphy.com/media/xUA7bjfr8Q1BB3LbJm/giphy.gif",
    "https://media3.giphy.com/media/2s7lb48XP0yje/giphy.gif",
    "https://media3.giphy.com/media/l3vQYwp6SXnoh4S40/giphy.gif",
    "https://media2.giphy.com/media/l2JHRhAtnJSDNJ2py/giphy.gif",
    "https://media1.giphy.com/media/GnCc88zZhSVUc/giphy.gif",
    "https://media1.giphy.com/media/jKaFXbKyZFja0/giphy.gif",
    "https://media1.giphy.com/media/SasDDqOSRclNu/giphy.gif",
    "https://media0.giphy.com/media/orsKKFqWKtsVa/giphy.gif",
    "https://media2.giphy.com/media/IgOEWPOgK6uVa/giphy.gif",
    "https://media3.giphy.com/media/ef61oIGVyckY8/giphy.gif",
    "https://media2.giphy.com/media/8MObiTsZrFlTi/giphy.gif",
    "https://media2.giphy.com/media/rvpypEWnQyvUA/giphy.gif",
    "https://media3.giphy.com/media/eMeMQ0Y4DHS2k/giphy.gif",
    "https://media3.giphy.com/media/ZeB4HcMpsyDo4/giphy.gif"
  ];

  robot.hear( /\b(where'?s the food)\b/i, function( res ) {
    return res.send( res.random( phrases ) );
  });

};
