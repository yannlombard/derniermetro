define([
    // Application.
    'app',
    'jquery',
    'lodash',
    'backbone',
    'text!templates/duration.html'

],function(app, $, _, Backbone, durationTemplate) {

    var Duration = {};

    /**
     * backbone view
     */
    Duration.view = Backbone.View.extend({

        template: _.template(durationTemplate),

        initialize: function() {

            this.model.on('change:durationReady', this.render, this);

        },

        render: function() {

            if(this.model.get('durationReady')) {

                this.$el.html(this.template(this.model.toJSON()));

            }

        }

    });

    return Duration;

});
