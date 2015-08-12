define(['jquery', 'backbone', 'io'], function($, Backbone, io) {
  var Channel;

  var socket = io();

  Channel = $.extend( {}, Backbone.Events );

  Channel.on('disconnect', function() {
    console.warn('disconnected');
  });

  Channel.on('retrieve-all-nodes', function() {
    socket.emit('retrieve-all-nodes');
    socket.on( 'node-added', function(node) {
      Channel.trigger( 'node-added', node );
    } );

    socket.on( 'node-edited', function(node) {
      Channel.trigger( 'node-edited', node );
    } );

    socket.on( 'node-removed', function(node) {
      Channel.trigger( 'node-removed', node );
    } );

    socket.on( 'link-added', function(link) {
      Channel.trigger( 'link-added', link );
    } );

    socket.on( 'link-removed', function(link) {
      Channel.trigger( 'link-removed', link );
    } );

  });

  Channel.on('add-node', function( node, cb ) {
    socket.emit( 'add-node', node, function(obj) {
      if (cb) {
        node.id = obj.id;
        cb(node);
      }
    } );
  });

  Channel.on('edit-node', function(node) {
    if (node && node.id) {
      socket.emit( 'edit-node', node );
    }
  } );

  Channel.on('remove-node', function(node) {
    if (node && node.id) {
      socket.emit( 'remove-node', node );
    }
  });

  Channel.on('add-link', function(link) {
    if (!link || !link.source || !link.target || !link.source.id || !link.target.id) return;

    socket.emit( 'add-link', link, function(obj) {
      link.id = obj.id;
      Channel.trigger( 'link-added', link );
    } );

  });

  Channel.on('remove-link', function(link) {
    if (link && link.id) {
      socket.emit( 'remove-link', link, function() {
        Channel.trigger( 'link-removed', link );
      } );
    }
  });

  return Channel;
});

