
// https://devcenter.heroku.com/articles/mongolab
var express    = require('express'),
    mongoose   = require('mongoose'),
    bodyParser = require('body-parser'),
    app    = express(),
    http   = require('http').Server(app),
    io     = require('socket.io')(http),
    extend = require('extend'),

    // Mongoose Schema definition
    Edge = mongoose.model('Edge', {
      id: String,
      source: {
        id: String,
        weight: Number
      },
      target: {
        id: String,
        weight: Number
      }
    }),

    Vertex = mongoose.model('Vertex', {
      id: String,
      color: String,
      label: String
    });

/*
 * I’m sharing my credential here.
 * Feel free to use it while you’re learning.
 * After that, create and use your own credential.
 * Thanks.
 *
 * MONGOLAB_URI=mongodb://example:example@ds033113.mongolab.com:33113/graph
 * 'mongodb://example:example@ds033113.mongolab.com:33113/graph'
 */
mongoose.connect(process.env.MONGOLAB_URI, function (error) {
    if (error) console.error(error);
    else console.log('mongo connected');
});
/** END */


app
  .use(express.static(__dirname + '/'))
  // https://scotch.io/tutorials/use-expressjs-to-get-url-and-post-parameters
  .use(bodyParser.json()) // support json encoded bodies
  .use(bodyParser.urlencoded({ extended: true })) // support encoded bodies
  ;

http.listen(process.env.PORT || 5000, function(){
  console.log('listening on *:5000');
});

io.on('connection', function(socket){

  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('retrieve-all-nodes', function() {
    Vertex.find( function( err, nodes) {
      nodes.forEach(function(node) {
        node.id = node._id;
        socket.emit( 'node-added', node );
      });
      Edge.find( function(err, links) {
        links.forEach(function(link) {
          link.id = link._id;
          socket.emit( 'link-added', link );
        });
      } );
    });
  });

  // socket.on('remove-all-nodes', function() {
  // ...
  // });

  socket.on('add-node', function( node, cb ) {
    var vertex = new Vertex( node );
    node.id = vertex._id;
    vertex.save(function (err) {
      cb && cb(node);
      socket.broadcast.emit( 'node-added', node );
      socket.emit( 'node-added', node );
    });
  });

  socket.on('edit-node', function(node) {
    if (node && node.id) {
      Vertex.findById( node.id, function (err, vertex) {
        vertex.label = node.label;
        vertex.color = node.color;
        vertex.save( function(err) {
          socket.emit( 'node-edited', node );
          socket.broadcast.emit( 'node-edited', node );
        });
      } );
    }
  } );

  socket.on('remove-node', function(node) {
    if (node && node.id) {
      Vertex.findById( node.id, function(err, vertex) {
        vertex.remove( function(err) {
          socket.emit( 'node-removed', node );
          socket.broadcast.emit( 'node-removed', node );
        });
      } );
    }
  });

  socket.on('add-link', function(link, cb) {
    var edge = new Edge( link );
    link.id = edge._id;
    edge.save( function(err) {
      cb && cb(link);
      socket.broadcast.emit( 'link-added', link );
      socket.emit( 'link-added', link );
    } );
  });

  socket.on('remove-link', function(link) {
    if (link && link.id) {
      Edge.findById( link.id, function(err, edge) {
        edge.remove( function(err) {
          socket.broadcast.emit( 'link-removed', link );
          socket.emit( 'link-removed', link );
        } );
      });
    }
  });

});

