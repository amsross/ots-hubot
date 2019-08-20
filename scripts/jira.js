// Description:
//   Using jira
//
const request = require("request");
const moment = require("moment");

module.exports = function( robot ) {

    robot.hear( /\b(jira)\b/i, function( res ) {
      getComicImage(moment().subtract(randomIntFromInterval(0, 365), 'days'), res)
    });

  };

function getComicImage(dt, res){
  var comicUrl = 'http://dilbert.com/strip/' + (dt.format('YYYY-MM-DD'))
  console.log('fetching ' + comicUrl);
  request(comicUrl, function(error, response, body){
    if(error) return;

    var imageUrl = findImageUrl(body);

    if(imageUrl){
      return res.send(imageUrl);
    }
  });
}

function findImageUrl(html){
  let rg = /(\/\/assets.amuniversal.com\/[a-f0-9]+)/gm;
  let match = html.match(rg);
  return match ? 'https:' + match[0] : undefined;
}

function randomIntFromInterval(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}