const fs = require('fs');
const path = require('path');
var emojiList = [];

module.exports = function (robot) {

  robot.hear(/(.*) emoji/i, function(msg) {
    const match = msg.match[1].trim();

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

