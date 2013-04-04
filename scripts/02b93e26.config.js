// Set the require.js configuration for your application.
require.config({

  // Initialize the application with the main application file.
  deps: ["main"],

  paths: {
    // JavaScript folders.
    libs        : "../scripts/libs",
    plugins     : "../scripts/plugins",
    templates   : "../templates",
    json        : "../json",

    // Libraries.
    jquery      : "../scripts/libs/jquery",
    lodash      : "../scripts/libs/lodash",
    backbone    : "../scripts/libs/backbone",
    text        : "../scripts/libs/text",
    //icalendar   : "../scripts/libs/jquery.icalendar.min"
    icalendar   : "../scripts/libs/jquery.icalendar",
    app2home    : "../scripts/libs/add2home"
  },

  shim: {
    // Backbone library depends on lodash and jQuery.
    backbone: {
      deps      : ["lodash", "jquery"],
      exports   : "Backbone"
    },

    // Backbone.LayoutManager depends on Backbone.
    "plugins/backbone.layoutmanager": ["backbone"]
  }

});
