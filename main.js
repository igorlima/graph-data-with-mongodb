require.config({
  baseUrl: '/',
  paths: {
    backbone: 'bower_components/backbone/backbone-min',
    bootstrap: 'bower_components/bootstrap/dist/js/bootstrap.min',
    colorpicker: 'bower_components/xaguilars-bootstrap-colorpicker/dist/js/bootstrap-colorpicker.min',
    d3: 'bower_components/d3/d3.v2.min',
    jquery: 'bower_components/jquery/dist/jquery.min',
    underscore: 'bower_components/underscore/underscore-min',

    forceView: 'force-view',
    myView: 'my-backbone-view',
    myModel: 'my-backbone-model',
    dbaas: 'dbaas'
  },
  shim: {
    bootstrap: {
      deps: ['jquery']
    },
    d3: {
      exports: 'd3'
    },
    colorpicker: ['jquery']
  }
});

require( [ 'myView', 'bootstrap', 'colorpicker' ], function( MyView ) {
  new MyView();
} );
