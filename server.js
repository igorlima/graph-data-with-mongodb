var express      = require('express');
 
var app = express()
  .use(express.static(__dirname + '/'))
  .listen(process.env.PORT || 5000, function() {
    console.log('listening on *:' + (process.env.PORT || 5000) );
  });
