const fs = require('fs');
const path = require('path');
var emojiList = [];

module.exports = function (robot) {

  robot.hear(/(.*) emoji(.*)/i, function(msg) {
    const match = msg.match[1].trim().split(' ').pop();

    if(!emojiList.length){
      parseFile(path.join(__dirname, '/emojiList.txt')).then(() => respond(msg, match));
    }else{
      respond(msg, match);
    }

  });
};

function respond(msg, match){
  var matching = emojiList.filter(e => e.includes(match));
  if(matching.length){
    matching = shuffle(matching).slice(0, 30);
    return msg.send(matching.join(''));
  }
}

function parseFile(fileName) {
  return new Promise(function(resolve, reject){
    fs.readFile(fileName, 'utf8', (err, data) => {
      if(err){ return reject(err); }

      emojiList = data.split('\n');
      resolve();
    });
  });
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}