define([
    // Application.
    'app',
    'jquery',
    'lodash',
    'backbone',
    'text!templates/last-metro.html'

],function(app, $, _, Backbone, lastMetroTemplate) {

    var LastMetro = {};

    /**
     * backbone view
     */
    LastMetro.view = Backbone.View.extend({

        template: _.template(lastMetroTemplate),

        initialize: function() {

            this.model.on('change:durationReady', this.render, this);
            this.model.on('change:defaultWay', this.render, this);

        },

        render: function() {

            this.$el.html(this.template(this.model.toJSON()));

        }

    });

    return LastMetro;

});
