define(['backbone'], function(Backbone) {

  return Backbone.Model.extend({

    initialize: function( options ) {
      this.on('change:id',    this.notifyEachIdChange,    this);
      this.on('change:color', this.notifyEachColorChange, this);
      this.on('change:label', this.notifyEachLabelChange, this);
    },

    notifyEachIdChange: function() {
      console.log( 'id was changed' );
    },

    notifyEachColorChange: function() {
      console.log( 'color was changed' );
    },

    notifyEachLabelChange: function() {
      console.log( 'label was changed' );
    }

  });

});
