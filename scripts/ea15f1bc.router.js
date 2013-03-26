define([
    // Application.
    "app",
    "modules/index"
],

function(app, Index) {

    // Defining the application router, you can attach sub routers here.
    var Router = Backbone.Router.extend({
        routes: {
            "": "index"
        },

        index: function() {

            // hide iOS address bar
            scrollTo(0,0);

            app.views.index = new Index.view()

        }
    });

    return Router;

});
