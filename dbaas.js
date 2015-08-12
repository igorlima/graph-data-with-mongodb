define(['jquery', 'backbone'], function($, Backbone) {
  var Channel, namespace, nsref;

  /**
    NOTE: Remeber you are using my application sample_app_with_d3.
    Appbase is completely free up to 100 thousand API calls per month.
    Feel free to use it while you're learning.
    After that, create your own application's name,
    then new learners can use my API calls left. Thanks.
  **/
  Appbase.credentials("pubsub_with_backbone_events", "fa97bda44848217908a1a2a3ccf7bf33");
  namespace = "my-first-namespace";
  nsref = Appbase.ns(namespace);
  /* END */

  Channel = $.extend( {}, Backbone.Events );

  Channel.on('disconnect', function() {
    nsref.off('vertex_added');
    nsref.off('vertex_removed');
  });

  Channel.on('retrieve-all-nodes', function() {
    nsref.on('vertex_added', function(err, vertexRef, obj) {

      Channel.trigger( 'node-added', $.extend( obj.properties() || {}, {
        id: vertexRef.name()
      } ) );

      vertexRef.on('properties', function(error, ref, snapObj) {
        Channel.trigger( 'node-edited', snapObj.properties() );
      });

      vertexRef.on('edge_added', function(error, edgeRef, snapObj) {
        vertexRef.once('properties', function(error_source, ref_target, obj_target) {
          edgeRef && edgeRef.once('properties', function(error_target, ref_source, obj_source) {
            Channel.trigger( 'link-added', {
              source: obj_source.properties(),
              target: obj_target.properties(),
              id: edgeRef.name()
            });
          });
        });
      });

      vertexRef.on('edge_removed', function(error, edgeRef, snapObj) {
        Channel.trigger( 'link-removed' , {id: edgeRef.name()});
      });

    });

    nsref.on('vertex_removed', function(err, vertexRef, obj) {
      Channel.trigger( 'node-removed', obj.properties() );
    });

  });

  Channel.on('add-node', function( node, cb ) {
    var id = Appbase.uuid(), vref = nsref.v(id);
    node.id = id;
    vref.setData(node);

    if (cb) {
      cb(node);
    } else {
      Channel.trigger( 'node-added', node );
    }
  });

  Channel.on('edit-node', function(node) {
    if (node && node.id) {
      nsref.v(node.id).setData(node);
      Channel.trigger( 'node-edited', node );
    }
  } );

  Channel.on('remove-node', function(node) {
    if (node && node.id) {
      nsref.v(node.id).destroy();
      Channel.trigger( 'node-removed', node.id );
    }
  });

  Channel.on('add-link', function(link) {
    var source, target, id;
    if (!link || !link.source || !link.target || !link.source.id || !link.target.id) return;
    source = nsref.v(link.source.id);
    target = nsref.v(link.target.id);
    id = Appbase.uuid();
    source.setEdge( id, target, function(error) {
      if (error) {
        console.error( 'add-link', error );
      } else {
        link.id = id;
        Channel.trigger( 'link-added', link );
      }
    } );
  });

  Channel.on('remove-link', function(link) {
    if (link && link.id) {
      nsref.v( link.target.id ).removeEdge( [link.id] );
      Channel.trigger( 'link-removed', link );
    }
  });

  return Channel;
});

